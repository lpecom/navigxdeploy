import { VehicleCard } from "../VehicleCard";
import { FleetVehicleCard } from "../FleetVehicleCard";
import type { CarModel, FleetVehicle } from "@/types/vehicles";

interface VehicleListContentProps {
  view: 'models' | 'fleet';
  vehicles: (CarModel | FleetVehicle)[];
  onEdit?: (vehicle: CarModel) => void;
}

export const VehicleListContent = ({ 
  view, 
  vehicles,
  onEdit 
}: VehicleListContentProps) => {
  if (!vehicles?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No vehicles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {vehicles.map((vehicle) => (
        view === 'models' ? (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle as CarModel}
            onEdit={onEdit}
          />
        ) : (
          <FleetVehicleCard
            key={vehicle.id}
            vehicle={vehicle as FleetVehicle}
          />
        )
      ))}
    </div>
  );
};