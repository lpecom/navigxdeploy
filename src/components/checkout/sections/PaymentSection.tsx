import { useState } from "react"
import { Card } from "@/components/ui/card"
import { PaymentMethodSelector } from "../PaymentMethodSelector"
import { CreditCardForm } from "../payment-methods/CreditCardForm"
import { PixPayment } from "../payment-methods/PixPayment"
import { BoletoPayment } from "../payment-methods/BoletoPayment"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/CartContext"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package } from "lucide-react"

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
  const [selectedMethod, setSelectedMethod] = useState("credit")
  const { state: cartState } = useCart()
  
  const optionalItems = cartState.items.filter(item => item.type === 'optional')

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
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Método de Pagamento</h2>
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
        />
      </Card>

      <Card className="p-4 sm:p-6">
        {selectedMethod === "credit" && (
          <CreditCardForm
            amount={amount}
            driverId={driverId}
            onSuccess={onPaymentSuccess}
          />
        )}
        {selectedMethod === "pix" && (
          <PixPayment
            amount={amount}
            driverId={driverId}
            onSuccess={onPaymentSuccess}
          />
        )}
        {selectedMethod === "boleto" && (
          <BoletoPayment
            amount={amount}
            driverId={driverId}
            onSuccess={onPaymentSuccess}
          />
        )}
      </Card>
    </motion.div>
  )
}