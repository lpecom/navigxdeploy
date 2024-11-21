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
        .select("*");
      
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