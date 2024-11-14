import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { EditVehicleDialog } from "./EditVehicleDialog";
import { CarModel } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const fetchVehicles = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      car_groups (
        name
      )
    `);
  
  if (error) throw error;
  return data as CarModel[];
};

const VehicleList = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<CarModel | null>(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles
  });

  const handleEdit = (vehicle: CarModel) => {
    setSelectedVehicle(vehicle);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedVehicle) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          name: selectedVehicle.name,
          image_url: selectedVehicle.image_url,
        })
        .eq('id', selectedVehicle.id);

      if (error) throw error;

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
  };

  if (isLoading) {
    return <div>Loading vehicles...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles?.map((vehicle) => (
        <Card 
          key={vehicle.id}
          className="group hover:shadow-lg transition-all duration-300 animate-fade-in"
        >
          <CardHeader className="space-y-1">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {vehicle.name}
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {vehicle.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicle.image_url && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Settings className="w-4 h-4 text-primary" />
                <span>{vehicle.engine_size}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Car className="w-4 h-4 text-primary" />
                <span>{vehicle.transmission}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Features:</h4>
              <div className="flex flex-wrap gap-2">
                {vehicle.features?.map((feature, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="bg-accent/50 text-accent-foreground"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleEdit(vehicle)}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-md border border-primary/20 hover:border-primary/40"
            >
              Edit Vehicle
            </button>
          </CardContent>
        </Card>
      ))}

      <EditVehicleDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        editingCar={selectedVehicle}
        setEditingCar={setSelectedVehicle}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default VehicleList;