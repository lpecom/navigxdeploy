import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Reservation } from "@/types/reservation";
import { ReservationCard } from "./ReservationCard";
import { supabase } from "@/integrations/supabase/client";

interface ReservationsListProps {
  filter?: "pending" | "approved" | "rejected";
}

const ReservationsList = ({ filter }: ReservationsListProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const { data: recentLeads, isLoading } = useQuery({
    queryKey: ['recent-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform driver details into reservation format
      return data.map((lead): Reservation => ({
        id: lead.id,
        customerName: lead.full_name,
        email: lead.email,
        cpf: lead.cpf,
        phone: lead.phone,
        address: "", // Not stored in driver_details
        pickupDate: new Date().toISOString(), // Default to current date
        status: "pending",
        paymentStatus: "pending",
        customerStatus: "new",
        riskScore: 25, // Default value
        documentsSubmitted: false,
        createdAt: lead.created_at,
        carCategory: "Economy", // Default value
        leadSource: "form",
        weeklyFare: 0,
        optionals: [],
        kilometersPerWeek: 1000,
      }));
    },
  });

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading recent leads...</div>;
  }

  const filteredReservations = filter && recentLeads
    ? recentLeads.filter((r) => r.status === filter)
    : recentLeads;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredReservations?.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          isExpanded={!!expandedCards[reservation.id]}
          onToggle={() => toggleCard(reservation.id)}
        />
      ))}
    </div>
  );
};

export default ReservationsList;