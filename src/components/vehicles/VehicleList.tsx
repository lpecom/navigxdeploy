import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./categories/CategoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditVehicleDialog } from "./EditVehicleDialog";
import { FleetListView } from "./FleetListView";
import { FleetOverview } from "./fleet/overview/FleetOverview";
import { Card } from "@/components/ui/card";
import { VehicleListHeader } from "./sections/VehicleListHeader";
import { VehicleListContent } from "./sections/VehicleListContent";
import { supabase } from "@/integrations/supabase/client";
import type { CarModel, FleetVehicle } from "@/types/vehicles";

interface VehicleListProps {
  view: 'overview' | 'categories' | 'models' | 'fleet' | 'maintenance';
}

const VehicleList = ({ view }: VehicleListProps) => {
  const { toast } = useToast();
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<CarModel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
          ),
          maintenance_records:maintenance_records(
            id,
            service_type,
            service_date,
            status
          )
        `)
        .order('plate');
      
      if (error) throw error;
      
      return (data || []).filter(vehicle => 
        vehicle && 
        vehicle.plate && 
        vehicle.car_model
      ) as unknown as FleetVehicle[];
    }
  });

  const handleEdit = (vehicle: CarModel) => {
    setSelectedVehicle(vehicle);
    setIsAddingVehicle(true);
  };

  const filteredModels = carModels?.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === 'overview') {
    return <FleetOverview />;
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="list">Listagem</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="models">Modelos</TabsTrigger>
          <TabsTrigger value="fleet">Frota</TabsTrigger>
          {view === 'maintenance' && (
            <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="categories">
          <CategoryList />
        </TabsContent>

        <TabsContent value="models">
          <div className="space-y-6">
            <VehicleListHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddVehicle={() => setIsAddingVehicle(true)}
            />
            {modelsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <VehicleListContent
                view="models"
                vehicles={filteredModels || []}
                onEdit={handleEdit}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="fleet">
          {fleetLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <VehicleListContent
              view="fleet"
              vehicles={fleetVehicles || []}
            />
          )}
        </TabsContent>

        <TabsContent value="list">
          <FleetListView />
        </TabsContent>

        {view === 'maintenance' && (
          <TabsContent value="maintenance">
            <VehicleListContent
              view="fleet"
              vehicles={fleetVehicles || []}
            />
          </TabsContent>
        )}
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