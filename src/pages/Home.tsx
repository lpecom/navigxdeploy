import { Navigation } from "@/components/website/Navigation";
import { Hero } from "@/components/website/Hero";
import { HowItWorks } from "@/components/website/HowItWorks";
import { WhyChooseUs } from "@/components/website/WhyChooseUs";
import { Features } from "@/components/website/Features";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/website/Footer";
import { CarCategoryCard } from "@/components/home/CarCategoryCard";
import { VehicleShowcase } from "@/components/home/VehicleShowcase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import type { CarModel } from "@/types/vehicles";

const Home = () => {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: carModels } = useQuery({
    queryKey: ["car-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*");
      
      if (error) throw error;
      return data as CarModel[];
    }
  });

  const getCarsByCategory = (categoryId: string) => {
    return carModels?.filter(car => car.category_id === categoryId) || [];
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <Hero />
      <VehicleShowcase />
      <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Escolha sua Categoria
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Selecione a categoria ideal para suas necessidades
            </p>
          </motion.div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[400px] bg-gray-800/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories?.map((category) => (
                <CarCategoryCard
                  key={category.id}
                  category={category}
                  cars={getCarsByCategory(category.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <HowItWorks />
      <WhyChooseUs />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;