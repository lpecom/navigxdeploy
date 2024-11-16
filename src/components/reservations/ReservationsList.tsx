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

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['reservations', filter],
    queryFn: async () => {
      let query = supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(
            id,
            full_name,
            email,
            cpf,
            phone,
            address,
            city,
            state,
            postal_code
          )
        `);

      if (filter === 'pending') {
        query = query.eq('status', 'pending');
      } else {
        // For pickup filters, only show approved reservations
        query = query.eq('status', 'approved');

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

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((session): Reservation => ({
        id: session.id,
        customerName: session.driver?.full_name || 'Cliente não identificado',
        email: session.driver?.email || '',
        cpf: session.driver?.cpf || '',
        phone: session.driver?.phone || '',
        address: session.driver?.address || '',
        pickupDate: session.pickup_date || session.created_at,
        pickupTime: session.pickup_time || '',
        status: session.status === 'pending' ? 'pending' : 'approved',
        paymentStatus: 'pending',
        customerStatus: 'new',
        riskScore: 25,
        documentsSubmitted: false,
        createdAt: session.created_at,
        carCategory: session.selected_car?.category || 'Economy',
        leadSource: 'form',
        weeklyFare: session.total_amount,
        optionals: session.selected_optionals || [],
        kilometersPerWeek: 1000,
      }));
    },
  });

  if (error) {
    console.error('Error fetching reservations:', error);
    return <div className="text-center py-8 text-red-600">Erro ao carregar reservas.</div>;
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!reservations?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma reserva encontrada.
      </div>
    );
  }

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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