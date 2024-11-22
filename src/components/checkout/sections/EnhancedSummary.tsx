import { Card } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { motion } from "framer-motion"
import { Calendar, Car, Package2 } from "lucide-react"

export const EnhancedSummary = () => {
  const { state, total } = useCart()

  const carGroupItem = state.items.find(item => item.type === 'car_group')
  const optionalItems = state.items.filter(item => item.type === 'optional')

  const { data: carGroup } = useQuery({
    queryKey: ['car-group', carGroupItem?.id],
    queryFn: async () => {
      if (!carGroupItem?.id) return null
      
      const baseId = carGroupItem.id.includes('-') ? 
        carGroupItem.id.substring(0, 36) : 
        
        carGroupItem.id
      
      const { data, error } = await supabase
        .from('car_groups')
        .select('*, vehicles(*)')
        .eq('id', baseId)
        .maybeSingle()
      
      if (error) {
        console.error('Error fetching car group:', error)
        return null
      }
      return data
    },
    enabled: !!carGroupItem?.id
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
        <h2 className="text-xl font-semibold mb-6">Resumo da Reserva</h2>
        
        {carGroup && (
          <div className="mb-6">
            {carGroup.vehicles?.[0]?.image_url && (
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img 
                  src={carGroup.vehicles[0].image_url} 
                  alt={carGroup.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-start gap-4">
              <Car className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{carGroup.name}</h3>
                <p className="text-sm text-gray-600">{carGroup.description}</p>
              </div>
            </div>
          </div>
        )}

        {optionalItems.length > 0 && (
          <div className="border-t pt-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Package2 className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Opcionais Selecionados</h3>
            </div>
            <div className="space-y-2">
              {optionalItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name}
                    {item.quantity > 1 && ` (${item.quantity}x)`}
                  </span>
                  <span>R$ {item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">R$ {total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Todos os impostos inclusos
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
