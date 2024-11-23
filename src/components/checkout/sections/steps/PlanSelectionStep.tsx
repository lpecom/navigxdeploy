import { Card } from "@/components/ui/card";
import { PlanDetails } from "../PlanDetails";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getBrandFromModel } from "@/utils/brandLogos";
import type { CarModel } from "@/types/vehicles";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PlanSelectionStepProps {
  onNext: () => void;
}

export const PlanSelectionStep = ({ onNext }: PlanSelectionStepProps) => {
  const { state: cartState } = useCart();
  const selectedPlan = cartState.items.find((item: any) => item.type === 'car_group');

  const { data: carModels, isLoading, error } = useQuery({
    queryKey: ['car-models', selectedPlan?.category],
    queryFn: async () => {
      if (!selectedPlan?.category) return null;
      
      console.log('Fetching car models for category:', selectedPlan.category);
      
      // Query car models through the categories table
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          category:categories!inner(
            name
          )
        `)
        .eq('category.name', selectedPlan.category);
      
      if (error) {
        console.error('Error fetching car models:', error);
        throw error;
      }

      console.log('Found car models:', data);
      return data as CarModel[];
    },
    enabled: !!selectedPlan?.category
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center text-red-500">
          Erro ao carregar veículos. Por favor, tente novamente.
        </div>
      </Card>
    );
  }

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
            {selectedPlan ? 
              `Nenhum veículo disponível na categoria ${selectedPlan.category}` :
              'Selecione um plano para ver os veículos disponíveis'
            }
          </div>
        </Card>
      )}
      
      {planDetails && <PlanDetails plan={planDetails} />}
    </div>
  );
};