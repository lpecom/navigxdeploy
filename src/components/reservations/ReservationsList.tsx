import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReservationCard } from "./ReservationCard";
import { RiskAnalysisDialog } from "./RiskAnalysisDialog";
import { DetailedReservationView } from "./DetailedReservationView";
import type { Reservation } from "@/types/reservation";

interface ReservationsListProps {
  filter?: string;
}

export const ReservationsList = ({ filter = 'all' }: ReservationsListProps) => {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations', filter],
    queryFn: async () => {
      const query = supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(
            full_name,
            email,
            phone
          )
        `);

      if (filter === 'pending') {
        query.eq('status', 'pending');
      } else if (filter === 'pickup') {
        query.eq('status', 'confirmed');
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Reservation[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations?.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onSelect={() => setSelectedReservation(reservation.id)}
          onRiskAnalysis={() => setShowRiskAnalysis(true)}
        />
      ))}

      {selectedReservation && (
        <DetailedReservationView
          reservationId={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}

      <RiskAnalysisDialog
        open={showRiskAnalysis}
        onOpenChange={setShowRiskAnalysis}
      />
    </div>
  );
};