import { VehicleCard } from "../VehicleCard";
import { FleetVehicleCard } from "../FleetVehicleCard";
import type { CarModel, FleetVehicle } from "@/types/vehicles";

interface VehicleListContentProps {
  view: 'models' | 'fleet';
  vehicles: (CarModel | FleetVehicle)[];
  onEdit?: (vehicle: CarModel) => void;
}

export const VehicleListContent = ({ view, vehicles, onEdit }: VehicleListContentProps) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">
          Nenhum veículo encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        view === 'models' ? (
          <VehicleCard 
            key={vehicle.id} 
            car={vehicle as CarModel}
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