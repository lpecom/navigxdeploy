import { CustomerDetails } from "../checkout/sections/CustomerDetails"
import { ReservationDetails } from "../checkout/sections/ReservationDetails"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"
import type { Reservation } from "@/types/reservation"
import { motion } from "framer-motion"

interface ReservationExpandedContentProps {
  reservation: Reservation
  onApprove: () => void
  onReject: () => void
}

export const ReservationExpandedContent = ({
  reservation,
  onApprove,
  onReject,
}: ReservationExpandedContentProps) => {
  const handleApprove = () => {
    if (window.confirm("Tem certeza que deseja aprovar esta reserva?")) {
      onApprove()
    }
  }

  const handleReject = () => {
    if (window.confirm("Tem certeza que deseja rejeitar esta reserva?")) {
      onReject()
    }
  }

  const customerData = {
    full_name: reservation.customerName,
    email: reservation.email,
    cpf: reservation.cpf,
    phone: reservation.phone,
    address: reservation.address,
  }

  const reservationData = {
    pickupDate: reservation.pickupDate,
    pickupTime: reservation.pickupTime || "",
    carCategory: reservation.carCategory,
    totalAmount: reservation.weeklyFare,
  }

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <CustomerDetails customer={customerData} />
        <ReservationDetails reservation={reservationData} />
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          onClick={handleReject}
          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Rejeitar
        </Button>
        <Button 
          onClick={handleApprove} 
          className="bg-green-600 hover:bg-green-700 text-white transition-colors"
        >
          <Check className="w-4 h-4 mr-2" />
          Aprovar
        </Button>
      </div>
    </motion.div>
  )
}