import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/website/Navigation";
import { Steps, checkoutSteps } from "@/components/checkout/Steps";
import { motion } from "framer-motion";
import { CategorySelector } from "./reservation/components/CategorySelector";
import { useState } from "react";
import type { Category } from "@/types/offers";

export const ReservationPage = () => {
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as Category[];
    }
  });

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

          <CategorySelector 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ReservationPage;