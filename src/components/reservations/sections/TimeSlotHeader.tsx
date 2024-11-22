import { Clock } from "lucide-react"
import type { Reservation } from "@/types/reservation"

interface TimeSlotHeaderProps {
  timeSlot: string
  reservations: Reservation[]
  filter: "pending" | "today" | "this-week" | "next-week"
}

export const TimeSlotHeader = ({ timeSlot, reservations, filter }: TimeSlotHeaderProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      <span>{timeSlot || 'Horário não definido'}</span>
      <span className="text-gray-400">({reservations.length} retiradas)</span>
    </div>
  )
}