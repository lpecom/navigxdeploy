import { AlertTriangle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { VehicleList } from "@/components/vehicles/VehicleList";

const Vehicles = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Gestão de Frota</h1>
        <VehicleList />
      </div>
    </div>
  );
};

export default Vehicles;