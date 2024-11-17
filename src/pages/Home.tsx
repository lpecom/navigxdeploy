import { Navigation } from "@/components/website/Navigation";
import { Hero } from "@/components/website/Hero";
import { Features } from "@/components/website/Features";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/website/Footer";
import { CarCategoryCard } from "@/components/home/CarCategoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { carsByCategory } from "@/constants/cars";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-gray-900">
      <Navigation />
      <Hero />
      
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <span className="text-navig font-medium tracking-wide uppercase text-sm mb-4 block">
              Escolha seu veículo
            </span>
            <h2 className="text-[3.5rem] font-medium tracking-tight text-white mb-6 leading-none">
              Nossa Frota Premium
            </h2>
            <p className="text-xl font-light text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Descubra o veículo perfeito para suas necessidades
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
            {categories?.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <CarCategoryCard 
                  category={category} 
                  cars={carsByCategory[category.name as keyof typeof carsByCategory] || []}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;