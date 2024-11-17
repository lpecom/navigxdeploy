import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ReservationDetailsProps {
  reservation: {
    pickupDate: string
    pickupTime: string
    carCategory: string
    totalAmount: number
  }
}

export const ReservationDetails = ({ reservation }: ReservationDetailsProps) => {
  const pickupDate = new Date(reservation.pickupDate)
  const formattedDate = format(pickupDate, "dd 'de' MMMM", { locale: ptBR })

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Detalhes da Reserva</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            {reservation.carCategory}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {reservation.pickupTime || "Horário não definido"}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center font-medium">
            <span>Total</span>
            <span className="text-xl text-primary">
              R$ {reservation.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}