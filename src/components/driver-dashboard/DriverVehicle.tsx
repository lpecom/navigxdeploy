import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleInfo } from "./VehicleInfo";
import MaintenanceHistory from "./MaintenanceHistory";
import { Button } from "@/components/ui/button";
import { Wrench, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DriverVehicleProps {
  driverId: string;
}

export const DriverVehicle = ({ driverId }: DriverVehicleProps) => {
  const { toast } = useToast();

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
          <Card>
            <CardHeader>
              <CardTitle>Status do Veículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Próxima Revisão</span>
                  <span className="text-sm font-medium">Em 3 meses</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quilometragem</span>
                  <span className="text-sm font-medium">15.000 km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Estado Geral</span>
                  <span className="text-sm font-medium text-green-600">Ótimo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="font-medium text-yellow-900">Lembrete</h3>
                  <p className="text-sm text-yellow-800">
                    Sua próxima revisão está agendada para 15/05/2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MaintenanceHistory driverId={driverId} />
    </div>
  );
};