import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <img
            src={car.image_url}
            alt={car.name}
            className="w-full h-48 object-cover rounded-md"
          />
        )}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Year: {car.year}</p>
          <p className="text-sm">{car.description}</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(car.optionals || {}).map(([key, value]) => (
              <div
                key={key}
                className={`text-sm px-2 py-1 rounded ${
                  value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {key.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};