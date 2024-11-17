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
      className="grid grid-cols-3 gap-4"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RadioGroupItem
          value="credit"
          id="credit"
          className="peer sr-only"
        />
        <Label
          htmlFor="credit"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200"
        >
          <CreditCard className="mb-3 h-6 w-6" />
          Cartão de Crédito
        </Label>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RadioGroupItem
          value="pix"
          id="pix"
          className="peer sr-only"
        />
        <Label
          htmlFor="pix"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200"
        >
          <QrCode className="mb-3 h-6 w-6" />
          PIX
        </Label>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RadioGroupItem
          value="boleto"
          id="boleto"
          className="peer sr-only"
        />
        <Label
          htmlFor="boleto"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200"
        >
          <Receipt className="mb-3 h-6 w-6" />
          Boleto
        </Label>
      </motion.div>
    </RadioGroup>
  )
}