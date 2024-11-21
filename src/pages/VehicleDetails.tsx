import { useParams, useNavigate } from "react-router-dom";
import { FleetVehicleProfile } from "@/components/vehicles/fleet/FleetVehicleProfile";
import { useEffect } from "react";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // If the ID is not a valid UUID, redirect to the fleet page
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (id && !UUID_REGEX.test(id)) {
      navigate("/admin/vehicles/fleet");
      return;
    }
  }, [id, navigate]);

  if (!id) return null;

  return (
    <div className="space-y-6">
      <FleetVehicleProfile vehicleId={id} />
    </div>
  );
};

export default VehicleDetails;