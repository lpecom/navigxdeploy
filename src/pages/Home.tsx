import { Hero } from "@/components/website/Hero";
import { Features } from "@/components/website/Features";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/website/Footer";
import { CarCategoryCard } from "@/components/home/CarCategoryCard";
import { StoreWindow } from "@/components/website/StoreWindow";
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

  const { data: selectedCar } = useQuery({
    queryKey: ["featured-car"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select(`
          *,
          car_group:car_groups(name)
        `)
        .limit(1);
      
      if (error) throw error;
      if (!data || data.length === 0) return null;
      
      const vehicle = data[0];
      return {
        id: vehicle.id,
        name: vehicle.name,
        category: vehicle.car_group?.name || vehicle.category,
        price: 934,
        period: "semana",
        image_url: vehicle.image_url,
        specs: {
          passengers: vehicle.passengers,
          transmission: vehicle.transmission,
          consumption: vehicle.consumption,
          plan: "Flex"
        }
      };
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Hero />
      <Features />
      
      {selectedCar && (
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-navig font-medium tracking-wide uppercase text-sm mb-4 block">
                Alugue Agora
              </span>
              <h2 className="text-[3.5rem] font-medium tracking-tight text-gray-900 mb-6 leading-none">
                Veículo em Destaque
              </h2>
              <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Comece sua jornada com nosso veículo mais popular
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              <StoreWindow selectedCar={selectedCar} />
            </motion.div>
          </div>
        </section>
      )}
      
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
            <h2 className="text-[3.5rem] font-medium tracking-tight text-gray-900 mb-6 leading-none">
              Nossa Frota Premium
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Descubra o veículo perfeito para suas necessidades entre nossa seleção premium de carros
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
            {categories?.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CarCategoryCard category={category} index={index} />
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