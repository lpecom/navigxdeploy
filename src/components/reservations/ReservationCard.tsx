import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, User, Calendar, Clock, MapPin, Car, CreditCard } from "lucide-react";
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

  const getPlanBadgeStyle = (planType: string) => {
    const styles = {
      'Navig Black': "bg-black text-white",
      'Navig Mensal': "bg-purple-50 text-purple-600",
      'Navig Semanal': "bg-blue-50 text-blue-600",
      'default': "bg-gray-50 text-gray-600"
    };
    return styles[planType as keyof typeof styles] || styles.default;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full px-3">
              #{reservation.reservationNumber}
            </Badge>
            <Badge 
              variant="secondary" 
              className={cn("rounded-full px-3", getPlanBadgeStyle(reservation.planType || 'default'))}
            >
              {reservation.planType || 'Plano não selecionado'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reservation.customerName}`} />
                <AvatarFallback>
                  <User className="h-6 w-6 text-primary/60" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium text-secondary-900">{reservation.customerName}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-secondary-900">{reservation.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-secondary-900">{reservation.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicle Category</p>
                <p className="font-medium text-secondary-900">{reservation.carCategory}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-secondary-900">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-secondary-900">{reservation.pickupTime || 'Not scheduled'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button 
            variant="outline" 
            className="w-32 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
          <Button 
            className="w-32 bg-primary hover:bg-primary/90 text-white transition-colors"
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