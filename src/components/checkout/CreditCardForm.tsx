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
      const requestBody = {
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

      console.log('Sending payment request:', JSON.stringify(requestBody))

      const { data, error } = await supabase.functions.invoke('payment', {
        body: JSON.stringify(requestBody)
      })

      if (error) throw error

      toast({
        title: "Pagamento processado com sucesso!",
        description: "Seu pagamento foi confirmado.",
      })

      onSuccess(data.id)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CardNumberField form={form} />
        <CardHolderField form={form} />
        
        <div className="grid grid-cols-2 gap-4">
          <CardExpiryField form={form} />
          <CardCVVField form={form} />
        </div>

        <InstallmentsField form={form} amount={amount} />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : "Pagar"}
        </Button>
      </form>
    </Form>
  )
}