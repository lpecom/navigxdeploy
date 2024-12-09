import { motion } from "framer-motion";
import { Steps, checkoutSteps } from "../Steps";

export const CheckoutProgress = ({ currentStep }: { currentStep: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <Steps currentStep={currentStep} steps={checkoutSteps} />
    </motion.div>
  );
};