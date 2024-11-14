import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { VehicleCard } from "./VehicleCard";
import { EditVehicleDialog } from "./EditVehicleDialog";
import { CarModel, CarModelResponse } from "./types";

const VehicleList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCar, setEditingCar] = useState<CarModel | null>(null);

  const { data: cars, isLoading } = useQuery({
    queryKey: ["car-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*, categories(name)");
      
      if (error) throw error;
      
      // Transform the data to ensure optionals is of type Record<string, boolean>
      return (data as CarModelResponse[]).map(car => ({
        ...car,
        optionals: car.optionals as Record<string, boolean> | null
      }));
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: async (car: CarModel) => {
      const { data, error } = await supabase
        .from("car_models")
        .update({
          name: car.name,
          image_url: car.image_url,
          year: car.year,
          description: car.description,
          optionals: car.optionals,
        })
        .eq("id", car.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-models"] });
      toast({
        title: "Success",
        description: "Car updated successfully",
      });
      setIsEditing(false);
      setEditingCar(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update car",
        variant: "destructive",
      });
    },
  });

  const handleEditCar = (car: CarModel) => {
    setEditingCar(car);
    setIsEditing(true);
  };

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    
    updateCarMutation.mutate(editingCar);
  };

  if (isLoading) return <div>Loading cars...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars?.map((car) => (
          <VehicleCard key={car.id} car={car} onEdit={handleEditCar} />
        ))}
      </div>

      <EditVehicleDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        editingCar={editingCar}
        setEditingCar={setEditingCar}
        onSubmit={handleUpdateCar}
      />
    </div>
  );
};

export default VehicleList;