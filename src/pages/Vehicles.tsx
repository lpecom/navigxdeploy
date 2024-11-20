import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import VehicleList from "@/components/vehicles/VehicleList";
import { FleetImport } from "@/components/vehicles/FleetImport";
import { useState } from "react";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";

interface VehiclesProps {
  view: 'overview' | 'categories' | 'models' | 'fleet' | 'maintenance';
}

const Vehicles = ({ view }: VehiclesProps) => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="pl-64 pt-16">
        <div className="p-8 max-w-[1600px] mx-auto">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Gestão da Frota
              </h1>
              <p className="text-muted-foreground">
                Gerencie categorias, modelos e veículos da sua frota
              </p>
            </div>
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

          {view === 'fleet' && <FleetImport />}

          <VehicleList view={view} />
        </div>
      </main>

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