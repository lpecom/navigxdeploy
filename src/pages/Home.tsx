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
import { CarCategoryCard } from '@/components/home/CarCategoryCard';

const carCategories = [
  {
    name: 'USADINHO',
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
            <CarCategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
