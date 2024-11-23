import { Card } from "@/components/ui/card"
import { PlanDetails } from "../PlanDetails"
import { useCart } from "@/contexts/CartContext"
import { CarSlider } from "@/components/home/CarSlider"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { getBrandFromModel } from "@/utils/brandLogos"
import { motion } from "framer-motion"
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

  // Group cars by brand
  const carsByBrand = carModels?.reduce((acc: Record<string, CarModel[]>, car) => {
    const brand = getBrandFromModel(car.name) || 'Other';
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(car);
    return acc;
  }, {});

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
      {carsByBrand && Object.entries(carsByBrand).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(carsByBrand).map(([brand, cars], index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3">{brand}</h3>
                  <div className="space-y-4">
                    {cars.map((car) => (
                      <div key={car.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="aspect-video relative mb-2">
                          {car.image_url ? (
                            <img
                              src={car.image_url}
                              alt={car.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-400">Sem imagem</span>
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium">{car.name}</h4>
                        {car.description && (
                          <p className="text-sm text-gray-600 mt-1">{car.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-4">
          <div className="text-center text-gray-500">
            Nenhum veículo disponível nesta categoria
          </div>
        </Card>
      )}
      
      {planDetails && <PlanDetails plan={planDetails} />}
    </div>
  );
};