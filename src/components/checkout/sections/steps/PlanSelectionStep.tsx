import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface PlanSelectionStepProps {
  onNext: () => void;
}

export const PlanSelectionStep = ({ onNext }: PlanSelectionStepProps) => {
  const { data: carModels } = useQuery({
    queryKey: ['car-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('category_id', '1b464396-048b-4b09-8c16-a7b9e60c7b24')
        .limit(2);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Confirme sua Seleção</h2>
          <p className="text-gray-400">Revise os detalhes do seu plano antes de continuar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {carModels?.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
            >
              {car.image_url && (
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                  <img
                    src={car.image_url}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-medium text-white">{car.name}</h3>
              <p className="text-sm text-gray-400">{car.category?.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-white gap-1.5"
          >
            Continuar
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};