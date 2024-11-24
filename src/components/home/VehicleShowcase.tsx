import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { CarCategoryCard } from "./CarCategoryCard";
import type { CarModel } from "@/types/vehicles";

export const VehicleShowcase = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['showcase-categories'],
    queryFn: async () => {
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*, car_models!car_models_category_id_fkey(*)')
        .eq('is_active', true)
        .order('display_order');
      
      if (categoriesError) throw categoriesError;
      return categories;
    },
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
            O carro mais lucrativo disponível para você
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Maximize seus ganhos com nossa frota premium selecionada para motoristas de aplicativo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <CarCategoryCard
              key={category.id}
              category={category}
              cars={category.car_models as CarModel[]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};