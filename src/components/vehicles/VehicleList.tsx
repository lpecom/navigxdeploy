import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { EditVehicleDialog } from "./EditVehicleDialog";
import { VehicleCard } from "./VehicleCard";
import type { CarModel, CarModelResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

const VehicleList = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<CarModel | null>(null);
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          car_group:car_groups(name)
        `);
      
      if (error) throw error;
      
      return (data as CarModelResponse[]).map(vehicle => ({
        ...vehicle,
        optionals: vehicle.optionals as Record<string, any> | null
      }));
    }
  });

  const handleEdit = (vehicle: CarModel) => {
    setSelectedVehicle(vehicle);
    setIsEditing(true);
  };

  if (isLoading) {
    return <div>Carregando veículos...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles?.map((vehicle) => (
        <VehicleCard 
          key={vehicle.id} 
          car={vehicle}
          onEdit={() => handleEdit(vehicle)}
        />
      ))}

      <EditVehicleDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        editingCar={selectedVehicle}
        setEditingCar={setSelectedVehicle}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedVehicle) return;

          try {
            const { error } = await supabase
              .from('car_models')
              .update({
                name: selectedVehicle.name,
                car_group_id: selectedVehicle.car_group_id,
                image_url: selectedVehicle.image_url,
                year: selectedVehicle.year,
                description: selectedVehicle.description
              })
              .eq('id', selectedVehicle.id);

            if (error) throw error;

            await queryClient.invalidateQueries({ queryKey: ['vehicles'] });

            toast({
              title: "Veículo atualizado",
              description: "Os detalhes do veículo foram salvos com sucesso.",
            });
            setIsEditing(false);
          } catch (error) {
            toast({
              title: "Erro",
              description: "Falha ao atualizar os detalhes do veículo.",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
};

export default VehicleList;