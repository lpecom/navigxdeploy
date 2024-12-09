import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FleetHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalFiltered: number;
  totalVehicles: number;
}

export const FleetHeader = ({
  searchTerm,
  onSearchChange,
  totalFiltered,
  totalVehicles
}: FleetHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por placa, modelo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>
      {totalFiltered !== totalVehicles && (
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{totalFiltered}</span> de{" "}
          <span className="font-medium text-foreground">{totalVehicles}</span> veículos
        </p>
      )}
    </div>
  );
};