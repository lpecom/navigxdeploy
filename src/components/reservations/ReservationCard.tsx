import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Calendar, Clock, MapPin } from "lucide-react"
import { ReservationExpandedContent } from "./ReservationExpandedContent"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Reservation } from "@/types/reservation"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { memo } from "react"

interface ReservationCardProps {
  reservation: Reservation
  isExpanded: boolean
  onToggle: () => void
}

const ReservationCardComponent = ({ reservation, isExpanded, onToggle }: ReservationCardProps) => {
  const queryClient = useQueryClient()

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({ status: 'approved' })
        .eq('id', reservation.id)

      if (error) throw error

      toast.success('Reserva aprovada com sucesso')
      await queryClient.invalidateQueries({ queryKey: ['reservations'] })
      onToggle()
    } catch (error) {
      console.error('Error approving reservation:', error)
      toast.error('Erro ao aprovar reserva')
    }
  }

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({ status: 'rejected' })
        .eq('id', reservation.id)

      if (error) throw error

      toast.success('Reserva rejeitada com sucesso')
      await queryClient.invalidateQueries({ queryKey: ['reservations'] })
      onToggle()
    } catch (error) {
      console.error('Error rejecting reservation:', error)
      toast.error('Erro ao rejeitar reserva')
    }
  }

  const pickupDate = new Date(reservation.pickupDate)
  const formattedDate = format(pickupDate, "dd 'de' MMMM", { locale: ptBR })

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-medium text-gray-900 truncate">
                {reservation.customerName}
              </h3>
              <Badge variant="outline" className="text-xs">
                #{reservation.reservationNumber}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formattedDate}</span>
              </div>
              {reservation.pickupTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{reservation.pickupTime}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{reservation.address || 'Endereço não informado'}</span>
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggle}
            className="shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>

        {!isExpanded && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-primary">
                R$ {reservation.weeklyFare.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">/semana</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Rejeitar
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                className="text-xs bg-primary hover:bg-primary/90 text-white"
              >
                Aprovar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {isExpanded && (
        <ReservationExpandedContent 
          reservation={reservation} 
          currentStatus={reservation.status as 'pending_approval' | 'approved' | 'rejected'}
        />
      )}
    </Card>
  )
}

export const ReservationCard = memo(ReservationCardComponent)
