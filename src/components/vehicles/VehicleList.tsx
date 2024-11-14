import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleCard } from "./VehicleCard";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const VehicleList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSelectVehicle = (vehicle: any) => {
    sessionStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
    toast({
      title: "Veículo selecionado",
      description: "Redirecionando para os planos disponíveis..."
    });
    navigate('/plans');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles?.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onSelect={() => handleSelectVehicle(vehicle)}
        />
      ))}
    </div>
  );
};