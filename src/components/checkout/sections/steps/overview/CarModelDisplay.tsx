import { motion } from "framer-motion";
import { CarModelCarousel } from "../CarModelCarousel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CarModel } from "@/types/vehicles";

export const CarModelDisplay = ({ categoryId }: { categoryId: string }) => {
  const { data: carModels, isLoading } = useQuery({
    queryKey: ['car-models', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('category_id', categoryId);
      
      if (error) {
        toast.error('Erro ao carregar modelos');
        throw error;
      }
      
      return data as CarModel[];
    },
    enabled: !!categoryId,
  });

  if (isLoading) {
    return (
      <div className="relative py-8">
        <div className="animate-pulse bg-gray-800/50 rounded-xl aspect-[16/9]" />
      </div>
    );
  }

  if (!carModels?.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        Nenhum veículo encontrado nesta categoria
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative py-8"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900/50 to-gray-900/0" />
      <CarModelCarousel carModels={carModels} />
    </motion.div>
  );
};