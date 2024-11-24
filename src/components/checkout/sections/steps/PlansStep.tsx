import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlanCard } from "@/components/plans/PlanCard";
import { toast } from "sonner";
import type { Plans } from "@/types/supabase/plans";

interface PlansStepProps {
  onSelect: () => void;
}

export const PlansStep = ({ onSelect }: PlansStepProps) => {
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

  if (isLoading) {
    return <div>Loading plans...</div>;
  }

  return (
    <div className="space-y-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
      >
        Escolha o plano mais lucrativo pro seu bolso
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
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
              onSelect={() => {
                sessionStorage.setItem('selectedPlan', plan.type);
                onSelect();
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};