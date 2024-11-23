import { motion } from "framer-motion";
import { Steps } from "../Steps";
import { User, Car, Calendar, CreditCard, ShoppingCart } from "lucide-react";

const steps = [
  { number: 1, title: "Seus Dados", icon: User },
  { number: 2, title: "Escolha do Plano", icon: Car },
  { number: 3, title: "Adicionais", icon: Calendar },
  { number: 4, title: "Agendamento", icon: Calendar },
  { number: 5, title: "Pagamento", icon: CreditCard },
  { number: 6, title: "Confirmação", icon: ShoppingCart }
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