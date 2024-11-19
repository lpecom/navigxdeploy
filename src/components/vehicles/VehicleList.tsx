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
import type { CarModel, FleetVehicle } from "@/types/vehicles";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const renderLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </Card>
      ))}
    </div>
  );

  const renderMaintenanceView = () => {
    if (fleetLoading) return renderLoading();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fleetVehicles?.map((vehicle) => (
          <FleetVehicleCard 
            key={vehicle.id} 
            vehicle={vehicle}
          />
        ))}
        {(!fleetVehicles || fleetVehicles.length === 0) && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              Nenhum veículo cadastrado na frota
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="models">Modelos</TabsTrigger>
          <TabsTrigger value="fleet">Frota</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
          {view === 'maintenance' && (
            <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="categories">
          <CategoryList />
        </TabsContent>

        <TabsContent value="models">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar modelos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => setIsAddingVehicle(true)} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Novo Modelo
              </Button>
            </div>

            {modelsLoading ? (
              renderLoading()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels?.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    car={vehicle}
                    onEdit={() => handleEdit(vehicle)}
                  />
                ))}
                {(!filteredModels || filteredModels.length === 0) && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Nenhum modelo encontrado' : 'Nenhum modelo cadastrado'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
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
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhum veículo cadastrado na frota
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <FleetListView />
        </TabsContent>

        {view === 'maintenance' && (
          <TabsContent value="maintenance">
            {renderMaintenanceView()}
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