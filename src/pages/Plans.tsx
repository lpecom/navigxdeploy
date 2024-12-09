import { PlanCard } from "@/components/plans/PlanCard";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/website/Navigation";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
}

const Plans = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
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

  const handlePlanSelect = (planType: 'flex' | 'monthly' | 'black') => {
    if (!selectedCategory) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria primeiro.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Get base prices for each plan type
    const basePrices = {
      flex: 529,
      monthly: 729,
      black: 1299
    };

    const basePrice = basePrices[planType];
    
    // Clear cart before adding new item
    dispatch({ type: 'CLEAR_CART' });
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${selectedCategory.id}-${planType}`,
        type: 'car_group',
        quantity: 1,
        unitPrice: basePrice,
        totalPrice: basePrice,
        name: `${selectedCategory.name} - Plano ${planType}`,
        category: selectedCategory.name,
        period: planType
      }
    });

    // Store selected plan in session storage
    sessionStorage.setItem('selectedPlan', planType);
    
    // Navigate to checkout instead of optionals
    navigate('/checkout');
  };

  if (!selectedCategory) return null;

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
            <PlanCard
              type="flex"
              price="529,00"
              onSelect={() => handlePlanSelect('flex')}
            />
            <div className="transform hover:scale-105 transition-transform duration-300">
              <PlanCard
                type="black"
                price="1299,00"
                onSelect={() => handlePlanSelect('black')}
              />
            </div>
            <PlanCard
              type="monthly"
              price="729,00"
              onSelect={() => handlePlanSelect('monthly')}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Plans;