import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import VehicleList from "@/components/vehicles/VehicleList";
import { FleetImport } from "@/components/vehicles/FleetImport";
import { useState } from "react";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";

interface VehiclesProps {
  view: 'fleet' | 'rentals' | 'customers';
}

const Vehicles = ({ view }: VehiclesProps) => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const getTitle = () => {
    switch (view) {
      case 'fleet':
        return 'Frota de Veículos';
      case 'rentals':
        return 'Locações Ativas';
      case 'customers':
        return 'Clientes';
      default:
        return 'Veículos';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {getTitle()}
              </h1>
              <p className="text-muted-foreground">
                {view === 'fleet' && 'Gerencie sua frota de veículos e seus detalhes'}
                {view === 'rentals' && 'Visualize e gerencie as locações ativas'}
                {view === 'customers' && 'Gerencie os clientes e suas informações'}
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

          <div className="rounded-lg border bg-card">
            <div className="flex items-center gap-2 p-6 border-b">
              <Car className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">{getTitle()}</h2>
            </div>
            <div className="p-6">
              <VehicleList view={view} />
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