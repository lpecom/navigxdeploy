import { Card } from "@/components/ui/card";
import type { FleetVehicle } from "@/types/vehicles";

interface TopRentalsProps {
  vehicles: FleetVehicle[];
}

export const TopRentals = ({ vehicles }: TopRentalsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Top Rentals</h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor"/>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {vehicles?.slice(0, 5).map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={vehicle.car_model?.image_url || '/placeholder.svg'}
                    alt={vehicle.car_model?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{vehicle.car_model?.name}</h3>
                  <p className="text-sm text-gray-500">{vehicle.branch}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};