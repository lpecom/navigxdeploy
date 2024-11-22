import { Clock } from "lucide-react"
import { format } from "date-fns"
import type { Reservation } from "@/types/reservation"

interface TimeSlotHeaderProps {
  timeSlot: string
  reservations: Reservation[]
  filter: "pending" | "today" | "this-week" | "next-week"
}

export const TimeSlotHeader = ({ timeSlot, reservations, filter }: TimeSlotHeaderProps) => {
  if (filter === 'pending') {
    const creationDate = format(new Date(reservations[0].createdAt), 'dd/MM/yyyy HH:mm')
    
    return (
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Criado em: {creationDate}</span>
        </div>
        <span className="text-gray-400">({reservations.length} retiradas)</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      <span>{timeSlot || 'Horário não definido'}</span>
      <span className="text-gray-400">({reservations.length} retiradas)</span>
    </div>
  )
}