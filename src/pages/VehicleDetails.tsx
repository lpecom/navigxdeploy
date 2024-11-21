import { useParams } from "react-router-dom";
import { FleetVehicleProfile } from "@/components/vehicles/fleet/FleetVehicleProfile";

const VehicleDetails = () => {
  const { id } = useParams();

  if (!id) return null;

  return (
    <div className="space-y-6">
      <FleetVehicleProfile vehicleId={id} />
    </div>
  );
};

export default VehicleDetails;