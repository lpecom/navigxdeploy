import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { OrderSummary } from "@/components/optionals/OrderSummary";
import { OptionalsList } from "@/components/optionals/OptionalsList";
import { useEffect, useState } from "react";
import { CarSlider } from "@/components/home/CarSlider";

interface SelectedCar {
  category: string;
  specs: {
    passengers: number;
    transmission: string;
    plan: string;
    consumption: string;
  };
  price: string;
  period: string;
}

const economyCars = [
  {
    id: '1',
    name: 'Ford Ka SE',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/ford-ka.png',
    year: '2021',
    mileage: '25.000 km'
  },
  {
    id: '2',
    name: 'Fiat Uno',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/uno.png',
    year: '2020',
    mileage: '30.000 km'
  },
  {
    id: '3',
    name: 'Onix Joy',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/onix.png',
    year: '2019',
    mileage: '45.000 km'
  },
  {
    id: '4',
    name: 'Renault Kwid',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/kwid.png',
    year: '2020',
    mileage: '35.000 km'
  },
  {
    id: '5',
    name: 'Hyundai HB20',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/hb20.png',
    year: '2021',
    mileage: '28.000 km'
  }
];

const Optionals = () => {
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>({
    category: "Ford Ka",
    specs: {
      passengers: 4,
      transmission: "Manual",
      plan: "Flex",
      consumption: "14.5 km/l"
    },
    price: "634",
    period: "semana"
  });

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
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{selectedCar.category}</h2>
              <div className="bg-slate-50 rounded-lg p-4">
                <CarSlider cars={economyCars} category="Economy" />
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Passageiros: {selectedCar.specs.passengers}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Transmissão: {selectedCar.specs.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Plano: {selectedCar.specs.plan}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Consumo: {selectedCar.specs.consumption}</span>
                  </div>
                </div>
                <div className="mt-4 text-2xl font-bold text-blue-500">
                  R$ {selectedCar.price}
                  <span className="text-base font-normal text-gray-600 ml-1">
                    /{selectedCar.period}
                  </span>
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