import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

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
      description: "Carro adicionado ao carrinho. Você será redirecionado para o checkout.",
    });

    setTimeout(() => {
      navigate('/checkout');
    }, 1500);
  };

  if (!selectedCar) {
    return <div>Selecione um carro para continuar</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              {selectedCar.image_url ? (
                <img
                  src={selectedCar.image_url}
                  alt={selectedCar.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80";
                  }}
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80"
                  alt="Placeholder"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="text-2xl font-bold">{selectedCar.name}</div>
            <div className="text-gray-600">{selectedCar.category}</div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              {selectedCar.specs?.passengers && (
                <div className="flex items-center gap-2">
                  <span>Passageiros: {selectedCar.specs.passengers}</span>
                </div>
              )}
              {selectedCar.specs?.transmission && (
                <div className="flex items-center gap-2">
                  <span>Transmissão: {selectedCar.specs.transmission}</span>
                </div>
              )}
              {selectedCar.specs?.plan && (
                <div className="flex items-center gap-2">
                  <span>Plano: {selectedCar.specs.plan}</span>
                </div>
              )}
              {selectedCar.specs?.consumption && (
                <div className="flex items-center gap-2">
                  <span>Consumo: {selectedCar.specs.consumption}</span>
                </div>
              )}
            </div>

            <div className="text-3xl font-bold text-blue-600">
              R$ {selectedCar.price}
              <span className="text-base font-normal text-gray-600 ml-1">
                /{selectedCar.period || 'semana'}
              </span>
            </div>

            <Button 
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
            >
              Alugar Agora
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};