import { Car } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface VehicleImageProps {
  car: CarModel;
}

export const VehicleImage = ({ car }: VehicleImageProps) => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md">
      {car.image_url ? (
        <img
          src={car.image_url}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <Car className="h-12 w-12 text-gray-400" />
        </div>
      )}
    </div>
  );
};