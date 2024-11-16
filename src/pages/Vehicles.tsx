import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import VehicleList from "@/components/vehicles/VehicleList";
import { FleetImport } from "@/components/vehicles/FleetImport";
import { useState } from "react";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";

const Vehicles = () => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Veículos
              </h1>
              <p className="text-muted-foreground">
                Gerencie sua frota de veículos e seus detalhes
              </p>
            </div>
            <Button 
              className="inline-flex items-center gap-2"
              onClick={() => setIsAddingVehicle(true)}
            >
              <Plus className="w-4 h-4" />
              Adicionar Veículo
            </Button>
          </div>

          <FleetImport />

          <div className="rounded-lg border bg-card">
            <div className="flex items-center gap-2 p-6 border-b">
              <Car className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">Frota de Veículos</h2>
            </div>
            <div className="p-6">
              <VehicleList />
            </div>
          </div>
        </div>
      </div>

      <EditVehicleDialog
        open={isAddingVehicle}
        onOpenChange={setIsAddingVehicle}
        editingCar={null}
        setEditingCar={() => {}}
        onSubmit={async (e) => {
          e.preventDefault();
          setIsAddingVehicle(false);
        }}
      />
    </div>
  );
};

export default Vehicles;