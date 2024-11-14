import { Phone, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { type Reservation } from "@/types/reservation";

interface CustomerInfoProps {
  reservation: Reservation;
}

export const CustomerInfo = ({ reservation }: CustomerInfoProps) => {
  return (
    <div className="space-y-2">
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
        {format(new Date(reservation.pickupDate), 'PPP p')}
      </div>
    </div>
  );
};