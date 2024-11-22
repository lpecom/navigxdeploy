import { FleetMetrics } from "../FleetMetrics";
import type { FleetVehicle, VehicleStatus } from "@/types/vehicles";

interface FleetMetricsSectionProps {
  vehicles: FleetVehicle[];
  statusFilter: VehicleStatus | null;
  onFilterChange: (status: VehicleStatus | null) => void;
}

export const FleetMetricsSection = ({
  vehicles,
  statusFilter,
  onFilterChange,
}: FleetMetricsSectionProps) => {
  return (
    <FleetMetrics 
      vehicles={vehicles} 
      onFilterChange={onFilterChange}
      activeFilter={statusFilter}
    />
  );
};