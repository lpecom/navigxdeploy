import { Card } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"

export const CheckoutSummary = () => {
  const { state, total } = useCart()

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
      <div className="space-y-4">
        {state.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span>R$ {item.totalPrice.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}