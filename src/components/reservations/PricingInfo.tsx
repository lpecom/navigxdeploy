import { Badge } from "@/components/ui/badge";
import { Car, Gauge } from "lucide-react";
import { type Reservation } from "@/types/reservation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PricingInfoProps {
  reservation: Reservation;
}

export const PricingInfo = ({ reservation }: PricingInfoProps) => {
  const [selectedKmPlan, setSelectedKmPlan] = useState<'unlimited' | 'limited'>(
    reservation.kilometersPerWeek === 'unlimited' ? 'unlimited' : 'limited'
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const kmPlanPrices = {
    unlimited: reservation.weeklyFare * 1.2,
    limited: reservation.weeklyFare
  };

  return (
    <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
      <div className="space-y-3">
        <RadioGroup
          defaultValue={selectedKmPlan}
          onValueChange={(value) => setSelectedKmPlan(value as 'unlimited' | 'limited')}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="limited" id="limited" />
            <Label htmlFor="limited">Quilometragem Limitada - {formatCurrency(kmPlanPrices.limited)}/semana</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unlimited" id="unlimited" />
            <Label htmlFor="unlimited">Quilometragem Livre - {formatCurrency(kmPlanPrices.unlimited)}/semana</Label>
          </div>
        </RadioGroup>
      </div>

      {reservation.optionals.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-600">Opcionais:</span>
          <ul className="space-y-1">
            {reservation.optionals.map((optional, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span>{optional.name}</span>
                <span className="text-gray-600">{formatCurrency(optional.pricePerWeek)}/semana</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <Gauge className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">
          {selectedKmPlan === 'unlimited' 
            ? 'Quilometragem ilimitada' 
            : '2000km por semana'}
        </span>
      </div>
    </div>
  );
};