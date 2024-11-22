import { Card } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const OrderSummary = () => {
  const { state, total } = useCart()

  const { data: accessories } = useQuery({
    queryKey: ['accessories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
      if (error) throw error
      return data
    }
  })

  const getAccessoryName = (id: string) => {
    const accessory = accessories?.find(acc => acc.id === id)
    return accessory?.name || 'Optional'
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Detalhes do Pedido</h3>
          <div className="space-y-2 text-sm">
            {state.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.type === 'car_group' ? 'Veículo' : getAccessoryName(item.id)}
                  {item.quantity > 1 && ` (${item.quantity}x)`}
                </span>
                <span>R$ {item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span className="text-xl">R$ {total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Todos os impostos inclusos
          </p>
        </div>
      </div>
    </Card>
  )
}