import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { CarModel } from "./types";

interface VehicleCardProps {
  car: CarModel;
  onEdit: (car: CarModel) => void;
}

export const VehicleCard = ({ car, onEdit }: VehicleCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{car.name}</CardTitle>
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
              onError={() => {
                console.error('Failed to load image:', car.image_url);
              }}
            />
          </div>
        )}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Category: {car.category?.name || 'Uncategorized'}</p>
          {car.year && (
            <p className="text-sm text-gray-500">Year: {car.year}</p>
          )}
          {car.description && (
            <p className="text-sm text-gray-500">{car.description}</p>
          )}
          {car.optionals && Object.entries(car.optionals).length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(car.optionals).map(([key, value]) => (
                <Badge 
                  key={key}
                  variant="secondary"
                  className="text-sm"
                >
                  {`${key}: ${value}`}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};