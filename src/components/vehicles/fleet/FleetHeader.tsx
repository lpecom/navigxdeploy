import { FleetSearchBar } from "./FleetSearchBar";

interface FleetHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalFiltered: number;
  totalVehicles: number;
}

export const FleetHeader = ({
  searchTerm,
  onSearchChange,
  totalFiltered,
  totalVehicles,
}: FleetHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <FleetSearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
      <div className="text-sm text-muted-foreground">
        Total filtrado: {totalFiltered} de {totalVehicles} veículos
      </div>
    </div>
  );
};