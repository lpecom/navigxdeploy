import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CheckInReservation } from "../types";

interface VehicleDetailsProps {
  reservation: CheckInReservation;
}

export const VehicleDetails = ({ reservation }: VehicleDetailsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium">{reservation.selected_car.name}</h3>
              <p className="text-sm text-muted-foreground">
                {reservation.selected_car.category}
              </p>
            </div>
          </div>
          <Badge>#{reservation.reservation_number}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Cliente</span>
            </div>
            <p className="font-medium">{reservation.driver.full_name}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Data</span>
            </div>
            <p className="font-medium">
              {reservation.pickup_date && format(new Date(reservation.pickup_date), "dd 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Horário</span>
            </div>
            <p className="font-medium">{reservation.pickup_time || "Não definido"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};