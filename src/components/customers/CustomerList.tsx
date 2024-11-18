import { useState } from "react";
import { Table, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CustomerTableView } from "./CustomerTableView";
import { CustomerGridView } from "./CustomerGridView";
import { ImportCustomers } from "./ImportCustomers";
import { CustomerFilters } from "./CustomerFilters";
import { useCustomers } from "@/hooks/useCustomers";

export const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const navigate = useNavigate();

  const { customers: filteredCustomers, isLoading, counts, fleetVehicles } = useCustomers(searchTerm, statusFilter);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <CustomerFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          counts={counts}
        />
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
        {counts.activeRental > 0 && ` (${counts.activeRental} com aluguel ativo)`}
      </div>
    </div>
  );
};