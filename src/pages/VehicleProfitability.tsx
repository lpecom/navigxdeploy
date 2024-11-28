import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { BrandFilters } from "@/components/vehicles/profitability/BrandFilters";
import { VehicleCard } from "@/components/vehicles/profitability/VehicleCard";
import { TopRentals } from "@/components/vehicles/profitability/TopRentals";

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
            id,
            plate,
            current_km,
            branch,
            year,
            last_revision_date,
            next_revision_date,
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

      <BrandFilters 
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
      />

      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4">
          {filteredVehicles?.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={{
                ...vehicle.vehicle,
                total_revenue: vehicle.total_revenue,
                fipe_price: vehicle.fipe_price,
              }}
            />
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

      <TopRentals vehicles={filteredVehicles?.map(v => ({
        id: v.vehicle.id,
        plate: v.vehicle.plate,
        current_km: v.vehicle.current_km,
        branch: v.vehicle.branch,
        year: v.vehicle.year,
        last_revision_date: v.vehicle.last_revision_date,
        next_revision_date: v.vehicle.next_revision_date,
        car_model: v.vehicle.car_model
      })) || []} />
    </div>
  );
};

export default VehicleProfitability;