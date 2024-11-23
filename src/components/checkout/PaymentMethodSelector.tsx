import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, QrCode, Receipt } from "lucide-react"
import { motion } from "framer-motion"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
}

export const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) => {
  return (
    <RadioGroup
      value={selectedMethod}
      onValueChange={onMethodChange}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
    >
      {[
        { value: 'credit', icon: CreditCard, label: 'Cartão de Crédito' },
        { value: 'pix', icon: QrCode, label: 'PIX' },
        { value: 'boleto', icon: Receipt, label: 'Boleto' }
      ].map((method) => (
        <motion.div
          key={method.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RadioGroupItem
            value={method.value}
            id={method.value}
            className="peer sr-only"
          />
          <Label
            htmlFor={method.value}
            className="relative flex flex-col items-center justify-between rounded-xl border-2 border-white/10 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 p-6 hover:bg-gray-800/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 backdrop-blur-sm overflow-hidden group"
          >
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/20" />
            <div className="relative space-y-4">
              <div className="bg-primary/10 p-3 rounded-full transition-colors group-hover:bg-primary/20">
                <method.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-base text-gray-200 font-medium">{method.label}</span>
            </div>
          </Label>
        </motion.div>
      ))}
    </RadioGroup>
  )
}