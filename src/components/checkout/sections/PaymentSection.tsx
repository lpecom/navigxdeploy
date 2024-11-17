import { Card } from "@/components/ui/card"
import { PaymentMethodSelector } from "../PaymentMethodSelector"
import { CreditCardForm } from "../CreditCardForm"
import { PixPayment } from "../PixPayment"
import { BoletoPayment } from "../BoletoPayment"
import { motion } from "framer-motion"

interface PaymentSectionProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  onPaymentSuccess: (id: string) => void
  amount: number
  driverId: string
}

export const PaymentSection = ({
  selectedMethod,
  onMethodChange,
  onPaymentSuccess,
  amount,
  driverId,
}: PaymentSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Método de Pagamento</h2>
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodChange={onMethodChange}
        />
      </Card>

      <Card className="p-6">
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