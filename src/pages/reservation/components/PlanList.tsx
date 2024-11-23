import { PlanCard } from "@/components/plans/PlanCard";
import { motion } from "framer-motion";
import type { Plans } from "@/types/supabase/plans";

interface PlanListProps {
  plans: Plans[] | undefined;
  onPlanSelect: (plan: Plans) => void;
}

export const PlanList = ({ plans, onPlanSelect }: PlanListProps) => {
  if (!plans?.length) return null;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
      {plans.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map((plan, index) => (
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
              features={plan.features as string[]}
              kmRanges={plan.bullet_points}
              onSelect={() => onPlanSelect(plan)}
            />
          </motion.div>
        ))}
    </div>
  );
};