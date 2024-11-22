import { Button } from "@/components/ui/button";
import { Check, X, Eye, RotateCcw } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";

interface ReservationActionsProps {
  reservation: Reservation;
  currentStatus: 'pending_approval' | 'approved' | 'rejected';
}

export const ReservationActions = ({ reservation, currentStatus }: ReservationActionsProps) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleAction = async (action: 'approve' | 'reject' | 'review' | 'view') => {
    if (action === 'view') {
      setShowDetails(true);
      return;
    }

    setIsLoading(action);
    try {
      const newStatus = action === 'approve' 
        ? 'approved' 
        : action === 'reject' 
          ? 'rejected' 
          : 'pending_approval';

      const { error } = await supabase
        .from('checkout_sessions')
        .update({ status: newStatus })
        .eq('id', reservation.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['reservations'] });

      const actionMessages = {
        approve: 'Reserva aprovada',
        reject: 'Reserva rejeitada',
        review: 'Reserva retornada para revisão'
      };

      toast({
        title: actionMessages[action as keyof typeof actionMessages],
        description: `Ação realizada para ${reservation.customerName}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar a ação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-4">
        {currentStatus === 'pending_approval' && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 disabled:opacity-50"
              onClick={() => handleAction('approve')}
              disabled={isLoading !== null}
            >
              <Check className="w-4 h-4 mr-1" />
              {isLoading === 'approve' ? 'Aprovando...' : 'Aprovar'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50"
              onClick={() => handleAction('reject')}
              disabled={isLoading !== null}
            >
              <X className="w-4 h-4 mr-1" />
              {isLoading === 'reject' ? 'Rejeitando...' : 'Rejeitar'}
            </Button>
          </>
        )}

        {currentStatus === 'rejected' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 disabled:opacity-50"
            onClick={() => handleAction('review')}
            disabled={isLoading !== null}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            {isLoading === 'review' ? 'Retornando...' : 'Voltar para revisão'}
          </Button>
        )}

        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleAction('view')}
          disabled={isLoading !== null}
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