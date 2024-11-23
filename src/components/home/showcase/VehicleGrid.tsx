import { VehicleCard } from "./VehicleCard";
import type { CarModel } from "@/types/vehicles";

interface VehicleGridProps {
  vehicles: CarModel[];
}

export const VehicleGrid = ({ vehicles }: VehicleGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles?.map((vehicle, index) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          index={index}
        />
      ))}
    </div>
  );
};