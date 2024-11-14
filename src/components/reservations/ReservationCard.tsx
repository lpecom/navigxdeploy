import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { StatusBadges } from "./StatusBadges";
import { ReservationExpandedContent } from "./ReservationExpandedContent";
import type { Reservation } from "@/types/reservation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, differenceInDays } from "date-fns";

interface ReservationCardProps {
  reservation: Reservation;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ReservationCard = ({ reservation, isExpanded, onToggle }: ReservationCardProps) => {
  const isHighPriority = (pickupDate: string) => {
    const days = differenceInDays(new Date(pickupDate), new Date());
    return days <= 2 && days >= 0;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium">
            {reservation.customerName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pickup: {format(new Date(reservation.pickupDate), 'MMM dd, yyyy')}
          </p>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isExpanded ? "Show less" : "Show more"}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isHighPriority(reservation.pickupDate) && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High Priority - Pickup in next 2 days
              </AlertDescription>
            </Alert>
          )}
          <StatusBadges reservation={reservation} />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Score</span>
              <span>{reservation.riskScore}%</span>
            </div>
            <Progress 
              value={reservation.riskScore} 
              className="h-2"
              variant={reservation.riskScore <= 30 ? "default" : "destructive"}
            />
          </div>
          
          {isExpanded && <ReservationExpandedContent reservation={reservation} />}
        </div>
      </CardContent>
    </Card>
  );
};