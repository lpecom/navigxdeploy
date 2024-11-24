import { PlanCard } from "@/components/plans/PlanCard";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/website/Navigation";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Steps, checkoutSteps } from "@/components/checkout/Steps";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Plans } from "@/types/supabase/plans";

interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
}

export const PlansPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { data: plans, isLoading } = useQuery({
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
  
  useEffect(() => {
    const categoryData = sessionStorage.getItem('selectedCategory');
    if (categoryData) {
      try {
        setSelectedCategory(JSON.parse(categoryData));
      } catch (error) {
        console.error('Error parsing category data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handlePlanSelect = async (plan: Plans) => {
    if (isNavigating) return; // Prevent multiple clicks
    setIsNavigating(true);

    if (!selectedCategory) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria primeiro.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    try {
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
      navigate('/checkout');
    } catch (error) {
      console.error('Error handling plan selection:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao selecionar o plano. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsNavigating(false);
    }
  };

  if (!selectedCategory) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="pt-20 sm:pt-28 pb-8 sm:pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-3/4 mx-auto mb-8 bg-gray-800" />
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[600px] w-full bg-gray-800/50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <Steps currentStep={1} steps={checkoutSteps} />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              Escolha o plano mais lucrativo pro seu bolso
            </motion.h1>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {plans?.sort((a, b) => a.display_order - b.display_order).map((plan, index) => (
              <motion.div 
                key={plan.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                className={`${plan.highlight ? "transform hover:scale-105 transition-transform duration-300" : ""}`}
              >
                <PlanCard
                  type={plan.type}
                  price={plan.base_price.toFixed(2)}
                  features={plan.features}
                  kmRanges={plan.bullet_points}
                  onSelect={() => handlePlanSelect(plan)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlansPage;