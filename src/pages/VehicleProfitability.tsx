import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Gauge, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const brands = [
  { name: "Tesla", logo: "https://i.imgur.com/3uJ3v7N.png" },
  { name: "BMW", logo: "https://i.imgur.com/2RFcHk3.png" },
  { name: "Ferrari", logo: "https://i.imgur.com/YHXuvkF.png" },
  { name: "Mercedes", logo: "https://i.imgur.com/8e8KoZD.png" },
];

const VehicleProfitability = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicle-profitability', selectedBrand],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_profitability')
        .select(`
          *,
          vehicle:fleet_vehicles(
            plate,
            current_km,
            car_model:car_models(
              name,
              image_url,
              daily_price
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredVehicles = vehicles?.filter(v => 
    v.vehicle?.car_model?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header with Search */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lucratividade da Frota</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Brand Filters */}
      <div className="flex items-center gap-4">
        {brands.map((brand) => (
          <motion.button
            key={brand.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedBrand(brand.name)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg bg-white shadow-sm hover:shadow transition-all",
              selectedBrand === brand.name && "ring-2 ring-primary"
            )}
          >
            <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
            <span className="font-medium">{brand.name}</span>
          </motion.button>
        ))}
        <Button variant="ghost" onClick={() => setSelectedBrand(null)}>
          ver todos
        </Button>
      </div>

      {/* Vehicle Cards */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4">
          {filteredVehicles?.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-w-[300px]"
            >
              <Card className="overflow-hidden">
                <div className="p-6 space-y-4" style={{ backgroundColor: '#FEF7CD' }}>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-black/10 rounded-full">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((vehicle.total_revenue / vehicle.fipe_price) * 100)}% recommend
                    </span>
                  </div>

                  <div className="relative aspect-[16/9]">
                    <img
                      src={vehicle.vehicle?.car_model?.image_url || '/placeholder.svg'}
                      alt={vehicle.vehicle?.car_model?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {vehicle.vehicle?.car_model?.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        <span>{vehicle.vehicle?.current_km} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>R$ {vehicle.vehicle?.car_model?.daily_price}/h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Top Rentals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Rentals</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor"/>
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor"/>
                <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
                <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor"/>
              </svg>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {vehicles?.slice(0, 5).map((vehicle) => (
            <Card key={vehicle.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={vehicle.vehicle?.car_model?.image_url || '/placeholder.svg'}
                      alt={vehicle.vehicle?.car_model?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{vehicle.vehicle?.car_model?.name}</h3>
                    <p className="text-sm text-gray-500">São Paulo</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">By</span>
                    <img
                      src="https://i.imgur.com/YN3oE6N.png"
                      alt="Rental company"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleProfitability;