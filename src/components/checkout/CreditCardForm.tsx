import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

const creditCardSchema = z.object({
  card_number: z.string().min(16).max(19),
  holder_name: z.string().min(3),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
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
      // First tokenize the card
      const { data: tokenizeData, error: tokenizeError } = await supabase.functions.invoke('payment', {
        body: {
          action: 'tokenize',
          payload: {
            driver_id: driverId,
            card_number: values.card_number.replace(/\s/g, ''),
            holder_name: values.holder_name,
            expiry: values.expiry,
            cvv: values.cvv,
          }
        }
      })

      if (tokenizeError) throw tokenizeError

      // Create payment with the token
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('payment', {
        body: {
          action: 'create_payment',
          payload: {
            driver_id: driverId,
            amount,
            payment_type: 'credit',
            card_token: tokenizeData.token,
            installments: parseInt(values.installments),
            description: 'Car rental payment'
          }
        }
      })

      if (paymentError) throw paymentError

      toast({
        title: "Pagamento processado com sucesso!",
        description: "Seu pagamento foi confirmado.",
      })

      onSuccess(paymentData.id)
    } catch (error) {
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
        <FormField
          control={form.control}
          name="card_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Cartão</FormLabel>
              <FormControl>
                <Input
                  placeholder="1234 5678 9012 3456"
                  {...field}
                  onChange={(e) => {
                    const formatted = e.target.value
                      .replace(/\s/g, '')
                      .replace(/(\d{4})/g, '$1 ')
                      .trim()
                    field.onChange(formatted)
                  }}
                  maxLength={19}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="holder_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome no Cartão</FormLabel>
              <FormControl>
                <Input placeholder="NOME COMO ESTÁ NO CARTÃO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade</FormLabel>
                <FormControl>
                  <Input
                    placeholder="MM/YY"
                    {...field}
                    onChange={(e) => {
                      const formatted = e.target.value
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d)/, '$1/$2')
                        .slice(0, 5)
                      field.onChange(formatted)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="123"
                    {...field}
                    maxLength={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="installments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parcelas</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o número de parcelas" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i}x de R$ {(amount / i).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : "Pagar"}
        </Button>
      </form>
    </Form>
  )
}