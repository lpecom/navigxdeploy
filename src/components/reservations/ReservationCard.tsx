import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ThermometerSnowflake, ThermometerSun, Car, Calendar, Clock } from "lucide-react";
import { ReservationExpandedContent } from "./ReservationExpandedContent";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Reservation } from "@/types/reservation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ReservationCardProps {
  reservation: Reservation;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ReservationCard = ({ reservation, isExpanded, onToggle }: ReservationCardProps) => {
  const queryClient = useQueryClient();

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({ status: 'approved' })
        .eq('id', reservation.id);

      if (error) throw error;

      toast.success('Reserva aprovada com sucesso');
      // Invalidate and refetch reservations
      await queryClient.invalidateQueries({ queryKey: ['reservations'] });
      onToggle(); // Close the expanded view
    } catch (error) {
      console.error('Error approving reservation:', error);
      toast.error('Erro ao aprovar reserva');
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({ status: 'rejected' })
        .eq('id', reservation.id);

      if (error) throw error;

      toast.success('Reserva rejeitada com sucesso');
      // Invalidate and refetch reservations
      await queryClient.invalidateQueries({ queryKey: ['reservations'] });
      onToggle(); // Close the expanded view
    } catch (error) {
      console.error('Error rejecting reservation:', error);
      toast.error('Erro ao rejeitar reserva');
    }
  };

  const getRiskBadge = (score: number) => {
    if (score <= 30) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 flex gap-1 items-center">
          <ThermometerSnowflake className="w-4 h-4" />
          Baixo Risco
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 flex gap-1 items-center">
        <ThermometerSun className="w-4 h-4" />
        Alto Risco
      </Badge>
    );
  };

  const pickupDate = new Date(reservation.pickupDate);
  const formattedDate = format(pickupDate, "dd 'de' MMMM", { locale: ptBR });
  const formattedTime = reservation.pickupTime || "Horário não definido";

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
        {!isExpanded && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Car className="w-4 h-4" />
                {reservation.carCategory}
              </Badge>
              {getRiskBadge(reservation.riskScore)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formattedTime}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isExpanded && (
          <ReservationExpandedContent 
            reservation={reservation} 
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </CardContent>
    </Card>
  );
};