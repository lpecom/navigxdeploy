import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyCartMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto"
        >
          <Car className="w-10 h-10 text-gray-400" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">Seu carrinho está vazio</h2>
          <p className="text-gray-600">
            Adicione itens ao seu carrinho para continuar com a reserva
          </p>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full transition-all duration-200 hover:scale-105"
        >
          Explorar Veículos
        </Button>
      </motion.div>
    </div>
  );
};