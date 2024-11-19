import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Car, Calendar, Gauge } from "lucide-react";
import type { CarModel } from "./types";

interface VehicleCardProps {
  car: CarModel;
  onEdit: (car: CarModel) => void;
}

export const VehicleCard = ({ car, onEdit }: VehicleCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {car.brand_logo_url && (
            <img 
              src={car.brand_logo_url} 
              alt={`${car.name} brand`}
              className="w-8 h-8 object-contain"
            />
          )}
          <CardTitle className="text-xl">{car.name}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(car)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {car.image_url && (
          <div className="relative aspect-video w-full">
            <img
              src={car.image_url}
              alt={car.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Car className="w-4 h-4" />
            <span>Categoria: {car.category_id || 'Sem categoria'}</span>
          </div>
          {car.year && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Ano: {car.year}</span>
            </div>
          )}
          {car.description && (
            <p className="text-sm text-gray-500">{car.description}</p>
          )}
          {car.optionals && Object.entries(car.optionals).map(([key, value]) => (
            <Badge 
              key={key}
              variant="secondary"
              className="mr-2 text-sm"
            >
              {`${key}: ${value}`}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};