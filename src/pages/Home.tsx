import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const carCategories = [
  { name: 'Econômico', image: '/placeholder.svg', price: 'A partir de R$ 1.500/mês' },
  { name: 'Intermediário', image: '/placeholder.svg', price: 'A partir de R$ 2.000/mês' },
  { name: 'SUV', image: '/placeholder.svg', price: 'A partir de R$ 2.500/mês' },
  { name: 'Premium', image: '/placeholder.svg', price: 'A partir de R$ 3.000/mês' },
];

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-navig">Alugue seu carro por assinatura</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {carCategories.map((category, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <img src={category.image} alt={category.name} className="w-full h-48 object-cover mb-4 rounded-md" />
              <p className="text-lg font-semibold">{category.price}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-navig hover:bg-navig/90">Alugar Agora</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;