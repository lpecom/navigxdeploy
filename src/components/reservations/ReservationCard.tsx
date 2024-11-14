import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Car } from "lucide-react";
import { StatusBadges } from "./StatusBadges";
import { ReservationExpandedContent } from "./ReservationExpandedContent";
import type { Reservation } from "@/types/reservation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReservationCardProps {
  reservation: Reservation;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ReservationCard = ({ reservation, isExpanded, onToggle }: ReservationCardProps) => {
  const getCategoryColor = (category: Reservation['carCategory']) => {
    const colors = {
      Luxury: "text-purple-600",
      SUV: "text-blue-600",
      Economy: "text-green-600",
      Sports: "text-red-600"
    };
    return colors[category];
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium">
              {reservation.customerName}
            </CardTitle>
            <div className="flex items-center gap-1 text-sm">
              <Car className={`w-4 h-4 ${getCategoryColor(reservation.carCategory)}`} />
              <span className={`${getCategoryColor(reservation.carCategory)}`}>
                {reservation.carCategory}
              </span>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isExpanded ? "Mostrar menos" : "Mostrar mais"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Retirada: {format(new Date(reservation.pickupDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatusBadges reservation={reservation} />
          {isExpanded && <ReservationExpandedContent reservation={reservation} />}
        </div>
      </CardContent>
    </Card>
  );
};