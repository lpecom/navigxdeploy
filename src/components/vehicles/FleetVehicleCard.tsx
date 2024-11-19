import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FleetVehicle } from "@/types/vehicles";

interface FleetVehicleCardProps {
  vehicle: FleetVehicle;
}

export const FleetVehicleCard = ({ vehicle }: FleetVehicleCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/vehicles/${vehicle.id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {vehicle.car_model?.image_url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={vehicle.car_model.image_url}
                alt={vehicle.car_model.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg">
              {vehicle.car_model?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Placa: {vehicle.plate}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quilometragem</span>
              <span className="font-medium">{vehicle.current_km.toLocaleString()} km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Próxima Revisão</span>
              <span className="font-medium">
                {new Date(vehicle.next_revision_date).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant={vehicle.status === 'available' ? 'success' : 'secondary'}>
              {vehicle.status}
            </Badge>
            {vehicle.customer?.full_name && (
              <span className="text-sm text-muted-foreground">
                {vehicle.customer.full_name}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
