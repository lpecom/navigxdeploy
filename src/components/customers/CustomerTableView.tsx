import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface CustomerTableViewProps {
  customers: any[]
}

export const CustomerTableView = ({ customers }: CustomerTableViewProps) => {
  const navigate = useNavigate()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active_rental':
        return <Badge className="bg-blue-100 text-blue-800">Aluguel Ativo</Badge>
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome / CPF</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Veículo Alugado</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cliente Desde</TableHead>
            <TableHead>Aluguéis</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{customer.full_name}</div>
                  <div className="text-sm text-muted-foreground">{customer.cpf}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{customer.email}</div>
                  <div className="text-muted-foreground">{customer.phone}</div>
                </div>
              </TableCell>
              <TableCell>
                {customer.rented_vehicle ? (
                  <div className="text-sm">
                    <div className="font-medium">{customer.rented_vehicle.model}</div>
                    <div className="text-muted-foreground">{customer.rented_vehicle.plate}</div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge(customer.status)}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatDistanceToNow(new Date(customer.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{customer.total_rentals || 0} aluguéis</div>
                  {customer.last_rental_date && (
                    <div className="text-muted-foreground">
                      Último: {formatDistanceToNow(new Date(customer.last_rental_date), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/admin/customers/${customer.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}