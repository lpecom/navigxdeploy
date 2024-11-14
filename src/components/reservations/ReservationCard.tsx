import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReservationExpandedContent } from "./ReservationExpandedContent";
import type { Reservation } from "@/types/reservation";

interface ReservationCardProps {
  reservation: Reservation;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ReservationCard = ({ reservation, isExpanded, onToggle }: ReservationCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{reservation.customerName}</h3>
            <p className="text-sm text-muted-foreground">{reservation.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isExpanded && <ReservationExpandedContent reservation={reservation} />}
      </CardContent>
    </Card>
  );
};