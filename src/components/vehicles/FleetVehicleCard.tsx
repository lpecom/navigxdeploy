import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, Gauge } from "lucide-react";
import type { FleetVehicle } from "./types";

interface FleetVehicleCardProps {
  vehicle: FleetVehicle;
}

export const FleetVehicleCard = ({ vehicle }: FleetVehicleCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          {vehicle.car_model?.name} - {vehicle.plate}
        </CardTitle>
        <Badge variant={vehicle.is_available ? "default" : "destructive"}>
          {vehicle.is_available ? "Disponível" : "Indisponível"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicle.car_model?.image_url && (
          <div className="relative aspect-video w-full">
            <img
              src={vehicle.car_model.image_url}
              alt={vehicle.car_model.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Car className="w-4 h-4" />
              <span>Ano: {vehicle.year}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Gauge className="w-4 h-4" />
              <span>KM: {vehicle.current_km.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Próxima Revisão: {new Date(vehicle.next_revision_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};