import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/website/Navigation";
import { Steps, checkoutSteps } from "@/components/checkout/Steps";
import { motion } from "framer-motion";
import { PlanList } from "./components/PlanList";
import { useEffect, useState } from "react";
import type { Category } from "@/types/offers";
import type { Plans } from "@/types/supabase/plans";

export const ReservationPlansPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const categoryData = sessionStorage.getItem('selectedCategory');
    if (!categoryData) {
      navigate('/reservar');
      return;
    }
    try {
      setSelectedCategory(JSON.parse(categoryData));
    } catch (error) {
      console.error('Error parsing category data:', error);
      navigate('/reservar');
    }
  }, [navigate]);

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
    if (!selectedCategory) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria primeiro.",
        variant: "destructive",
      });
      navigate('/reservar');
      return;
    }
    
    dispatch({ type: 'CLEAR_CART' });
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${selectedCategory.id}-${plan.type}`,
        type: 'car_group',
        quantity: 1,
        unitPrice: plan.base_price,
        totalPrice: plan.base_price,
        name: `${selectedCategory.name} - ${plan.name}`,
        category: selectedCategory.name,
        period: plan.type
      }
    });

    sessionStorage.setItem('selectedPlan', plan.type);
    navigate('/reservar/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />
      <Navigation />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative pt-20 sm:pt-28 pb-8 sm:pb-16"
      >
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Steps currentStep={2} steps={checkoutSteps} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-12"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8"
            >
              Escolha o plano mais lucrativo pro seu bolso
            </motion.h1>

            <PlanList 
              plans={plans}
              onPlanSelect={handlePlanSelect}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReservationPlansPage;