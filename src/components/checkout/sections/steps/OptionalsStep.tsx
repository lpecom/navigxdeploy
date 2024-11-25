import { motion } from "framer-motion";
import { Package2 } from "lucide-react";
import { OptionalsList } from "@/components/optionals/OptionalsList";
import { Button } from "@/components/ui/button";

interface OptionalsStepProps {
  onNext: () => void;
}

export const OptionalsStep = ({ onNext }: OptionalsStepProps) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          Quais opcionais você precisa?
        </h1>
        <p className="text-gray-400">
          Selecione os opcionais que deseja adicionar ao seu aluguel
        </p>
      </motion.div>

      <OptionalsList />

      <div className="flex justify-end">
        <Button onClick={onNext} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
};