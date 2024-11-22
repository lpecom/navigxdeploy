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

interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
}

interface Plan {
  id: string;
  name: string;
  type: 'flex' | 'monthly' | 'black';
  base_price: number;
  features: string[];
  bullet_points: { km: string; price: string; }[];
  highlight: boolean;
  display_order: number;
}

const Plans = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as Plan[];
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

  const handlePlanSelect = (plan: Plan) => {
    if (!selectedCategory) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria primeiro.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    // Clear cart before adding new item
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

    // Store selected plan in session storage
    sessionStorage.setItem('selectedPlan', plan.type);
    
    navigate('/checkout');
  };

  if (!selectedCategory) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-20 sm:pt-28 pb-8 sm:pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-3/4 mx-auto mb-8" />
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[600px] w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-20 sm:pt-28 pb-8 sm:pb-16 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            Escolha seu plano para {selectedCategory.name}
          </h1>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {plans?.sort((a, b) => a.display_order - b.display_order).map((plan) => (
              <div 
                key={plan.id} 
                className={plan.highlight ? "transform hover:scale-105 transition-transform duration-300" : ""}
              >
                <PlanCard
                  type={plan.type}
                  price={plan.base_price.toFixed(2)}
                  features={plan.features}
                  kmRanges={plan.bullet_points}
                  onSelect={() => handlePlanSelect(plan)}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Plans;