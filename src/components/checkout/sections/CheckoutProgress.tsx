import { motion } from "framer-motion";
import { Steps } from "../Steps";
import { User, Car, Calendar, CreditCard, ShieldCheck, Package } from "lucide-react";

const steps = [
  { number: 1, title: "Proteção", icon: ShieldCheck },
  { number: 2, title: "Opcionais", icon: Package },
  { number: 3, title: "Seus Dados", icon: User },
  { number: 4, title: "Agendamento", icon: Calendar },
  { number: 5, title: "Pagamento", icon: CreditCard }
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