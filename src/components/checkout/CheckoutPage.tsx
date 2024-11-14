import { useState } from "react"
import { Card } from "@/components/ui/card"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { CreditCardForm } from "./CreditCardForm"
import { PixPayment } from "./PixPayment"
import { BoletoPayment } from "./BoletoPayment"
import { OrderSummary } from "@/components/optionals/OrderSummary"

export const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [paymentId, setPaymentId] = useState<string | null>(null)
  
  // These values would typically come from your checkout session or context
  const checkoutData = {
    amount: 371.00,
    driverId: "123", // This should come from your auth context or session
  }

  const handlePaymentSuccess = (id: string) => {
    setPaymentId(id)
    // Handle successful payment (e.g., redirect to confirmation page)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
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
                amount={checkoutData.amount}
                driverId={checkoutData.driverId}
                onSuccess={handlePaymentSuccess}
              />
            )}
            {paymentMethod === "pix" && (
              <PixPayment
                amount={checkoutData.amount}
                driverId={checkoutData.driverId}
                onSuccess={handlePaymentSuccess}
              />
            )}
            {paymentMethod === "boleto" && (
              <BoletoPayment
                amount={checkoutData.amount}
                driverId={checkoutData.driverId}
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