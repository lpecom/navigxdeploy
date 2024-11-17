import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Calendar,
  Gauge,
  Fuel,
  AlertTriangle
} from "lucide-react";

interface VehicleStatusProps {
  status: {
    nextRevision: string;
    mileage: number;
    fuelLevel: number;
    maintenanceNeeded: boolean;
    isAvailable: boolean;
  };
}

export const VehicleStatusCard = ({ status }: VehicleStatusProps) => {
  const getStatusIcon = () => {
    if (!status.isAvailable) return <XCircle className="w-5 h-5 text-red-500" />;
    if (status.maintenanceNeeded) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Próxima Revisão</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{status.nextRevision}</span>
              {new Date(status.nextRevision) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Quilometragem</span>
            </div>
            <span className="text-sm font-medium">{status.mileage.toLocaleString()} km</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Combustível</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                status.fuelLevel < 25 ? 'text-red-500' : 
                status.fuelLevel < 50 ? 'text-yellow-500' : 
                'text-green-600'
              }`}>
                {status.fuelLevel}%
              </span>
              {status.fuelLevel < 25 && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status Geral</span>
              {getStatusIcon()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};