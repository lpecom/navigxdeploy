import { CustomerInfo } from "./CustomerInfo";
import { StreetView } from "./StreetView";
import { PricingInfo } from "./PricingInfo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X } from "lucide-react";
import type { Reservation } from "@/types/reservation";

interface ReservationExpandedContentProps {
  reservation: Reservation;
  onApprove: () => void;
  onReject: () => void;
}

export const ReservationExpandedContent = ({
  reservation,
  onApprove,
  onReject,
}: ReservationExpandedContentProps) => {
  const handleApprove = () => {
    if (window.confirm("Tem certeza que deseja aprovar esta reserva?")) {
      onApprove();
    }
  };

  const handleReject = () => {
    if (window.confirm("Tem certeza que deseja rejeitar esta reserva?")) {
      onReject();
    }
  };

  // Convert reservation data to customer format
  const customerData = {
    id: reservation.id,
    full_name: reservation.customerName,
    email: reservation.email,
    cpf: reservation.cpf,
    phone: reservation.phone,
    address: reservation.address,
    created_at: reservation.createdAt,
    status: 'active',
    total_rentals: 0
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informações do Cliente</h3>
          <CustomerInfo customer={customerData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Localização</h3>
          <StreetView address={reservation.address} />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detalhes do Pagamento</h3>
        <PricingInfo reservation={reservation} />
      </Card>

      <Separator className="my-6" />

      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          onClick={handleReject}
          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
        >
          <X className="w-4 h-4 mr-2" />
          Rejeitar
        </Button>
        <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
          <Check className="w-4 h-4 mr-2" />
          Aprovar
        </Button>
      </div>
    </div>
  );
};