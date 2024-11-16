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
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(*)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('status', 'pending');
      } else {
        // For pickup filters, only show approved reservations
        query = query.eq('status', 'approved');

        const now = new Date();
        if (filter === 'today') {
          query = query
            .gte('created_at', startOfDay(now).toISOString())
            .lte('created_at', endOfDay(now).toISOString());
        } else if (filter === 'this-week') {
          query = query
            .gte('created_at', startOfWeek(now, { weekStartsOn: 1 }).toISOString())
            .lte('created_at', endOfWeek(now, { weekStartsOn: 1 }).toISOString());
        } else if (filter === 'next-week') {
          const nextWeekStart = startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
          const nextWeekEnd = endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
          query = query
            .gte('created_at', nextWeekStart.toISOString())
            .lte('created_at', nextWeekEnd.toISOString());
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((session): Reservation => ({
        id: session.id,
        customerName: session.driver?.full_name || '',
        email: session.driver?.email || '',
        cpf: session.driver?.cpf || '',
        phone: session.driver?.phone || '',
        address: '',
        pickupDate: session.created_at,
        status: session.status === 'pending' ? 'pending' : 'approved',
        paymentStatus: 'pending',
        customerStatus: 'new',
        riskScore: 25,
        documentsSubmitted: false,
        createdAt: session.created_at,
        carCategory: (session.selected_car as any)?.category || 'Economy',
        leadSource: 'form',
        weeklyFare: session.total_amount,
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