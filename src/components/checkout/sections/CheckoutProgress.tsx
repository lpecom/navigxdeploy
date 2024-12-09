import { motion } from "framer-motion";
import { Steps } from "../Steps";
import { User, Calendar, CreditCard, ShoppingCart } from "lucide-react";

const steps = [
  { number: 1, title: "Seus Dados", icon: User },
  { number: 2, title: "Agendamento", icon: Calendar },
  { number: 3, title: "Pagamento", icon: CreditCard },
  { number: 4, title: "Confirmação", icon: ShoppingCart }
];

export const CheckoutProgress = ({ currentStep }: { currentStep: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <Steps currentStep={currentStep} steps={steps} />
    </motion.div>
  );
};