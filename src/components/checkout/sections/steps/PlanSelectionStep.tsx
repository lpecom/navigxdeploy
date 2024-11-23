import { Card } from "@/components/ui/card";
import { PlanDetails } from "../PlanDetails";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getBrandFromModel } from "@/utils/brandLogos";
import type { CarModel } from "@/types/vehicles";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { CarModelCarousel } from "./CarModelCarousel";

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
      {carModels && carModels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CarModelCarousel carModels={carModels} />
        </motion.div>
      )}

      {planDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PlanDetails plan={planDetails} />
        </motion.div>
      )}
    </div>
  );
};