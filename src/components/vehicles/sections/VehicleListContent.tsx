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
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum veículo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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