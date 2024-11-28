import { VehicleListHeader } from "@/components/vehicles/list/VehicleListHeader";
import { VehicleMetrics } from "@/components/vehicles/list/VehicleMetrics";
import { VehicleListTable } from "@/components/vehicles/list/VehicleListTable";

const VehicleList = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <VehicleListHeader />
      <VehicleMetrics />
      <VehicleListTable />
    </div>
  );
};

export default VehicleList;