import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react"
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
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{reservation.customerName}</h3>
              <span className="text-xs text-muted-foreground">#{reservation.reservationNumber}</span>
            </div>
            <p className="text-xs text-muted-foreground">{reservation.email}</p>
            <p className="text-xs text-muted-foreground">CPF: {reservation.cpf}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggle}
            className="hover:bg-gray-100"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {reservation.carCategory}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {formattedDate}
          </Badge>
          {reservation.pickupTime && (
            <Badge variant="outline" className="text-xs">
              {reservation.pickupTime}
            </Badge>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <div className="text-xs">
            Total: <span className="font-medium text-primary">R$ {reservation.weeklyFare.toFixed(2)}</span>
          </div>
          {!isExpanded && (
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
          )}
        </div>
      </CardContent>
      {isExpanded && (
        <ReservationExpandedContent 
          reservation={reservation} 
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </Card>
  )
}

export const ReservationCard = memo(ReservationCardComponent)