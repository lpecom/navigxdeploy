import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { type Reservation } from "@/types/reservation";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DetailedReservationView from "./DetailedReservationView";

interface ReservationActionsProps {
  reservation: Reservation;
}

export const ReservationActions = ({ reservation }: ReservationActionsProps) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject' | 'view') => {
    if (action === 'view') {
      setShowDetails(true);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected' 
        })
        .eq('id', reservation.id);

      if (error) throw error;

      toast({
        title: action === 'approve' ? 'Reserva aprovada' : 'Reserva rejeitada',
        description: `Ação realizada para ${reservation.customerName}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar a ação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600"
          onClick={() => handleAction('approve')}
          disabled={isLoading}
        >
          <Check className="w-4 h-4 mr-1" />
          Aprovar
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600"
          onClick={() => handleAction('reject')}
          disabled={isLoading}
        >
          <X className="w-4 h-4 mr-1" />
          Rejeitar
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleAction('view')}
          disabled={isLoading}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
          </DialogHeader>
          <DetailedReservationView reservationId={reservation.id} />
        </DialogContent>
      </Dialog>
    </>
  );
};