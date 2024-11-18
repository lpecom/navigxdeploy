import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (value: string[]) => void;
  counts: {
    activeRental: number;
    active: number;
    inactive: number;
  };
}

export const CustomerFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts
}: CustomerFiltersProps) => {
  const statusOptions = [
    { label: 'Ativos', value: 'active', count: counts.active },
    { label: 'Aluguel Ativo', value: 'active_rental', count: counts.activeRental },
    { label: 'Inativos', value: 'inactive', count: counts.inactive }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Buscar por nome, email ou CPF..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {statusFilter.length > 0 && (
                <span className="ml-1 bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs">
                  {statusFilter.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status do Cliente</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={statusFilter.includes(option.value)}
                onCheckedChange={(checked) => {
                  onStatusFilterChange(
                    checked 
                      ? [...statusFilter, option.value]
                      : statusFilter.filter(item => item !== option.value)
                  );
                }}
              >
                {option.label} ({option.count})
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};