import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    name: string;
    category: string;
    mileage?: string;
    transmission: string;
    engine_size: string;
    image_url: string;
    price?: string;
    availability?: string;
  };
  onSelect: () => void;
}

export const VehicleCard = ({ vehicle, onSelect }: VehicleCardProps) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-100">
      <div className="relative">
        <img 
          src={vehicle.image_url} 
          alt={vehicle.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
          <h3 className="text-lg font-semibold">{vehicle.name}</h3>
          <p className="text-sm opacity-90">{vehicle.mileage}</p>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
              {vehicle.category}
            </Badge>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Car className="w-4 h-4" />
              <span>{vehicle.transmission}</span>
              {vehicle.engine_size && (
                <span className="text-gray-400">• {vehicle.engine_size}</span>
              )}
            </div>
          </div>
        </div>

        {vehicle.availability && (
          <p className="text-blue-600 font-medium">{vehicle.availability}</p>
        )}

        {vehicle.price && (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">A partir de</p>
            <p className="text-2xl font-bold text-gray-900">
              R$ {vehicle.price}
              <span className="text-base font-normal text-gray-600">/semana</span>
            </p>
          </div>
        )}

        <Button 
          onClick={onSelect}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Quero esse
        </Button>
      </CardContent>
    </Card>
  );
};