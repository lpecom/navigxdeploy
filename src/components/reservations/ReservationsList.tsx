import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Reservation, PickupFilter } from "@/types/reservation";
import { ReservationCard } from "./ReservationCard";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addWeeks } from "date-fns";

interface ReservationsListProps {
  filter: "pending" | PickupFilter;
}

const ReservationsList = ({ filter }: ReservationsListProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations', filter],
    queryFn: async () => {
      let query = supabase
        .from('driver_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('crm_status', 'pending_payment');
      } else {
        // For pickup filters, only show approved reservations
        query = query.eq('crm_status', 'approved');

        const now = new Date();
        if (filter === 'today') {
          query = query
            .gte('pickup_date', startOfDay(now).toISOString())
            .lte('pickup_date', endOfDay(now).toISOString());
        } else if (filter === 'this-week') {
          query = query
            .gte('pickup_date', startOfWeek(now, { weekStartsOn: 1 }).toISOString())
            .lte('pickup_date', endOfWeek(now, { weekStartsOn: 1 }).toISOString());
        } else if (filter === 'next-week') {
          const nextWeekStart = startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
          const nextWeekEnd = endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
          query = query
            .gte('pickup_date', nextWeekStart.toISOString())
            .lte('pickup_date', nextWeekEnd.toISOString());
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((lead): Reservation => ({
        id: lead.id,
        customerName: lead.full_name,
        email: lead.email,
        cpf: lead.cpf,
        phone: lead.phone,
        address: "",
        pickupDate: new Date().toISOString(),
        status: "pending",
        paymentStatus: "pending",
        customerStatus: "new",
        riskScore: 25,
        documentsSubmitted: false,
        createdAt: lead.created_at,
        carCategory: "Economy",
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
    return <div className="text-center py-8">Carregando reservas...</div>;
  }

  if (!reservations?.length) {
    return <div className="text-center py-8 text-muted-foreground">Nenhuma reserva encontrada.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reservations.map((reservation) => (
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