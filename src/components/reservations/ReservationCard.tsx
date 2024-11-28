import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, User, Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Reservation } from "@/types/reservation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard = ({ reservation }: ReservationCardProps) => {
  const pickupDate = new Date(reservation.pickupDate);
  const formattedDate = format(pickupDate, "dd MMM, yyyy", { locale: ptBR });

  const getStatusBadge = (status: string) => {
    const styles = {
      regular: "bg-blue-50 text-blue-600",
      member: "bg-green-50 text-green-600",
      assurance: "bg-orange-50 text-orange-600"
    };
    return styles[status as keyof typeof styles] || styles.regular;
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full px-3">
              #{reservation.reservationNumber}
            </Badge>
            <Badge 
              variant="secondary" 
              className={cn("rounded-full px-3", getStatusBadge('regular'))}
            >
              Regular
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reservation.customerName}`} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">Customer name</p>
                <p className="font-medium">{reservation.customerName}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Phone number</p>
                <p className="font-medium">{reservation.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-Mail</p>
                <p className="font-medium">{reservation.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of register</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Vehicle Category</p>
                <p className="font-medium">{reservation.carCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup Time</p>
                <p className="font-medium">{reservation.pickupTime || 'Not scheduled'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button 
            variant="outline" 
            className="w-32"
            onClick={() => {}}
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
          <Button 
            className="w-32 bg-blue-500 hover:bg-blue-600"
            onClick={() => {}}
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;