import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FleetSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const FleetSearchBar = ({ searchTerm, onSearchChange }: FleetSearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por placa ou modelo..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 bg-white"
      />
    </div>
  );
};