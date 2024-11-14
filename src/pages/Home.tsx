import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Briefcase, 
  Gauge, 
  Fuel, 
  MapPin, 
  Calendar, 
  DollarSign,
  Shield,
  Car,
  Wifi
} from 'lucide-react';

const carCategories = [
  {
    name: 'USADINHO',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/ford-ka.png',
    models: 'Ford Ka 2021 1.0, HB20 2021, Onix Joy 2019',
    price: 'R$ 634',
    period: '/semana',
    location: 'Porto Alegre',
    availability: 'Pronta Entrega',
    badge: 'Usados',
    specs: {
      passengers: 4,
      luggage: 1,
      transmission: 'Manual',
      fuel: 'Flex',
      mileage: '10.000km',
      insurance: 'Básico',
      wifi: true,
      consumption: '14.5 km/l'
    }
  },
  {
    name: 'USADINHO Comfort',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/logan.png',
    models: 'Renault Logan e Sandero 2021 Life 1.0',
    price: 'R$ 734',
    period: '/semana',
    location: 'São Paulo',
    availability: 'Pronta Entrega',
    badge: 'Usados',
    specs: {
      passengers: 5,
      luggage: 2,
      transmission: 'Automático',
      fuel: 'Gasolina',
      mileage: '5.000km',
      insurance: 'Completo',
      wifi: false,
      consumption: '12.0 km/l'
    }
  },
  {
    name: 'Hatch Plus',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/onix.png',
    models: 'Novo Onix, novo HB20, Novo 208',
    price: 'R$ 834',
    period: '/semana',
    location: 'Rio de Janeiro',
    availability: 'Pronta Entrega',
    badge: 'Novos',
    specs: {
      passengers: 5,
      luggage: 2,
      transmission: 'Automático',
      fuel: 'Gasolina',
      mileage: '8.000km',
      insurance: 'Básico',
      wifi: true,
      consumption: '13.0 km/l'
    }
  },
  {
    name: 'Sedan Premium',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/yaris.png',
    models: 'Toyota Yaris sedan automático 1.5',
    price: 'R$ 934',
    period: '/semana',
    location: 'Curitiba',
    availability: 'Pronta Entrega',
    badge: 'Premium',
    specs: {
      passengers: 5,
      luggage: 3,
      transmission: 'CVT',
      fuel: 'Gasolina',
      mileage: '1.000km',
      insurance: 'Completo',
      wifi: true,
      consumption: '15.0 km/l'
    }
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-6 max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-navig to-blue-600">
            Alugue seu carro por assinatura
          </h1>
          <p className="text-xl text-gray-600">
            Escolha o melhor plano para você com nossa frota premium
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {carCategories.map((category, index) => (
            <Card key={index} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-100">
              <Badge className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white font-medium px-3 py-1 rounded-full">
                {category.badge}
              </Badge>
              
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  {category.name}
                </CardTitle>
                <p className="text-gray-600 font-medium">{category.models}</p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <div className="relative h-48 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="h-full w-full object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-navig" />
                      <span>{category.specs.passengers} passageiros</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase className="w-4 h-4 text-navig" />
                      <span>{category.specs.luggage} mala grande</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Car className="w-4 h-4 text-navig" />
                      <span>{category.specs.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Fuel className="w-4 h-4 text-navig" />
                      <span>{category.specs.fuel}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Gauge className="w-4 h-4 text-navig" />
                      <span>{category.specs.consumption}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Shield className="w-4 h-4 text-navig" />
                      <span>{category.specs.insurance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-navig" />
                      <span>{category.location}</span>
                    </div>
                    {category.specs.wifi && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Wifi className="w-4 h-4 text-navig" />
                        <span>Wi-Fi incluso</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-navig font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {category.availability}
                  </p>
                </div>
                
                <div className="text-2xl font-bold text-gray-900">
                  <p className="text-sm text-gray-600 mb-1">A partir de</p>
                  <div className="flex items-center gap-2 text-navig">
                    <DollarSign className="w-6 h-6" />
                    {category.price}
                    <span className="text-base font-normal text-gray-600">{category.period}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full bg-navig hover:bg-navig/90 text-white font-medium py-6 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  Quero esse
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;