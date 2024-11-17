import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CardNumberField } from "./form/CardNumberField"
import { CardHolderField } from "./form/CardHolderField"
import { CardExpiryField } from "./form/CardExpiryField"
import { CardCVVField } from "./form/CardCVVField"
import { InstallmentsField } from "./form/InstallmentsField"
import { motion } from "framer-motion"
import { CreditCard, ShieldCheck } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { Alert, AlertDescription } from "@/components/ui/alert"

const creditCardSchema = z.object({
  card_number: z.string().min(16).max(19),
  holder_name: z.string().min(3),
  expiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cvv: z.string().length(3),
  installments: z.string(),
})

interface CreditCardFormProps {
  amount: number
  driverId: string
  onSuccess: (paymentId: string) => void
}

export const CreditCardForm = ({ amount, driverId, onSuccess }: CreditCardFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()
  const { state: cartState } = useCart()
  
  const form = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      card_number: "",
      holder_name: "",
      expiry: "",
      cvv: "",
      installments: "1",
    },
  })

  const onSubmit = async (values: z.infer<typeof creditCardSchema>) => {
    if (!showConfirmation) {
      setShowConfirmation(true)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        action: 'create_payment',
        payload: {
          driver_id: driverId,
          amount,
          payment_type: 'credit',
          card_number: values.card_number.replace(/\s/g, ''),
          holder_name: values.holder_name,
          expiry: values.expiry,
          cvv: values.cvv,
          installments: parseInt(values.installments),
          description: 'Car rental payment'
        }
      }

      const { data, error } = await supabase.functions.invoke('payment', {
        body: JSON.stringify(payload)
      })

      if (error) throw error

      toast({
        title: "Pagamento processado com sucesso!",
        description: "Seu pagamento foi confirmado.",
      })

      onSuccess(data.transaction_id)
    } catch (error: any) {
      console.error('Payment error:', error)
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Confirmar Pagamento</h3>
          <p className="text-gray-600">Por favor, revise os detalhes do seu pagamento</p>
        </div>

        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Valor Total:</span>
                <span className="font-semibold">R$ {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Parcelas:</span>
                <span>{form.getValues("installments")}x de R$ {(amount / parseInt(form.getValues("installments"))).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cartão:</span>
                <span>**** **** **** {form.getValues("card_number").slice(-4)}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setShowConfirmation(false)}
          >
            Voltar
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando..." : "Confirmar Pagamento"}
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-6">
        <div className="bg-primary/10 p-4 rounded-full">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <CardNumberField form={form} />
            <CardHolderField form={form} />
            
            <div className="grid grid-cols-2 gap-4">
              <CardExpiryField form={form} />
              <CardCVVField form={form} />
            </div>

            <InstallmentsField form={form} amount={amount} />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02]" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando..." : `Pagar R$ ${amount.toFixed(2)}`}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}