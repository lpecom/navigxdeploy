import { useState } from "react"
import { Card } from "@/components/ui/card"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { CreditCardForm } from "./CreditCardForm"
import { PixPayment } from "./PixPayment"
import { BoletoPayment } from "./BoletoPayment"
import { OrderSummary } from "@/components/optionals/OrderSummary"
import { DriverForm } from "@/components/driver/DriverForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { driverSchema, type DriverFormValues } from "@/types/driver"
import { Form } from "@/components/ui/form"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [driverId, setDriverId] = useState<string | null>(null)
  const { toast } = useToast()
  
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      licenseNumber: "",
      licenseExpiry: "",
      cpf: "",
      phone: "",
      email: "",
    },
  });

  const handlePaymentSuccess = async (id: string) => {
    setPaymentId(id)
    // Save driver details if not already saved
    if (!driverId) {
      try {
        const { data, error } = await supabase
          .from('driver_details')
          .insert([{
            full_name: form.getValues('fullName'),
            birth_date: form.getValues('birthDate'),
            license_number: form.getValues('licenseNumber'),
            license_expiry: form.getValues('licenseExpiry'),
            cpf: form.getValues('cpf'),
            phone: form.getValues('phone'),
            email: form.getValues('email'),
          }])
          .select()
          .single()

        if (error) throw error
        setDriverId(data.id)
      } catch (error) {
        console.error('Error saving driver details:', error)
        toast({
          title: "Erro ao salvar dados do condutor",
          description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Informações do Condutor</h2>
            <Form {...form}>
              <form className="space-y-4">
                <DriverForm form={form} />
              </form>
            </Form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Método de Pagamento</h2>
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </Card>

          <Card className="p-6">
            {paymentMethod === "credit" && (
              <CreditCardForm
                amount={1000} // This should come from your cart total
                driverId={driverId || ''} // Pass the driver ID
                onSuccess={handlePaymentSuccess}
              />
            )}
            {paymentMethod === "pix" && (
              <PixPayment
                amount={1000} // This should come from your cart total
                driverId={driverId || ''} // Pass the driver ID
                onSuccess={handlePaymentSuccess}
              />
            )}
            {paymentMethod === "boleto" && (
              <BoletoPayment
                amount={1000} // This should come from your cart total
                driverId={driverId || ''} // Pass the driver ID
                onSuccess={handlePaymentSuccess}
              />
            )}
          </Card>
        </div>

        <OrderSummary />
      </div>
    </div>
  )
}