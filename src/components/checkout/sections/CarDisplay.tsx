import { motion } from "framer-motion"
import { CarSlider } from "@/components/home/CarSlider"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { CarModel } from "@/types/vehicles"

interface CarDisplayProps {
  categoryId: string | undefined
}

export const CarDisplay = ({ categoryId }: CarDisplayProps) => {
  const { data: carModels } = useQuery({
    queryKey: ['car-models', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data, error } = await supabase
        .from('car_models')
        .select('*')
        .eq('category_id', categoryId);
      
      if (error) throw error;
      
      return (data || []).map(model => ({
        ...model,
        optionals: model.optionals as Record<string, any> | null,
        features: model.features as Record<string, any>[] | null
      })) as CarModel[];
    },
    enabled: !!categoryId
  });

  if (!carModels || carModels.length === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden bg-white p-4">
      <CarSlider cars={carModels} category={categoryId || ''} />
    </div>
  );
};