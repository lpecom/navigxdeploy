import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { type Reservation } from "@/types/reservation";
import { useToast } from "@/components/ui/use-toast";

interface ReservationActionsProps {
  reservation: Reservation;
}

export const ReservationActions = ({ reservation }: ReservationActionsProps) => {
  const { toast } = useToast();

  const handleAction = (action: 'approve' | 'reject' | 'view') => {
    const messages = {
      approve: 'Reservation approved successfully',
      reject: 'Reservation rejected',
      view: 'Opening reservation details'
    };

    toast({
      title: messages[action],
      description: `Action performed for ${reservation.customerName}`,
    });
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 bg-green-50 hover:bg-green-100 text-green-600"
        onClick={() => handleAction('approve')}
      >
        <Check className="w-4 h-4 mr-1" />
        Approve
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600"
        onClick={() => handleAction('reject')}
      >
        <X className="w-4 h-4 mr-1" />
        Reject
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleAction('view')}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );
};