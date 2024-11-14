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

export const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [paymentId, setPaymentId] = useState<string | null>(null)
  
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

  const handlePaymentSuccess = (id: string) => {
    setPaymentId(id)
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
                form={form}
                onSuccess={handlePaymentSuccess}
              />
            )}
            {paymentMethod === "pix" && (
              <PixPayment
                form={form}
                onSuccess={handlePaymentSuccess}
              />
            )}
            {paymentMethod === "boleto" && (
              <BoletoPayment
                form={form}
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