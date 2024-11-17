import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleInfo } from "./VehicleInfo";
import MaintenanceHistory from "./MaintenanceHistory";
import { Button } from "@/components/ui/button";
import { Wrench, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleDiagnostics } from "./VehicleDiagnostics";
import { VehicleStatusCard } from "./VehicleStatusCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DriverVehicleProps {
  driverId: string;
}

export const DriverVehicle = ({ driverId }: DriverVehicleProps) => {
  const { toast } = useToast();

  const { data: vehicleStatus } = useQuery({
    queryKey: ['vehicle-status', driverId],
    queryFn: async () => {
      const { data: checkoutSession } = await supabase
        .from('checkout_sessions')
        .select(`
          id,
          fleet_vehicles (
            current_km,
            last_revision_date,
            next_revision_date,
            is_available
          )
        `)
        .eq('driver_id', driverId)
        .eq('status', 'active')
        .single();

      if (!checkoutSession?.fleet_vehicles?.[0]) {
        return null;
      }

      const vehicle = checkoutSession.fleet_vehicles[0]; // Access the first vehicle in the array
      
      return {
        nextRevision: new Date(vehicle.next_revision_date).toLocaleDateString(),
        mileage: vehicle.current_km,
        fuelLevel: 75, // This would ideally come from OBD data
        maintenanceNeeded: new Date(vehicle.next_revision_date) <= new Date(),
        isAvailable: vehicle.is_available
      };
    }
  });

  const handleServiceRequest = () => {
    toast({
      title: "Solicitação enviada",
      description: "Nossa equipe entrará em contato em breve.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Meu Veículo</h1>
        <Button onClick={handleServiceRequest}>
          <Wrench className="w-4 h-4 mr-2" />
          Solicitar Serviço
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnóstico</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Veículo</CardTitle>
                </CardHeader>
                <CardContent>
                  <VehicleInfo driverId={driverId} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {vehicleStatus ? (
                <VehicleStatusCard status={vehicleStatus} />
              ) : (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Sem veículo ativo</h3>
                        <p className="text-sm text-yellow-800">
                          Você não possui nenhum veículo ativo no momento.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="diagnostics">
          <VehicleDiagnostics driverId={driverId} />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceHistory driverId={driverId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};