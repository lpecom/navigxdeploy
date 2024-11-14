import { Badge } from "@/components/ui/badge";
import { ThermometerSnowflake, ThermometerSun, Car, CreditCard, Flag } from "lucide-react";
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

  const getCarCategoryBadge = (category: Reservation['carCategory']) => {
    const colors = {
      Luxury: "bg-purple-100 text-purple-800",
      SUV: "bg-blue-100 text-blue-800",
      Economy: "bg-green-100 text-green-800",
      Sports: "bg-red-100 text-red-800"
    };

    return (
      <Badge className={`flex gap-1 items-center ${colors[category]}`}>
        <Car className="w-4 h-4" />
        {category}
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

  const getPriorityBadge = (pickupDate: string) => {
    const days = differenceInDays(new Date(pickupDate), new Date());
    if (days === 1) {
      return (
        <Badge className="bg-red-100 text-red-800 flex gap-1 items-center font-bold">
          <Flag className="w-4 h-4" />
          PRIORIDADE: PRÓXIMO DIA
        </Badge>
      );
    }
    if (days <= 2 && days >= 0) {
      return (
        <Badge className="bg-red-100 text-red-800 flex gap-1 items-center">
          <Flag className="w-4 h-4" />
          Alta Prioridade
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {getRiskBadge(reservation.riskScore)}
        {getCarCategoryBadge(reservation.carCategory)}
      </div>
      <div className="flex items-center justify-between">
        {getPaymentStatusBadge(reservation.paymentStatus)}
        {getPriorityBadge(reservation.pickupDate)}
      </div>
    </div>
  );
};