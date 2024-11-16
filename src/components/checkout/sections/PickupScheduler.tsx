import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PickupSchedulerProps {
  onSubmit: (data: { date: string; time: string }) => void;
}

export const PickupScheduler = ({ onSubmit }: PickupSchedulerProps) => {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()

  const handleSubmit = () => {
    if (date && time) {
      onSubmit({
        date: format(date, 'yyyy-MM-dd'),
        time,
      })
    }
  }

  // Generate available time slots from 8 AM to 6 PM
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minutes = i % 2 === 0 ? '00' : '30'
    return `${hour.toString().padStart(2, '0')}:${minutes}`
  })

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Agende sua Retirada</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Retirada
          </label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={ptBR}
            disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
            className="rounded-md border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário de Retirada
          </label>
          <Select onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um horário" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!date || !time}
          className="w-full"
        >
          Confirmar Agendamento
        </Button>
      </div>
    </Card>
  )
}