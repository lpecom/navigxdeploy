import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { CarModelCard } from "./CarModelCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { CarModel } from "@/types/vehicles";

export const CarModelsShowcase = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: carModels, isLoading } = useQuery({
    queryKey: ["car-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  const filteredModels = carModels?.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Premium Fleet
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our selection of premium vehicles, from luxurious sedans to spacious SUVs
          </p>
        </motion.div>

        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by model or type..."
            className="pl-10 py-6 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredModels?.map((model, index) => (
              <CarModelCard
                key={model.id}
                model={model}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};