import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, Car, Fuel, Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import { OrderSummary } from "@/components/optionals/OrderSummary";
import { OptionalsList } from "@/components/optionals/OptionalsList";
import { useEffect, useState } from "react";

interface SelectedCar {
  category: string;
  specs: {
    passengers: number;
    luggage: number;
    transmission: string;
    fuel: string;
    mileage: string;
    insurance: string;
    wifi: boolean;
    consumption: string;
  };
  price: string;
  period: string;
  image: string;
}

const Optionals = () => {
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);

  useEffect(() => {
    document.body.classList.remove('animate-fade-out');
    document.body.classList.add('animate-fade-in');

    const carData = sessionStorage.getItem('selectedCar');
    if (carData) {
      setSelectedCar(JSON.parse(carData));
    }

    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      <div className="grid gap-8 md:grid-cols-[1fr,400px]">
        <Card className="p-6">
          {selectedCar && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-[300px,1fr] gap-6 items-center">
                {selectedCar.image && (
                  <img 
                    src={selectedCar.image} 
                    alt={selectedCar.category}
                    className="w-full h-auto rounded-lg"
                  />
                )}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">{selectedCar.category}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-navig" />
                      <span>{selectedCar.specs.passengers} passageiros</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-navig" />
                      <span>{selectedCar.specs.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-navig" />
                      <span>{selectedCar.specs.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-navig" />
                      <span>{selectedCar.specs.consumption}</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-navig">
                    {selectedCar.price}
                    <span className="text-base font-normal text-gray-600 ml-1">
                      {selectedCar.period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-semibold mb-6">Opcionais</h1>
          <OptionalsList />
          <div className="flex justify-between mt-8">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <Link to="/driver-details">
              <Button className="flex items-center gap-2">
                Continuar
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
        
        <div className="space-y-6">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default Optionals;