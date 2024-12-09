import { Car } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface VehicleImageProps {
  car: CarModel;
}

export const VehicleImage = ({ car }: VehicleImageProps) => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
      {car.image_url ? (
        <img
          src={car.image_url}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <Car className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};