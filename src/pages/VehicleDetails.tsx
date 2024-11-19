import { useParams } from "react-router-dom";
import { FleetVehicleProfile } from "@/components/vehicles/fleet/FleetVehicleProfile";
import Sidebar from "@/components/dashboard/Sidebar";

const VehicleDetails = () => {
  const { id } = useParams();

  if (!id) return null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <FleetVehicleProfile vehicleId={id} />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;