import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const carCategories = [
  {
    name: 'USADINHO',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/ford-ka.png',
    models: 'Ford Ka 2021 1.0, HB20 2021, Onix Joy 2019',
    price: 'R$ 634',
    period: '/semana',
    location: 'Porto Alegre',
    availability: 'Pronta Entrega',
    badge: 'Usados'
  },
  {
    name: 'USADINHO Comfort',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/logan.png',
    models: 'Renault Logan e Sandero 2021 Life 1.0',
    price: 'R$ 734',
    period: '/semana',
    location: 'São Paulo',
    availability: 'Pronta Entrega',
    badge: 'Usados'
  },
  {
    name: 'Hatch Plus',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/onix.png',
    models: 'Novo Onix, novo HB20, Novo 208',
    price: 'R$ 834',
    period: '/semana',
    location: 'Rio de Janeiro',
    availability: 'Pronta Entrega',
    badge: 'Novos'
  },
  {
    name: 'Sedan Premium',
    image: 'https://raw.githubusercontent.com/navigcars/cars/main/yaris.png',
    models: 'Toyota Yaris sedan automático 1.5',
    price: 'R$ 934',
    period: '/semana',
    location: 'Curitiba',
    availability: 'Pronta Entrega',
    badge: 'Premium'
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-navig">Alugue seu carro por assinatura</h1>
        <p className="text-center text-gray-600 mb-8">Escolha o melhor plano para você</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {carCategories.map((category, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
              <Badge className="absolute top-4 right-4 bg-red-500 text-white">{category.badge}</Badge>
              
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{category.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="h-48 flex items-center justify-center">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="h-full object-contain"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-navig font-semibold">{category.location}</p>
                  <p className="text-gray-600">{category.availability}</p>
                  <p className="font-medium">Modelos: <span className="text-gray-600">{category.models}</span></p>
                </div>
                
                <div className="text-2xl font-bold text-gray-900">
                  A partir de
                  <div className="text-red-500">
                    {category.price}
                    <span className="text-base font-normal">{category.period}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full bg-navig hover:bg-navig/90">
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