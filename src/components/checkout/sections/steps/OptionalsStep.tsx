import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { OptionalsList } from "@/components/optionals/OptionalsList";
import { Button } from "@/components/ui/button";

interface OptionalsStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export const OptionalsStep = ({ onNext, onBack }: OptionalsStepProps) => {
  return (
    <div className="space-y-8">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/10 -ml-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-3"
      >
        <h1 className="text-4xl font-bold text-white">
          Quais opcionais você precisa?
        </h1>
        <p className="text-gray-400 text-lg">
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