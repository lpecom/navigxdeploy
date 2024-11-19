import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./categories/CategoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleCard } from "./VehicleCard";
import { FleetVehicleCard } from "./FleetVehicleCard";
import { EditVehicleDialog } from "./EditVehicleDialog";
import { FleetListView } from "./FleetListView";
import { FleetOverview } from "./fleet/overview/FleetOverview";
import type { CarModel, FleetVehicle } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

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

  if (view === 'overview') {
    return <FleetOverview />;
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
    <Card className="p-6">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="models">Modelos</TabsTrigger>
          <TabsTrigger value="fleet">Frota</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryList />
        </TabsContent>

        <TabsContent value="models">
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

        <TabsContent value="fleet">
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

        <TabsContent value="list">
          <FleetListView />
        </TabsContent>
      </Tabs>

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
    </Card>
  );
};

export default VehicleList;