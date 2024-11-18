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
import { Badge } from "@/components/ui/badge";

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
    { 
      label: 'Com Aluguel Ativo', 
      value: 'active_rental', 
      count: counts.activeRental, 
      color: 'bg-blue-100 text-blue-800',
      description: 'Clientes com veículos alugados atualmente'
    },
    { 
      label: 'Ativos', 
      value: 'active', 
      count: counts.active, 
      color: 'bg-green-100 text-green-800',
      description: 'Clientes sem aluguéis ativos'
    },
    { 
      label: 'Inativos', 
      value: 'inactive', 
      count: counts.inactive, 
      color: 'bg-gray-100 text-gray-800',
      description: 'Clientes sem atividade recente'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por nome, email, CPF, placa ou modelo do veículo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {statusFilter.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {statusFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
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
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    <Badge className={option.color}>{option.count}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status Summary */}
      <div className="flex gap-4 flex-wrap">
        {statusOptions.map((option) => (
          <div
            key={option.value}
            className="flex flex-col gap-1 px-4 py-2 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Badge className={option.color}>{option.count}</Badge>
              <span className="font-medium">{option.label}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {option.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};