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
          category:categories(name)
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
    return <div>Loading vehicles...</div>;
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
                image_url: selectedVehicle.image_url,
                year: selectedVehicle.year,
                description: selectedVehicle.description
              })
              .eq('id', selectedVehicle.id);

            if (error) throw error;

            // Invalidate and refetch the vehicles query
            await queryClient.invalidateQueries({ queryKey: ['vehicles'] });

            toast({
              title: "Vehicle updated",
              description: "The vehicle details have been saved successfully.",
            });
            setIsEditing(false);
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to update vehicle details.",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
};

export default VehicleList;