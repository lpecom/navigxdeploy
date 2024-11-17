import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Reservation, PickupFilter } from "@/types/reservation"
import { ReservationCard } from "./ReservationCard"
import { supabase } from "@/integrations/supabase/client"
import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns"

interface ReservationsListProps {
  filter: "pending" | PickupFilter
}

const ReservationsList = ({ filter }: ReservationsListProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

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
        `)
        .order('reservation_number', { ascending: false })

      if (filter === 'pending') {
        query = query.eq('status', 'pending_approval')
      } else {
        query = query.eq('status', 'approved')

        const now = new Date()
        const today = format(now, 'yyyy-MM-dd')

        if (filter === 'today') {
          query = query.eq('pickup_date', today)
        } else if (filter === 'this-week') {
          const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd')
          const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd')
          query = query
            .gte('pickup_date', weekStart)
            .lte('pickup_date', weekEnd)
        } else if (filter === 'next-week') {
          const nextWeekStart = format(startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }), 'yyyy-MM-dd')
          const nextWeekEnd = format(endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }), 'yyyy-MM-dd')
          query = query
            .gte('pickup_date', nextWeekStart)
            .lte('pickup_date', nextWeekEnd)
        }
      }

      const { data, error } = await query
      
      if (error) throw error
      
      return (data || []).map((session: any): Reservation => ({
        id: session.id,
        reservationNumber: session.reservation_number,
        customerName: session.driver?.full_name || 'Cliente não identificado',
        email: session.driver?.email || '',
        cpf: session.driver?.cpf || '',
        phone: session.driver?.phone || '',
        address: session.driver?.address || '',
        pickupDate: session.pickup_date || session.created_at,
        pickupTime: session.pickup_time || '',
        status: session.status,
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
      }))
    },
  })

  if (error) {
    console.error('Error fetching reservations:', error)
    return <div className="text-center py-8 text-red-600">Erro ao carregar reservas.</div>
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!reservations?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma reserva encontrada.
      </div>
    )
  }

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          isExpanded={!!expandedCards[reservation.id]}
          onToggle={() => toggleCard(reservation.id)}
        />
      ))}
    </div>
  )
}

export default ReservationsList