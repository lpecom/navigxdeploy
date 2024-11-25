import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { CarModel } from "@/types/vehicles";
import { VehicleGrid } from "./showcase/VehicleGrid";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const VehicleShowcase = () => {
  const [sortBy, setSortBy] = useState<'newest' | 'profitable'>('newest');

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['showcase-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          category:categories(name)
        `)
        .order('name')
        .limit(6);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  const sortedVehicles = vehicles?.slice().sort((a, b) => {
    if (sortBy === 'newest') {
      return parseInt(b.year || '0') - parseInt(a.year || '0');
    } else {
      // Sort by profitability (using daily_price as a proxy)
      return (b.daily_price || 0) - (a.daily_price || 0);
    }
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="h-[400px] bg-gray-800/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Nossos Veículos
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Conheça nossa frota premium selecionada para motoristas de aplicativo
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={sortBy === 'newest' ? 'default' : 'outline'}
            onClick={() => setSortBy('newest')}
            className={`
              px-6 py-2 rounded-full transition-all duration-300
              ${sortBy === 'newest' 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
                : 'bg-white/10 text-white hover:bg-white/20 border-white/20'}
            `}
          >
            Mais novos
          </Button>
          <Button
            variant={sortBy === 'profitable' ? 'default' : 'outline'}
            onClick={() => setSortBy('profitable')}
            className={`
              px-6 py-2 rounded-full transition-all duration-300
              ${sortBy === 'profitable' 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
                : 'bg-white/10 text-white hover:bg-white/20 border-white/20'}
            `}
          >
            Mais lucrativos
          </Button>
        </div>

        <VehicleGrid vehicles={sortedVehicles || []} />
      </div>
    </section>
  );
};