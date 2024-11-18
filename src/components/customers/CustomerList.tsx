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

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
  })

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = 
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf.includes(searchTerm)

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(customer.status || 'active')

    return matchesSearch && matchesStatus
  })

  const statusOptions = [
    { label: 'Ativos', value: 'active' },
    { label: 'Aluguel Ativo', value: 'active_rental' },
    { label: 'Inativos', value: 'inactive' }
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
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
                    )
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
      </div>
    </div>
  )
}