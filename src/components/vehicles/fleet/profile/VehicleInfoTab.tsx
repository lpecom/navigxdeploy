import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import type { FleetVehicle } from "@/types/vehicles";

interface VehicleInfoTabProps {
  vehicleDetails: FleetVehicle;
}

export const VehicleInfoTab = ({ vehicleDetails }: VehicleInfoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Veículo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Chassi</p>
            <p className="font-medium">{vehicleDetails.chassis_number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Renavam</p>
            <p className="font-medium">{vehicleDetails.renavam_number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cor</p>
            <p className="font-medium">{vehicleDetails.color || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <p className="font-medium">{vehicleDetails.state || 'N/A'}</p>
          </div>
        </div>

        {vehicleDetails.customer && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <User className="w-4 h-4" />
              Cliente Atual
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Nome:</span>{' '}
                {vehicleDetails.customer.full_name}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{' '}
                {vehicleDetails.customer.email || 'N/A'}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Telefone:</span>{' '}
                {vehicleDetails.customer.phone || 'N/A'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
