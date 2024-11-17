import { Hero } from "@/components/website/Hero";
import { Features } from "@/components/website/Features";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/website/Footer";
import { CarCategoryCard } from "@/components/home/CarCategoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Hero />
      <Features />
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Nossa Frota Premium
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra o veículo perfeito para suas necessidades entre nossa seleção premium de carros
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {categories?.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CarCategoryCard category={category} />
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