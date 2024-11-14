import { Phone, MapPin, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { type Reservation } from "@/types/reservation";

interface CustomerInfoProps {
  reservation: Reservation;
}

export const CustomerInfo = ({ reservation }: CustomerInfoProps) => {
  const getCustomerStatusBadge = (status: Reservation['customerStatus']) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      returning: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={`${styles[status]} flex gap-1 items-center`}>
        <User className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)} Customer
      </Badge>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">{reservation.customerName}</div>
        {getCustomerStatusBadge(reservation.customerStatus)}
      </div>
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
    </div>
  );
};