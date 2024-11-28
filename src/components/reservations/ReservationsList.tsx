import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReservationCard } from "./ReservationCard";
import { RiskAnalysisDialog } from "./RiskAnalysisDialog";
import { DetailedReservationView } from "./DetailedReservationView";
import type { Reservation } from "@/types/reservation";

interface ReservationsListProps {
  filter?: string;
  status?: string;
  selectedDate?: Date;
}

export const ReservationsList = ({ filter = 'all', status, selectedDate }: ReservationsListProps) => {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);
  const [selectedReservationForRisk, setSelectedReservationForRisk] = useState<Reservation | null>(null);

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations', filter, status, selectedDate],
    queryFn: async () => {
      const query = supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(
            id,
            full_name,
            email,
            phone
          )
        `);

      if (filter === 'pending') {
        query.eq('status', status || 'pending_approval');
      } else if (filter === 'pickup') {
        query.eq('status', 'confirmed');
      }

      const { data, error } = await query;
      
      if (error) throw error;

      return data.map(session => ({
        id: session.id,
        driver_id: session.driver_id,
        status: session.status,
        created_at: session.created_at,
        updated_at: session.updated_at,
        pickup_date: session.pickup_date,
        pickup_time: session.pickup_time,
        total_amount: session.total_amount,
        selected_car: session.selected_car,
        selected_optionals: session.selected_optionals,
        driver: session.driver,
        reservation_number: session.reservation_number,
        optionals: session.selected_optionals || [],
        weeklyFare: session.total_amount,
        kilometersPerWeek: 'limited',
        paymentStatus: 'pending',
        riskScore: 50,
        documentsSubmitted: false,
        planType: session.selected_car?.plan_type
      })) as Reservation[];
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

  const handleRiskAnalysis = (reservation: Reservation) => {
    setSelectedReservationForRisk(reservation);
    setShowRiskAnalysis(true);
  };

  return (
    <div className="space-y-4">
      {reservations?.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onRiskAnalysis={() => handleRiskAnalysis(reservation)}
        />
      ))}

      {selectedReservation && (
        <DetailedReservationView
          reservationId={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}

      {selectedReservationForRisk && (
        <RiskAnalysisDialog
          open={showRiskAnalysis}
          onOpenChange={setShowRiskAnalysis}
          reservation={selectedReservationForRisk}
          onApprove={() => {
            setShowRiskAnalysis(false);
          }}
          onReject={() => {
            setShowRiskAnalysis(false);
          }}
        />
      )}
    </div>
  );
};