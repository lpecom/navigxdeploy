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
import DetailedReservationView from "./DetailedReservationView";

interface ReservationActionsProps {
  reservation: Reservation;
}

export const ReservationActions = ({ reservation }: ReservationActionsProps) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  const handleAction = (action: 'approve' | 'reject' | 'view') => {
    const messages = {
      approve: 'Reserva aprovada com sucesso',
      reject: 'Reserva rejeitada',
      view: 'Abrindo detalhes da reserva'
    };

    if (action === 'view') {
      setShowDetails(true);
    }

    toast({
      title: messages[action],
      description: `Ação realizada para ${reservation.customerName}`,
    });
  };

  return (
    <>
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600"
          onClick={() => handleAction('approve')}
        >
          <Check className="w-4 h-4 mr-1" />
          Aprovar
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600"
          onClick={() => handleAction('reject')}
        >
          <X className="w-4 h-4 mr-1" />
          Rejeitar
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleAction('view')}
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