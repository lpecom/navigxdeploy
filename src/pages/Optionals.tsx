import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { OrderSummary } from "@/components/optionals/OrderSummary";
import { OptionalsList } from "@/components/optionals/OptionalsList";
import { useEffect, useState } from "react";
import { CarSlider } from "@/components/home/CarSlider";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import type { CarModel } from "@/types/vehicles";
import type { SelectedCar } from "@/types/car";

const demoCarModels: CarModel[] = [
  {
    id: '1',
    name: 'HB20 1.0',
    image_url: 'https://www.kovi.com.br/hubfs/HB20%20Sense%20-%20Branco%20-%20Hatch_web.webp',
    year: '2021',
    description: 'Hatch • *Carro com até 6 mil kms rodados.',
    category_id: null,
    optionals: null,
    created_at: null,
    updated_at: null,
    engine_size: '1.0',
    transmission: 'Manual',
    brand_logo_url: null
  },
  {
    id: '2',
    name: 'Ford Ka SE',
    image_url: 'https://raw.githubusercontent.com/navigcars/cars/main/ford-ka.png',
    year: '2021',
    description: 'Equipado com pneus Remold.',
    category_id: null,
    optionals: null,
    created_at: null,
    updated_at: null,
    engine_size: '1.0',
    transmission: 'Manual',
    brand_logo_url: null
  },
  {
    id: '3',
    name: 'Onix Joy',
    image_url: 'https://raw.githubusercontent.com/navigcars/cars/main/onix.png',
    year: '2019',
    description: 'Hatch • Completo',
    category_id: null,
    optionals: null,
    created_at: null,
    updated_at: null,
    engine_size: '1.0',
    transmission: 'Manual',
    brand_logo_url: null
  },
  {
    id: '4',
    name: 'Renault Kwid',
    image_url: 'https://raw.githubusercontent.com/navigcars/cars/main/kwid.png',
    year: '2020',
    description: 'Compacto e econômico',
    category_id: null,
    optionals: null,
    created_at: null,
    updated_at: null,
    engine_size: '1.0',
    transmission: 'Manual',
    brand_logo_url: null
  },
  {
    id: '5',
    name: 'Hyundai HB20',
    image_url: 'https://raw.githubusercontent.com/navigcars/cars/main/hb20.png',
    year: '2021',
    description: 'Hatch • Completo',
    category_id: null,
    optionals: null,
    created_at: null,
    updated_at: null,
    engine_size: '1.0',
    transmission: 'Manual',
    brand_logo_url: null
  }
];

const Optionals = () => {
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { toast } = useToast();
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);

  useEffect(() => {
    const carData = sessionStorage.getItem('selectedCar');
    if (carData) {
      try {
        setSelectedCar(JSON.parse(carData));
      } catch (error) {
        console.error('Error parsing selected car data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleContinue = () => {
    if (!cartState.items.find(item => item.type === 'car_group')) {
      toast({
        title: "Carrinho vazio",
        description: "Por favor, selecione um plano antes de continuar.",
        variant: "destructive",
      });
      navigate('/plans');
      return;
    }

    if (cartState.items.length > 0 && cartState.total > 0) {
      navigate('/checkout');
    } else {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar seu carrinho. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!selectedCar) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[1fr,400px]">
          <div className="space-y-6">
            <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">{selectedCar.category}</h2>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <CarSlider cars={demoCarModels} category="Economy" />
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>Passageiros: {selectedCar.specs?.passengers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Transmissão: {selectedCar.specs?.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Plano: {selectedCar.specs?.plan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Consumo: {selectedCar.specs?.consumption}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-2xl font-bold text-primary">
                    R$ {selectedCar.price}
                    <span className="text-base font-normal text-gray-400 ml-1">
                      /{selectedCar.period || 'semana'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-semibold text-white">Opcionais Disponíveis</h1>
                </div>
                <OptionalsList />
              </div>

              <div className="flex justify-between mt-8">
                <Link to="/plans">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                </Link>
                <Button 
                  onClick={handleContinue} 
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  Continuar para checkout
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Optionals;