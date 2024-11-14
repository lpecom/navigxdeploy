import { Phone, MapPin, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { type Reservation } from "@/types/reservation";
import { Badge } from "@/components/ui/badge";

interface CustomerInfoProps {
  reservation: Reservation;
}

export const CustomerInfo = ({ reservation }: CustomerInfoProps) => {
  const getCustomerStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'returning':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Novo Cliente';
      case 'returning':
        return 'Cliente Recorrente';
      case 'blocked':
        return 'Cliente Bloqueado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User className="w-4 h-4" />
        <span>CPF: {reservation.cpf}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone className="w-4 h-4" />
        {reservation.phone}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        {reservation.address}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        {format(new Date(reservation.pickupDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
      </div>
      <Badge className={`${getCustomerStatusColor(reservation.customerStatus)}`}>
        {getCustomerStatusLabel(reservation.customerStatus)}
      </Badge>
    </div>
  );
};