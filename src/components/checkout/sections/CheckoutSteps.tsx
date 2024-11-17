import { motion } from "framer-motion";
import { ProgressSteps } from "../ui/ProgressSteps";
import { LucideIcon } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
  steps: Array<{
    number: number;
    title: string;
    icon: LucideIcon;
  }>;
}

export const CheckoutSteps = ({ currentStep, steps }: CheckoutStepsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <ProgressSteps currentStep={currentStep} steps={steps} />
    </motion.div>
  );
};