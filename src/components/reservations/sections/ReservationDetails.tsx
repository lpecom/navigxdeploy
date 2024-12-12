import { Car, Calendar, Clock } from "lucide-react";
import type { Reservation } from "@/types/reservation";

interface ReservationDetailsProps {
  reservation: Reservation;
}

export const ReservationDetails = ({ reservation }: ReservationDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
          <Car className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Categoria</p>
          <p className="font-medium text-secondary-900">{reservation.carCategory}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-secondary-900">{reservation.pickupDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-secondary-900">{reservation.pickupTime || "Horário não definido"}</span>
        </div>
      </div>
    </div>
  );
};