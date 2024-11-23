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
    queryKey: ['car-models', selectedPlan?.id],
    queryFn: async () => {
      if (!selectedPlan?.id) return null;
      
      // First get the category_id from car_groups
      const { data: carGroups, error: carGroupError } = await supabase
        .from('car_groups')
        .select('id')
        .eq('name', selectedPlan.category);
      
      if (carGroupError) {
        console.error('Error fetching car group:', carGroupError);
        return null;
      }

      if (!carGroups?.length) {
        console.error('No car group found for category:', selectedPlan.category);
        return null;
      }

      // Then use that ID to fetch the models
      const { data, error } = await supabase
        .from('car_models')
        .select('*')
        .eq('category_id', carGroups[0].id);
      
      if (error) throw error;
      return data as CarModel[];
    },
    enabled: !!selectedPlan?.id
  });

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
  } : null;

  return (
    <div className="space-y-6">
      {carModels && carModels.length > 0 && (
        <Card className="p-4">
          <CarSlider cars={carModels} category={selectedPlan?.category || ''} />
        </Card>
      )}
      {planDetails && <PlanDetails plan={planDetails} />}
    </div>
  );
};