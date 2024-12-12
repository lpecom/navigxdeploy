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
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium text-secondary-900">{reservation.customerName || 'Cliente não identificado'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium text-secondary-900">{reservation.phone || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-secondary-900">{reservation.email || 'Não informado'}</p>
                </div>
              </div>

              {reservation.optionals && reservation.optionals.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Opcionais</p>
                  <div className="flex flex-wrap gap-2">
                    {reservation.optionals.map((optional, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-600">
                        <Package2 className="w-3 h-3 mr-1" />
                        {optional.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
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
                  <span className="text-sm text-secondary-900">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-secondary-900">{formattedTime}</span>
                </div>
                {reservation.weeklyFare && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-secondary-900">
                      R$ {reservation.weeklyFare.toFixed(2)}/semana
                    </span>
                  </div>
                )}
              </div>
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

export default ReservationCard;