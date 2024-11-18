import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Search, Table, Grid, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { CustomerTableView } from "./CustomerTableView"
import { CustomerGridView } from "./CustomerGridView"
import { ImportCustomers } from "./ImportCustomers"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const navigate = useNavigate()

  // First fetch fleet vehicles to get customers with active rentals
  const { data: fleetVehicles } = useQuery({
    queryKey: ['fleet-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          customer_id,
          customers!inner (
            id,
            full_name,
            email,
            cpf
          )
        `)
        .eq('status', 'RENTED')
        .not('customer_id', 'is', null);
      
      if (error) throw error;
      return data;
    },
  });

  // Get array of customer IDs with active rentals, filtering out any null values
  const activeRentalCustomerIds = fleetVehicles
    ?.filter(v => v.customer_id && v.customers)
    .map(v => v.customer_id) || [];

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', activeRentalCustomerIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Update customer status based on fleet data
      return data?.map(customer => ({
        ...customer,
        status: activeRentalCustomerIds.includes(customer.id) 
          ? 'active_rental' 
          : (customer.status || 'active')
      }));
    },
  });

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = 
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf?.includes(searchTerm);

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(customer.status || 'active');

    // Filter out customers with placeholder emails (those created during import)
    const isValidCustomer = !customer.email?.includes('@placeholder.com');

    return matchesSearch && matchesStatus && isValidCustomer;
  });

  const statusOptions = [
    { label: 'Ativos', value: 'active' },
    { label: 'Aluguel Ativo', value: 'active_rental' },
    { label: 'Inativos', value: 'inactive' }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  // Count customers by status, excluding placeholder customers
  const validCustomers = customers?.filter(c => !c.email?.includes('@placeholder.com')) || [];
  const activeRentalCount = validCustomers.filter(c => c.status === 'active_rental').length;
  const activeCount = validCustomers.filter(c => c.status === 'active').length;
  const inactiveCount = validCustomers.filter(c => c.status === 'inactive').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                      setStatusFilter(prev => 
                        checked 
                          ? [...prev, option.value]
                          : prev.filter(item => item !== option.value)
                      );
                    }}
                  >
                    {option.label} ({option.value === 'active_rental' ? activeRentalCount : 
                                   option.value === 'active' ? activeCount : inactiveCount})
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex gap-2">
          <ImportCustomers />
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <CustomerTableView customers={filteredCustomers || []} />
      ) : (
        <CustomerGridView 
          customers={filteredCustomers || []}
          expandedCustomerId={expandedCustomerId}
          onToggleExpand={(id) => setExpandedCustomerId(
            expandedCustomerId === id ? null : id
          )}
          onViewDetails={(id) => navigate(`/admin/customers/${id}`)}
        />
      )}

      {filteredCustomers?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum cliente encontrado.
        </div>
      )}

      <div className="text-sm text-muted-foreground text-right">
        Total: {filteredCustomers?.length || 0} clientes 
        {activeRentalCount > 0 && ` (${activeRentalCount} com aluguel ativo)`}
      </div>
    </div>
  );
};