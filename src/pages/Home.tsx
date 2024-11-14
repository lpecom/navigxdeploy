import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CarCategoryCard } from '@/components/home/CarCategoryCard';

const Home = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
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
            {categories?.map((category) => (
              <CarCategoryCard 
                key={category.id} 
                category={category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;