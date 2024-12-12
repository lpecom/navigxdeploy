import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, User, Calendar, Clock, Car, Package2, Shield } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Reservation } from "@/types/reservation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RiskAnalysisDialog } from "./RiskAnalysisDialog";
import { ReservationDetails } from "./sections/ReservationDetails";
import { CustomerInfo } from "./sections/CustomerInfo";
import { InsuranceInfo } from "./sections/InsuranceInfo";
import { OptionalsInfo } from "./sections/OptionalsInfo";

interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard = ({ reservation }: ReservationCardProps) => {
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);
  const pickupDate = new Date(reservation.pickupDate);
  const formattedDate = format(pickupDate, "dd MMM, yyyy", { locale: ptBR });
  const formattedTime = reservation.pickupTime || "Não agendado";

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
    <>
      <Card className="group hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3">
                #{reservation.reservationNumber}
              </Badge>
              {reservation.planType && (
                <Badge 
                  variant="secondary" 
                  className={cn("rounded-full px-3", getPlanBadgeStyle(reservation.planType))}
                >
                  {reservation.planType}
                </Badge>
              )}
              {reservation.paymentType === 'pay_now' && (
                <Badge variant="default" className="bg-green-50 text-green-600">
                  Pagamento Online
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <CustomerInfo customer={reservation} />
            <div className="space-y-6">
              <ReservationDetails reservation={reservation} />
              <InsuranceInfo insuranceOption={reservation.insuranceOption} />
              <OptionalsInfo optionals={reservation.optionals} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button 
              onClick={() => setShowRiskAnalysis(true)}
              className="w-40 bg-amber-50 hover:bg-amber-100 text-amber-600 hover:text-amber-700 border-amber-200 hover:border-amber-300 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Análise de Risco
            </Button>
          </div>
        </CardContent>
      </Card>

      <RiskAnalysisDialog
        open={showRiskAnalysis}
        onOpenChange={setShowRiskAnalysis}
        reservation={reservation}
        onApprove={() => {}}
        onReject={() => {}}
      />
    </>
  );
};