import { Card } from "@/components/ui/card"
import { PlanDetails } from "../PlanDetails"
import { useCart } from "@/contexts/CartContext"
import { CarSlider } from "@/components/home/CarSlider"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { CarModel } from "@/types/vehicles"

interface PlanSelectionStepProps {
  onNext: () => void;
}

export const PlanSelectionStep = ({ onNext }: PlanSelectionStepProps) => {
  const { state: cartState } = useCart()
  const selectedPlan = cartState.items.find((item: any) => item.type === 'car_group')

  const { data: carModels } = useQuery({
    queryKey: ['car-models', selectedPlan?.category_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select('*')
        .eq('category_id', cartState?.items?.[0]?.category_id)
      
      if (error) throw error
      return data as CarModel[]
    },
    enabled: !!cartState?.items?.[0]?.category_id
  })

  const planDetails = selectedPlan ? {
    type: selectedPlan.period,
    name: selectedPlan.name,
    features: [
      'Seguro completo incluso',
      'Manutenção preventiva',
      'Assistência 24h',
      'Documentação e IPVA'
    ],
    price: selectedPlan.unitPrice,
    period: 'mês'
  } : null

  return (
    <div className="space-y-6">
      {carModels && carModels.length > 0 && (
        <Card className="p-4">
          <CarSlider cars={carModels} category={selectedPlan?.category || ''} />
        </Card>
      )}
      {planDetails && <PlanDetails plan={planDetails} />}
    </div>
  )
}