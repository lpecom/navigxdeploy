import { Badge } from "@/components/ui/badge";
import { ThermometerSnowflake, ThermometerSun, CreditCard, Flag, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { type Reservation } from "@/types/reservation";
import { differenceInDays } from "date-fns";

interface StatusBadgesProps {
  reservation: Reservation;
}

export const StatusBadges = ({ reservation }: StatusBadgesProps) => {
  const getRiskBadge = (score: number) => {
    if (score <= 30) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 flex gap-1 items-center">
          <ThermometerSnowflake className="w-4 h-4" />
          Baixo Risco
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 flex gap-1 items-center">
        <ThermometerSun className="w-4 h-4" />
        Alto Risco
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: Reservation['paymentStatus']) => {
    return (
      <Badge className={status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
        <CreditCard className="w-4 h-4 mr-1" />
        {status === 'paid' ? 'Pago' : 'Pagamento Pendente'}
      </Badge>
    );
  };

  const getDocumentsBadge = (submitted: boolean) => {
    if (submitted) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 flex gap-1 items-center">
          <CheckCircle2 className="w-4 h-4" />
          Documentos OK
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-100 text-amber-800 flex gap-1 items-center">
        <AlertTriangle className="w-4 h-4" />
        Documentos Pendentes
      </Badge>
    );
  };

  const getPriorityBadge = (pickupDate: string) => {
    const days = differenceInDays(new Date(pickupDate), new Date());
    if (days <= 1) {
      return (
        <Badge className="bg-red-600 text-white flex gap-1 items-center">
          <Flag className="w-4 h-4" />
          URGENTE: Retirada em {days === 0 ? 'Hoje' : 'Amanhã'}
        </Badge>
      );
    }
    if (days <= 3) {
      return (
        <Badge className="bg-amber-500 text-white flex gap-1 items-center">
          <Clock className="w-4 h-4" />
          Retirada em {days} dias
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {getPriorityBadge(reservation.pickupDate)}
      {getRiskBadge(reservation.riskScore)}
      {getPaymentStatusBadge(reservation.paymentStatus)}
      {getDocumentsBadge(reservation.documentsSubmitted)}
    </div>
  );
};