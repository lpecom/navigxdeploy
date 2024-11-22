import { PlanDetails } from "./PlanDetails"

interface PlanDisplaySectionProps {
  selectedPlan: {
    type: string;
    period: string;
    name: string;
    features: string[];
    price: number;
  } | null;
}

export const PlanDisplaySection = ({ selectedPlan }: PlanDisplaySectionProps) => {
  if (!selectedPlan) return null;
  
  return <PlanDetails plan={selectedPlan} />;
};