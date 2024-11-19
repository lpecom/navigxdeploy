import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VehicleListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddVehicle: () => void;
}

export const VehicleListHeader = ({
  searchTerm,
  onSearchChange,
  onAddVehicle
}: VehicleListHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar veículos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button onClick={onAddVehicle} className="shrink-0">
        <Plus className="h-4 w-4 mr-2" />
        Novo Veículo
      </Button>
    </div>
  );
};