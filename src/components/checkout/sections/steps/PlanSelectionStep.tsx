import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { PlanList } from "@/pages/plans/components/PlanList";
import type { Plans } from "@/types/supabase/plans";

interface PlanSelectionStepProps {
  onNext: () => void;
}

export const PlanSelectionStep = ({ onNext }: PlanSelectionStepProps) => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toast } = useToast();

  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as Plans[];
    }
  });

  const handlePlanSelect = (plan: Plans) => {
    // Get the selected category from session storage
    const categoryData = sessionStorage.getItem('selectedCategory');
    if (!categoryData) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria primeiro.",
        variant: "destructive",
      });
      navigate('/reservar');
      return;
    }

    const selectedCategory = JSON.parse(categoryData);

    dispatch({ type: 'CLEAR_CART' });
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${selectedCategory.id}-${plan.id}`,
        type: "car_group",
        quantity: 1,
        unitPrice: plan.base_price,
        totalPrice: plan.base_price,
        name: `${selectedCategory.name} - ${plan.name}`,
        category: selectedCategory.name,
        period: plan.period
      }
    });

    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    toast({
      title: "Plano selecionado!",
      description: "Agora vamos escolher sua proteção.",
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
      >
        Escolha o plano mais lucrativo pro seu bolso
      </motion.h1>

      <PlanList 
        plans={plans}
        onPlanSelect={handlePlanSelect}
      />
    </div>
  );
};