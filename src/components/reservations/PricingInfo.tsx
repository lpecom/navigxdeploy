import { Badge } from "@/components/ui/badge";
import { Car, Gauge } from "lucide-react";
import { type Reservation } from "@/types/reservation";

interface PricingInfoProps {
  reservation: Reservation;
}

export const PricingInfo = ({ reservation }: PricingInfoProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-3 bg-slate-50 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Weekly Fare:</span>
        <span className="text-lg font-semibold text-primary">
          {formatCurrency(reservation.weeklyFare)}
        </span>
      </div>
      
      {reservation.optionals.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-600">Optionals:</span>
          <ul className="space-y-1">
            {reservation.optionals.map((optional, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span>{optional.name}</span>
                <span className="text-gray-600">{formatCurrency(optional.pricePerWeek)}/week</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <Gauge className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">
          {reservation.kilometersPerWeek === 'unlimited' 
            ? 'Unlimited kilometers' 
            : `${reservation.kilometersPerWeek}km per week`}
        </span>
      </div>
    </div>
  );
};