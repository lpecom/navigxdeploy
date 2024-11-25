import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Users, Briefcase, GaugeCircle } from "lucide-react";
import { VehicleImage } from "./card/VehicleImage";
import { Badge } from "@/components/ui/badge";
import { getBrandLogo, getBrandFromModel } from "@/utils/brandLogos";
import type { CarModel } from "@/types/vehicles";

interface VehicleCardProps {
  vehicle: CarModel;
  onEdit?: (vehicle: CarModel) => void;
}

export const VehicleCard = ({ vehicle, onEdit }: VehicleCardProps) => {
  const brandLogo = getBrandLogo(vehicle.name);
  const brandName = getBrandFromModel(vehicle.name);

  return (
    <Card className="overflow-hidden group">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Badge 
            variant="outline" 
            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm"
          >
            {brandLogo && (
              <img 
                src={brandLogo} 
                alt={`${brandName} logo`} 
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            )}
            <span>{brandName}</span>
          </Badge>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(vehicle)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">{vehicle.name}</h3>
        {vehicle.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {vehicle.description}
          </p>
        )}
      </div>

      <VehicleImage car={vehicle} />

      <div className="p-4 pt-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center">
            <Users className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">
              {vehicle.passengers || 5} Lugares
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Briefcase className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">
              {vehicle.luggage || 2} Malas
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <GaugeCircle className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">
              {vehicle.transmission || "Auto"}
            </span>
          </div>
        </div>

        {vehicle.daily_price && (
          <div className="border-t pt-4">
            <div className="text-center">
              <span className="text-sm text-muted-foreground">A partir de</span>
              <div className="text-2xl font-bold">
                R$ {vehicle.daily_price.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">/dia</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};