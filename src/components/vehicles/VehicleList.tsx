import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { FleetImport } from "@/components/vehicles/FleetImport";
import { useState } from "react";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";
import { CarDataActions } from "./CarDataActions";
import { VehicleListContent } from "./sections/VehicleListContent";

interface VehiclesProps {
  view: 'overview' | 'categories' | 'models' | 'fleet' | 'maintenance';
}

const Vehicles = ({ view }: VehiclesProps) => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Gestão da Frota
              </h1>
              <p className="text-muted-foreground">
                Gerencie categorias, modelos e veículos da sua frota
              </p>
            </div>
            <div className="flex items-center gap-4">
              {view === 'models' && <CarDataActions />}
              {view === 'fleet' && (
                <Button 
                  className="inline-flex items-center gap-2"
                  onClick={() => setIsAddingVehicle(true)}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Veículo
                </Button>
              )}
            </div>
          </div>

          {view === 'fleet' && <FleetImport />}

          <VehicleListContent view={view} vehicles={[]} />
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