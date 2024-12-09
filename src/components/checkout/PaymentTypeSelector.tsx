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
      className="space-y-6 w-full max-w-lg mx-auto px-4 sm:px-0"
    >
      <div className="text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
          Como você prefere pagar?
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Escolha entre pagar online com 10% de desconto ou na loja
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          {
            type: 'online',
            icon: CreditCard,
            title: 'Pagar Online',
            description: 'Pague agora e garanta 10% de desconto',
            amount: onlineAmount,
            originalAmount: amount,
            color: 'primary'
          },
          {
            type: 'store',
            icon: Store,
            title: 'Pagar na Loja',
            description: 'Pague pessoalmente na retirada do veículo',
            amount: amount,
            color: 'secondary'
          }
        ].map((option) => (
          <Card 
            key={option.type}
            className="relative overflow-hidden group cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelect(option.type as 'online' | 'store', option.amount)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90" />
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/20" />
            
            <div className="relative p-4 sm:p-6 space-y-4">
              <div className={`bg-${option.color}/10 w-12 h-12 rounded-full flex items-center justify-center transition-colors group-hover:bg-${option.color}/20`}>
                <option.icon className={`w-6 h-6 text-${option.color}`} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{option.title}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {option.description}
                </p>
                <div className="space-y-1">
                  {option.originalAmount && (
                    <p className="text-sm text-gray-500 line-through">
                      R$ {option.originalAmount.toFixed(2)}
                    </p>
                  )}
                  <p className="text-xl sm:text-2xl font-semibold text-primary">
                    R$ {option.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <Button 
                variant={option.type === 'online' ? "default" : "outline"}
                className="w-full py-6 text-base transition-transform duration-200 hover:scale-[1.02]"
              >
                {option.title}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}