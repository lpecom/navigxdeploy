import { useParams } from "react-router-dom";
import { FleetVehicleProfile } from "@/components/vehicles/fleet/FleetVehicleProfile";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

const VehicleDetails = () => {
  const { id } = useParams();

  // Add validation for invalid IDs
  if (!id || id === 'overview') {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="container py-6">
            <Alert variant="destructive">
              <AlertDescription>
                Invalid vehicle ID provided.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="container py-6 space-y-6"
        >
          <FleetVehicleProfile vehicleId={id} />
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleDetails;