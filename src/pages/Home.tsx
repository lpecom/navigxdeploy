import React from 'react';
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CarCategoryCard } from '@/components/home/CarCategoryCard';

const Home = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ['public-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          categories (
            name,
            badge_text
          )
        `)
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
  });

  const formatOfferToCategory = (offer: any) => ({
    name: offer.name,
    models: offer.description,
    price: `R$ ${offer.price}`,
    period: `/${offer.price_period}`,
    location: offer.specs?.location || 'Porto Alegre',
    availability: offer.availability || 'Pronta Entrega',
    badge: offer.categories?.badge_text || 'Usados',
    specs: {
      passengers: offer.specs?.passengers || 4,
      luggage: offer.specs?.luggage || 1,
      transmission: offer.specs?.transmission || 'Manual',
      fuel: offer.specs?.fuel || 'Flex',
      mileage: offer.specs?.mileage || '10.000km',
      insurance: offer.specs?.insurance || 'Básico',
      wifi: offer.specs?.wifi || false,
      consumption: offer.specs?.consumption || '14.5 km/l'
    }
  });

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
        
        {isLoading ? (
          <div className="text-center">Carregando ofertas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {offers?.map((offer) => (
              <CarCategoryCard 
                key={offer.id} 
                category={formatOfferToCategory(offer)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;