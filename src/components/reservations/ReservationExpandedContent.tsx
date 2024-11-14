import { CustomerInfo } from "./CustomerInfo";
import { PricingInfo } from "./PricingInfo";
import { ReservationActions } from "./ReservationActions";
import { StreetView } from "./StreetView";
import { Facebook, MessageCircle } from "lucide-react";
import type { Reservation } from "@/types/reservation";

interface ReservationExpandedContentProps {
  reservation: Reservation;
}

export const ReservationExpandedContent = ({ reservation }: ReservationExpandedContentProps) => {
  const getLeadSourceIcon = (source: Reservation["leadSource"]) => {
    return source === "facebook" ? (
      <Facebook className="w-4 h-4 text-blue-600" />
    ) : (
      <MessageCircle className="w-4 h-4 text-green-600" />
    );
  };

  return (
    <div className="space-y-4 animate-accordion-down">
      <CustomerInfo reservation={reservation} />
      <StreetView address={reservation.address} />
      <PricingInfo reservation={reservation} />
      <div className="flex items-center justify-end">
        {getLeadSourceIcon(reservation.leadSource)}
      </div>
      <ReservationActions reservation={reservation} />
    </div>
  );
};