import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./categories/CategoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CarModel, FleetVehicle } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface VehicleListProps {
  view: 'overview' | 'categories' | 'models' | 'fleet' | 'maintenance';
}

const VehicleList = ({ view }: VehicleListProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<CarModel | null>(null);
  const queryClient = useQueryClient();

  const { data: carModels, isLoading: modelsLoading } = useQuery({
    queryKey: ['car-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          category:categories(name)
        `);
      
      if (error) throw error;
      return data as CarModel[];
    }
  });

  const { data: fleetVehicles, isLoading: fleetLoading } = useQuery({
    queryKey: ['fleet-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(*)
        `);
      
      if (error) throw error;
      return data as FleetVehicle[];
    }
  });

  const handleEdit = (vehicle: CarModel) => {
    setSelectedVehicle(vehicle);
    setIsEditing(true);
  };

  if (modelsLoading || fleetLoading) {
    return <div>Carregando...</div>;
  }

  if (view === 'categories') {
    return <CategoryList />;
  }

  // Only show the tabs for models and fleet views
  if (view !== 'models' && view !== 'fleet') {
    return <div>Content for {view} view</div>;
  }

  return (
    <Tabs defaultValue="models" className="w-full">
      <TabsList>
        <TabsTrigger value="models">Modelos</TabsTrigger>
        <TabsTrigger value="fleet">Frota</TabsTrigger>
      </TabsList>

      <TabsContent value="models" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carModels?.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              car={vehicle}
              onEdit={() => handleEdit(vehicle)}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="fleet" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetVehicles?.map((vehicle) => (
            <FleetVehicleCard 
              key={vehicle.id} 
              vehicle={vehicle}
            />
          ))}
        </div>
      </TabsContent>

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
                description: selectedVehicle.description,
                category_id: selectedVehicle.category_id,
                image_url: selectedVehicle.image_url,
                year: selectedVehicle.year,
              })
              .eq('id', selectedVehicle.id);

            if (error) throw error;

            await queryClient.invalidateQueries({ queryKey: ['car-models'] });

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
    </Tabs>
  );
};

export default VehicleList;
