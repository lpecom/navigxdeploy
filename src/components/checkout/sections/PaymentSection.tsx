import { useState } from "react"
import { Card } from "@/components/ui/card"
import { PaymentMethodSelector } from "../PaymentMethodSelector"
import { CreditCardForm } from "../payment-methods/CreditCardForm"
import { PixPayment } from "../payment-methods/PixPayment"
import { BoletoPayment } from "../payment-methods/BoletoPayment"
import { PaymentTypeSelector } from "../PaymentTypeSelector"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/CartContext"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package } from "lucide-react"
import { OptionalsList } from "@/components/optionals/OptionalsList"
import { OrderSummary } from "@/components/optionals/OrderSummary"

interface PaymentSectionProps {
  onPaymentSuccess: (id: string) => void
  amount: number
  driverId: string
}

export const PaymentSection = ({
  onPaymentSuccess,
  amount,
  driverId,
}: PaymentSectionProps) => {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [paymentType, setPaymentType] = useState<'online' | 'store' | null>(null)
  const [finalAmount, setFinalAmount] = useState(amount)
  const [showOptionals, setShowOptionals] = useState(false)
  const { state: cartState } = useCart()
  
  const optionalItems = cartState.items.filter(item => item.type === 'optional')

  const handlePaymentTypeSelect = (type: 'online' | 'store', amount: number) => {
    setPaymentType(type)
    setFinalAmount(amount)
    setShowOptionals(true)
  }

  if (!paymentType) {
    return (
      <Card className="p-4 sm:p-6">
        <PaymentTypeSelector 
          amount={amount}
          onSelect={handlePaymentTypeSelect}
        />
      </Card>
    )
  }

  // Show optionals selection before proceeding to payment
  if (showOptionals && !selectedMethod && paymentType === 'online') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Adicione opcionais ao seu plano</h2>
          <OptionalsList />
        </Card>
        <OrderSummary />
        <Card className="p-6">
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onMethodChange={(method) => {
              setSelectedMethod(method)
              setShowOptionals(false)
            }}
          />
        </Card>
      </motion.div>
    )
  }

  if (paymentType === 'store') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Adicione opcionais ao seu plano</h2>
          <OptionalsList />
        </Card>
        <OrderSummary />
        <Card className="p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold">Reserva Confirmada!</h2>
          <p className="text-muted-foreground">
            Sua reserva foi confirmada com sucesso. O pagamento de R$ {finalAmount.toFixed(2)} será realizado na loja no momento da retirada do veículo.
          </p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6"
    >
      {optionalItems.length > 0 && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">Opcionais Selecionados</h2>
          </div>
          <div className="space-y-3">
            {optionalItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{item.name}</span>
                </div>
                <span className="text-sm font-medium">
                  R$ {item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center font-medium">
            <span>Total dos Opcionais</span>
            <span className="text-primary">
              R$ {optionalItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
            </span>
          </div>
        </Card>
      )}

      <Card className="p-4 sm:p-6">
        {selectedMethod === "credit" && (
          <CreditCardForm
            amount={finalAmount}
            driverId={driverId}
            onSuccess={onPaymentSuccess}
          />
        )}
        {selectedMethod === "pix" && (
          <PixPayment
            amount={finalAmount}
            driverId={driverId}
            onSuccess={onPaymentSuccess}
          />
        )}
        {selectedMethod === "boleto" && (
          <BoletoPayment
            amount={finalAmount}
            driverId={driverId}
            onSuccess={onPaymentSuccess}
          />
        )}
      </Card>
    </motion.div>
  )
}