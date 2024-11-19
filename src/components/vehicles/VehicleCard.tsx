import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { searchAndUpdateCarImage } from "@/utils/imageSearch";
import type { CarModel } from "./types";

interface VehicleCardProps {
  car: CarModel;
  onEdit?: (car: CarModel) => void;
}

export const VehicleCard = ({ car, onEdit }: VehicleCardProps) => {
  const { toast } = useToast();

  const handleImageRefresh = async () => {
    try {
      await searchAndUpdateCarImage(car.name);
      toast({
        title: "Success",
        description: "Vehicle image has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle image",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            {car.image_url ? (
              <img
                src={car.image_url}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image available
              </div>
            )}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 opacity-80 hover:opacity-100"
              onClick={handleImageRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <h3 className="font-semibold">{car.name}</h3>
            {car.description && (
              <p className="text-sm text-muted-foreground">{car.description}</p>
            )}
          </div>

          {onEdit && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => onEdit(car)}>
                Edit
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};