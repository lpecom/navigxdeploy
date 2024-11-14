import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CardNumberField } from "./form/CardNumberField"
import { CardHolderField } from "./form/CardHolderField"
import { CardExpiryField } from "./form/CardExpiryField"
import { CardCVVField } from "./form/CardCVVField"
import { InstallmentsField } from "./form/InstallmentsField"
import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

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
  const { toast } = useToast()
  
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
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase.functions.invoke('payment', {
        body: {
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
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando...</span>
              </div>
            ) : (
              `Pagar R$ ${amount.toFixed(2)}`
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}