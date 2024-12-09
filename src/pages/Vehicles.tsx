import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import VehicleList from "@/components/vehicles/VehicleList";
import { useState } from "react";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";
import { motion } from "framer-motion";

interface VehiclesProps {
  view: 'overview' | 'categories' | 'models' | 'fleet' | 'maintenance';
}

const Vehicles = ({ view }: VehiclesProps) => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
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

      <VehicleList view={view} />

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
    </motion.div>
  );
};

export default Vehicles;