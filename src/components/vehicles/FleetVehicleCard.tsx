import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, Gauge } from "lucide-react";
import type { FleetVehicle } from "./types";

interface FleetVehicleCardProps {
  vehicle: FleetVehicle;
}

export const FleetVehicleCard = ({ vehicle }: FleetVehicleCardProps) => {
  const getStatusColor = (status: string) => {
    if (!status) return 'default';
    status = status.toLowerCase();
    if (status.includes('disponivel') || status === 'available') return 'default';
    if (status.includes('manutencao') || status.includes('maintenance')) return 'destructive';
    if (status.includes('locado') || status === 'rented') return 'secondary';
    return 'default';
  };

  if (!vehicle.plate || !vehicle.car_model) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          {vehicle.plate}
        </CardTitle>
        <Badge variant={getStatusColor(vehicle.status)}>
          {vehicle.status || 'N/A'}
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
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Car className="w-4 h-4" />
            <span>{vehicle.car_model?.name} ({vehicle.car_model?.year || 'N/A'})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Gauge className="w-4 h-4" />
            <span>KM: {vehicle.current_km?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Próxima Revisão: {vehicle.next_revision_date ? new Date(vehicle.next_revision_date).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};