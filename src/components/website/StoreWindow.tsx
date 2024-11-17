import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Car, Users, Gauge, Calendar } from "lucide-react";

interface StoreWindowProps {
  selectedCar: {
    id: string;
    name: string;
    category: string;
    price: number;
    period?: string;
    image_url?: string;
    specs?: {
      passengers?: number;
      transmission?: string;
      plan?: string;
      consumption?: string;
    };
  };
}

export const StoreWindow = ({ selectedCar }: StoreWindowProps) => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedCar) return;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: selectedCar.id,
        type: 'car',
        quantity: 1,
        unitPrice: selectedCar.price,
        totalPrice: selectedCar.price,
        name: selectedCar.name,
      },
    });

    toast({
      title: "Carro adicionado ao carrinho",
      description: "Você será redirecionado para o checkout.",
    });

    setTimeout(() => {
      navigate('/checkout');
    }, 1500);
  };

  if (!selectedCar) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6 text-center">
          <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Selecione um carro para continuar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={selectedCar.image_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80"}
                  alt={selectedCar.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedCar.name}</h2>
                <p className="text-gray-600">{selectedCar.category}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {selectedCar.specs?.passengers && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>{selectedCar.specs.passengers} passageiros</span>
                  </div>
                )}
                {selectedCar.specs?.transmission && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Gauge className="w-5 h-5" />
                    <span>{selectedCar.specs.transmission}</span>
                  </div>
                )}
                {selectedCar.specs?.plan && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{selectedCar.specs.plan}</span>
                  </div>
                )}
                {selectedCar.specs?.consumption && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="w-5 h-5" />
                    <span>{selectedCar.specs.consumption}</span>
                  </div>
                )}
              </div>

              <div className="text-3xl font-bold text-primary">
                R$ {selectedCar.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="text-base font-normal text-gray-600 ml-1">
                  /{selectedCar.period || 'semana'}
                </span>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02]"
                size="lg"
              >
                Alugar Agora
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};