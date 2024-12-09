import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Calendar, Wrench, AlertTriangle, FileText } from "lucide-react";
import { VehicleInfoTab } from "./profile/VehicleInfoTab";
import { MaintenanceTab } from "./profile/MaintenanceTab";
import { HistoryTab } from "./profile/HistoryTab";
import { IncidentsTab } from "./profile/IncidentsTab";
import { FinesTab } from "./profile/FinesTab";
import { StatusLabel } from "./status/StatusLabel";
import type { MaintenanceRecord, FleetVehicle, CarModel } from "@/types/vehicles";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FleetVehicleProfileProps {
  vehicleId: string;
}

export const FleetVehicleProfile = ({ vehicleId }: FleetVehicleProfileProps) => {
  // Add validation for vehicleId
  if (!vehicleId) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Invalid vehicle ID provided.
        </AlertDescription>
      </Alert>
    );
  }

  const { data: vehicleDetails, error } = useQuery({
    queryKey: ['fleet-vehicle-details', vehicleId],
    queryFn: async () => {
      const { data: vehicle, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            id,
            name,
            year,
            image_url,
            category_id,
            description,
            optionals,
            created_at,
            updated_at,
            brand_logo_url,
            engine_size,
            transmission
          ),
          customer:customers(
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('id', vehicleId)
        .single();

      if (error) throw error;
      if (!vehicle) return null;

      return {
        ...vehicle,
        car_model: vehicle.car_model as CarModel | undefined
      } as FleetVehicle;
    },
    enabled: !!vehicleId, // Only run query if vehicleId is present
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading vehicle details: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!vehicleDetails) {
    return (
      <Alert>
        <AlertDescription>
          No vehicle found with the provided ID.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {vehicleDetails.car_model?.name}
                </h2>
                <StatusLabel status={vehicleDetails.status} size="lg" />
              </div>
              <p className="text-muted-foreground">
                Placa: {vehicleDetails.plate}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground">Quilometragem</p>
              <p className="text-lg font-semibold">
                {vehicleDetails.current_km?.toLocaleString()} km
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Última Revisão</p>
              <p className="text-lg font-semibold">
                {new Date(vehicleDetails.last_revision_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Próxima Revisão</p>
              <p className="text-lg font-semibold">
                {new Date(vehicleDetails.next_revision_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ano</p>
              <p className="text-lg font-semibold">{vehicleDetails.year}</p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">
            <Car className="w-4 h-4 mr-2" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="w-4 h-4 mr-2" />
            Manutenções
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="incidents">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Ocorrências
          </TabsTrigger>
          <TabsTrigger value="fines">
            <FileText className="w-4 h-4 mr-2" />
            Multas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <VehicleInfoTab vehicleDetails={vehicleDetails} />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceTab maintenanceHistory={[]} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentsTab />
        </TabsContent>

        <TabsContent value="fines">
          <FinesTab 
            vehicleId={vehicleId} 
            plate={vehicleDetails.plate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};