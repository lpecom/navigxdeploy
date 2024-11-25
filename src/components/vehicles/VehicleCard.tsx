import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Users, Briefcase, GaugeCircle } from "lucide-react";
import { VehicleImage } from "./card/VehicleImage";
import { Badge } from "@/components/ui/badge";
import type { CarModel } from "@/types/vehicles";

interface VehicleCardProps {
  vehicle: CarModel;
  onEdit?: (vehicle: CarModel) => void;
}

export const VehicleCard = ({ vehicle, onEdit }: VehicleCardProps) => {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-[16/9] overflow-hidden">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={vehicle.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Sem imagem disponível</span>
          </div>
        )}
        {vehicle.category?.name && (
          <Badge 
            variant="secondary" 
            className="absolute top-4 right-4 bg-white/90"
          >
            {vehicle.category.name}
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {vehicle.name} {vehicle.year}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {vehicle.description || "Experimente luxo e conforto com nosso veículo premium."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="flex flex-col items-center text-center">
            <Users className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-sm text-gray-600">{vehicle.passengers || 5} Lugares</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Briefcase className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-sm text-gray-600">{vehicle.luggage || 4} Malas</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <GaugeCircle className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-sm text-gray-600">{vehicle.transmission || "Auto"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">A partir de</p>
            <p className="text-2xl font-bold text-primary">
              R$ {vehicle.daily_price?.toFixed(2)}
              <span className="text-sm font-normal text-gray-500">/dia</span>
            </p>
          </div>
          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(vehicle)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};