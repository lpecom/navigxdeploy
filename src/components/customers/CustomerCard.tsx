import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Phone, Mail, MapPin, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Customer {
  id: string;
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  created_at: string;
  total_rentals: number;
  last_rental_date?: string;
  status: string;
}

interface CustomerCardProps {
  customer: Customer;
  isExpanded: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}

export const CustomerCard = ({ customer, isExpanded, onToggle, onViewDetails }: CustomerCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active_rental':
        return <Badge className="bg-blue-100 text-blue-800">Aluguel Ativo</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="p-6 transition-all duration-200 hover:border-primary/20">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{customer.full_name}</h3>
          <p className="text-sm text-muted-foreground">CPF: {customer.cpf}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(customer.status)}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          {customer.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          {customer.email}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t space-y-4">
          {customer.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 mt-1" />
              <div>
                <p>{customer.address}</p>
                <p>
                  {customer.city}, {customer.state} - {customer.postal_code}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total de Aluguéis</p>
              <p className="text-lg font-semibold">{customer.total_rentals}</p>
            </div>
            {customer.last_rental_date && (
              <div>
                <p className="text-sm text-muted-foreground">Último Aluguel</p>
                <p className="text-lg font-semibold">
                  {formatDistanceToNow(new Date(customer.last_rental_date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Cliente desde</p>
            <p className="text-sm">
              {formatDistanceToNow(new Date(customer.created_at), {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className="mt-4 w-full flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {isExpanded ? (
          <>
            Mostrar menos <ChevronUp className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            Ver mais <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </Card>
  );
};