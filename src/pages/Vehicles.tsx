import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import VehicleList from "@/components/vehicles/VehicleList";
import { FleetImport } from "@/components/vehicles/FleetImport";
import { useState } from "react";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface VehiclesProps {
  view: 'overview' | 'categories' | 'models' | 'fleet' | 'maintenance';
}

const Vehicles = ({ view }: VehiclesProps) => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  return (
    <DashboardLayout
      title="Gestão da Frota"
      subtitle="Gerencie categorias, modelos e veículos da sua frota"
    >
      <div className="flex justify-end">
        {view === 'fleet' && (
          <Button 
            onClick={() => setIsAddingVehicle(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Veículo
          </Button>
        )}
      </div>

      {view === 'fleet' && <FleetImport />}

      <div className="bg-white rounded-lg border shadow-sm">
        <VehicleList view={view} />
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
    </DashboardLayout>
  );
};

export default Vehicles;