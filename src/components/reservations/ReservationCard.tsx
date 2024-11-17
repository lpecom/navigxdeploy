import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Car, Calendar, Clock, Phone, Mail, FileText } from "lucide-react"
import { ReservationExpandedContent } from "./ReservationExpandedContent"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Reservation } from "@/types/reservation"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"

interface ReservationCardProps {
  reservation: Reservation
  isExpanded: boolean
  onToggle: () => void
}

export const ReservationCard = ({ reservation, isExpanded, onToggle }: ReservationCardProps) => {
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
  const formattedTime = reservation.pickupTime || "Horário não definido"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{reservation.customerName}</h3>
                <p className="text-sm text-muted-foreground">Reserva #{reservation.reservationNumber}</p>
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

            <div className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  {reservation.carCategory}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formattedTime}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {reservation.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {reservation.email}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  CPF: {reservation.cpf}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm font-medium">
                  Total: <span className="text-primary">R$ {reservation.weeklyFare.toFixed(2)}</span>
                </div>
                {!isExpanded && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReject}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Aprovar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isExpanded && (
            <ReservationExpandedContent 
              reservation={reservation} 
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}