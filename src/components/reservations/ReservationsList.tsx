import { useState, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Reservation, PickupFilter } from "@/types/reservation"
import { ReservationCard } from "./ReservationCard"
import { supabase } from "@/integrations/supabase/client"
import { startOfWeek, endOfWeek, addWeeks, format, parseISO } from "date-fns"
import { Car, Clock, Calendar } from "lucide-react"

interface ReservationsListProps {
  filter: "pending" | PickupFilter
  status?: 'pending_approval' | 'approved' | 'rejected'
  selectedDate?: Date
}

const ReservationsList = ({ filter, status = 'pending_approval', selectedDate }: ReservationsListProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const toggleCard = useCallback((id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['reservations', filter, status, selectedDate?.toISOString()],
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
        .order('created_at', { ascending: false }) // Changed to sort by creation date, newest first

      if (filter === 'pending') {
        query = query.eq('status', status)
      } else {
        query = query.eq('status', 'approved')

        if (selectedDate) {
          const dateStr = format(selectedDate, 'yyyy-MM-dd')
          query = query.eq('pickup_date', dateStr)
        } else {
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

  const sortedReservations = useMemo(() => {
    if (!reservations) return []
    return [...reservations].sort((a, b) => {
      // Sort by creation date first (newest first)
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      if (dateA !== dateB) return dateB - dateA
      
      // If same creation date, sort by pickup time
      if (!a.pickupTime || !b.pickupTime) return 0
      return a.pickupTime.localeCompare(b.pickupTime)
    })
  }, [reservations])

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

    if (!sortedReservations?.length) {
      return (
        <div className="text-center py-12">
          <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            Nenhuma reserva encontrada
          </p>
        </div>
      )
    }

    const timeSlots = Array.from(new Set(sortedReservations.map(r => r.pickupTime))).sort()

    return (
      <div className="space-y-8">
        {timeSlots.map(timeSlot => {
          const slotReservations = sortedReservations.filter(r => r.pickupTime === timeSlot)
          
          return (
            <div key={timeSlot} className="space-y-4">
              {filter === 'pending' ? (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Agendado para: {format(parseISO(slotReservations[0].pickupDate), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{timeSlot || 'Horário não definido'}</span>
                  </div>
                  <span className="text-gray-400">({slotReservations.length} retiradas)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{timeSlot || 'Horário não definido'}</span>
                  <span className="text-gray-400">({slotReservations.length} retiradas)</span>
                </div>
              )}
              <div className="grid gap-4">
                {slotReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    isExpanded={!!expandedCards[reservation.id]}
                    onToggle={() => toggleCard(reservation.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [sortedReservations, isLoading, error, expandedCards, toggleCard, filter])

  return (
    <div className="max-w-3xl mx-auto">
      {renderedReservations}
    </div>
  )
}

export default ReservationsList
