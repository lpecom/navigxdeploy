import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./categories/CategoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleCard } from "./VehicleCard";
import { FleetVehicleCard } from "./FleetVehicleCard";
import { EditVehicleDialog } from "./EditVehicleDialog";
import { FleetListView } from "./FleetListView";
import type { CarModel, FleetVehicle } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface VehicleListProps {
  view: 'overview' | 'categories' | 'models' | 'fleet' | 'maintenance';
}

const VehicleList = ({ view }: VehicleListProps) => {
  const { toast } = useToast();
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
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
    setIsAddingVehicle(true);
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
        <TabsTrigger value="list">Lista da Frota</TabsTrigger>
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

      <TabsContent value="list" className="mt-6">
        <FleetListView />
      </TabsContent>

      <EditVehicleDialog
        open={isAddingVehicle}
        onOpenChange={setIsAddingVehicle}
        editingCar={selectedVehicle}
        setEditingCar={setSelectedVehicle}
        onSubmit={async (e) => {
          e.preventDefault();
          setIsAddingVehicle(false);
        }}
      />
    </Tabs>
  );
};

export default VehicleList;
