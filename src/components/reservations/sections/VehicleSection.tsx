import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Wrench } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VehicleSectionProps {
  vehicle: {
    model: string;
    plate: string;
    mileage: number;
    lastService: string;
    nextServiceDue: string;
  };
  onServiceRequest: () => void;
}

export const VehicleSection = ({ vehicle, onServiceRequest }: VehicleSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Car className="w-4 h-4 text-primary" />
          Detalhes do Veículo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">{vehicle.model}</p>
              <p className="text-sm text-muted-foreground">Placa: {vehicle.plate}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quilometragem Atual:</span>
                <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Última Revisão:</span>
                <span className="font-medium">
                  {format(new Date(vehicle.lastService), "PP", { locale: ptBR })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Próxima Revisão:</span>
                <span className="font-medium">
                  {format(new Date(vehicle.nextServiceDue), "PP", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <Button variant="outline" onClick={onServiceRequest}>
              <Wrench className="w-4 h-4 mr-2" />
              Solicitar Serviço
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};