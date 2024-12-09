import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Store } from "lucide-react"

interface PaymentTypeSelectorProps {
  amount: number
  onSelect: (type: 'online' | 'store', finalAmount: number) => void
}

export const PaymentTypeSelector = ({ amount, onSelect }: PaymentTypeSelectorProps) => {
  const onlineAmount = amount * 0.9 // 10% discount
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Como você prefere pagar?</h2>
        <p className="text-muted-foreground">
          Escolha entre pagar online com 10% de desconto ou na loja
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="relative overflow-hidden group cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect('online', onlineAmount)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-6 space-y-4">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Pagar Online</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pague agora e garanta 10% de desconto
              </p>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground line-through">
                  R$ {amount.toFixed(2)}
                </p>
                <p className="text-2xl font-semibold text-primary">
                  R$ {onlineAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <Button className="w-full">Pagar Online</Button>
          </div>
        </Card>

        <Card className="relative overflow-hidden group cursor-pointer hover:border-secondary transition-colors"
          onClick={() => onSelect('store', amount)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-6 space-y-4">
            <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center">
              <Store className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Pagar na Loja</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pague pessoalmente na retirada do veículo
              </p>
              <p className="text-2xl font-semibold">
                R$ {amount.toFixed(2)}
              </p>
            </div>
            <Button variant="outline" className="w-full">Pagar na Loja</Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}