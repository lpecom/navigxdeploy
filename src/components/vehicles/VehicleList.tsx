import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./categories/CategoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleCard } from "./VehicleCard";
import { FleetVehicleCard } from "./FleetVehicleCard";
import { EditVehicleDialog } from "./EditVehicleDialog";
import { FleetListView } from "./FleetListView";
import type { CarModel, FleetVehicle } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface VehicleListProps {
  view: 'overview' | 'categories' | 'models' | 'fleet' | 'maintenance';
}

const VehicleList = ({ view }: VehicleListProps) => {
  const { toast } = useToast();
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<CarModel | null>(null);

  const { data: carModels, isLoading: modelsLoading } = useQuery({
    queryKey: ['car-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          category:categories(name)
        `)
        .order('name');
      
      if (error) throw error;
      return (data || []) as CarModel[];
    }
  });

  const { data: fleetVehicles, isLoading: fleetLoading } = useQuery({
    queryKey: ['fleet-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            name,
            year,
            image_url
          )
        `)
        .order('plate');
      
      if (error) throw error;
      
      // Filter out invalid entries
      return (data || []).filter(vehicle => 
        vehicle && 
        vehicle.plate && 
        vehicle.car_model
      ) as FleetVehicle[];
    }
  });

  const handleEdit = (vehicle: CarModel) => {
    setSelectedVehicle(vehicle);
    setIsAddingVehicle(true);
  };

  if (view === 'categories') {
    return <CategoryList />;
  }

  if (view !== 'models' && view !== 'fleet') {
    return <div>Content for {view} view</div>;
  }

  const renderLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="models" className="w-full">
      <TabsList>
        <TabsTrigger value="models">Modelos ({carModels?.length || 0})</TabsTrigger>
        <TabsTrigger value="fleet">Frota ({fleetVehicles?.length || 0})</TabsTrigger>
        <TabsTrigger value="list">Lista da Frota</TabsTrigger>
      </TabsList>

      <TabsContent value="models" className="mt-6">
        {modelsLoading ? (
          renderLoading()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carModels?.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                car={vehicle}
                onEdit={() => handleEdit(vehicle)}
              />
            ))}
            {(!carModels || carModels.length === 0) && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Nenhum modelo cadastrado
              </div>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="fleet" className="mt-6">
        {fleetLoading ? (
          renderLoading()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleetVehicles?.map((vehicle) => (
              <FleetVehicleCard 
                key={vehicle.id} 
                vehicle={vehicle}
              />
            ))}
            {(!fleetVehicles || fleetVehicles.length === 0) && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Nenhum veículo cadastrado na frota
              </div>
            )}
          </div>
        )}
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