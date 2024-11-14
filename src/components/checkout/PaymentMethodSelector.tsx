import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Qrcode, Receipt } from "lucide-react"

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
      <div>
        <RadioGroupItem
          value="credit"
          id="credit"
          className="peer sr-only"
        />
        <Label
          htmlFor="credit"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <CreditCard className="mb-3 h-6 w-6" />
          Cartão de Crédito
        </Label>
      </div>
      
      <div>
        <RadioGroupItem
          value="pix"
          id="pix"
          className="peer sr-only"
        />
        <Label
          htmlFor="pix"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Qrcode className="mb-3 h-6 w-6" />
          PIX
        </Label>
      </div>
      
      <div>
        <RadioGroupItem
          value="boleto"
          id="boleto"
          className="peer sr-only"
        />
        <Label
          htmlFor="boleto"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Receipt className="mb-3 h-6 w-6" />
          Boleto
        </Label>
      </div>
    </RadioGroup>
  )
}