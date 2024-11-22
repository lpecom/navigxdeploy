import { Card } from "@/components/ui/card";
import type { CheckInReservation } from "../types";

interface ReservationHeaderProps {
  reservation: CheckInReservation;
}

export const ReservationHeader = ({ reservation }: ReservationHeaderProps) => {
  if (!reservation?.selected_car || !reservation?.driver) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <h3 className="font-medium">{reservation.selected_car.name}</h3>
        <p className="text-sm text-muted-foreground">
          Cliente: {reservation.driver.full_name}
        </p>
      </div>
    </Card>
  );
};