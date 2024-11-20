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
    blocked?: number;
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
      count: counts.activeRental || 0, 
      color: 'bg-blue-100 text-blue-800',
      description: 'Clientes com veículos alugados atualmente'
    },
    { 
      label: 'Recentes', 
      value: 'active', 
      count: counts.active || 0, 
      color: 'bg-green-100 text-green-800',
      description: 'Clientes ativos nos últimos 90 dias'
    },
    { 
      label: 'Inativos', 
      value: 'inactive', 
      count: counts.inactive || 0, 
      color: 'bg-gray-100 text-gray-800',
      description: 'Sem atividade nos últimos 90 dias'
    },
    { 
      label: 'Bloqueados', 
      value: 'blocked', 
      count: counts.blocked || 0, 
      color: 'bg-red-100 text-red-800',
      description: 'Clientes com acesso bloqueado'
    }
  ];

  const handleFilterChange = (value: string) => {
    onStatusFilterChange(statusFilter.includes(value) ? [] : [value]);
  };

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
              Status
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
                onCheckedChange={() => handleFilterChange(option.value)}
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

      <div className="flex gap-4 flex-wrap">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange(option.value)}
            className={`flex flex-col gap-1 px-4 py-2 rounded-lg transition-colors ${
              statusFilter.includes(option.value) 
                ? 'bg-gray-100 ring-2 ring-primary/20' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Badge className={option.color}>{option.count}</Badge>
              <span className="font-medium">{option.label}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};