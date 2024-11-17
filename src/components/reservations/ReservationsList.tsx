import { useState, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Reservation, PickupFilter } from "@/types/reservation"
import { ReservationCard } from "./ReservationCard"
import { supabase } from "@/integrations/supabase/client"
import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns"
import { Car } from "lucide-react"

interface ReservationsListProps {
  filter: "pending" | PickupFilter
}

const ReservationsList = ({ filter }: ReservationsListProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const toggleCard = useCallback((id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

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

  const renderedReservations = useMemo(() => {
    if (error) {
      console.error('Error fetching reservations:', error)
      return (
        <div className="text-center py-8 text-gray-500">
          Ocorreu um erro ao carregar as reservas.
        </div>
      )
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
        <div className="text-center py-12">
          <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            Nenhuma reserva encontrada
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
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
  }, [reservations, isLoading, error, expandedCards, toggleCard])

  return (
    <div className="max-w-3xl mx-auto">
      {renderedReservations}
    </div>
  )
}

export default ReservationsList