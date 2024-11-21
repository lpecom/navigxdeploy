import { Navigation } from "@/components/website/Navigation";
import { Hero } from "@/components/website/Hero";
import { HowItWorks } from "@/components/website/HowItWorks";
import { WhyChooseUs } from "@/components/website/WhyChooseUs";
import { Features } from "@/components/website/Features";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/website/Footer";
import { CarCategoryCard } from "@/components/home/CarCategoryCard";
import { CarModelsShowcase } from "@/components/models/CarModelsShowcase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import type { CarModel } from "@/types/vehicles";

const Home = () => {
  const { data: categories } = useQuery({
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

  const { data: carModels } = useQuery<CarModel[]>({
    queryKey: ["car-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .not("image_url", "is", null);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  const getCarsByCategory = (categoryId: string) => {
    return carModels?.filter(car => car.category_id === categoryId) || [];
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      
      {categories?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((category) => {
                const categoryModels = getCarsByCategory(category.id);
                if (!categoryModels.length) return null;
                
                return (
                  <CarCategoryCard
                    key={category.id}
                    category={category}
                    cars={categoryModels}
                  />
                );
              })}
            </motion.div>
          </div>
        </section>
      )}
      
      <HowItWorks />
      <WhyChooseUs />
      <CarModelsShowcase />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;