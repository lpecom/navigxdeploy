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
import { Clock } from "lucide-react"

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
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 18;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes of ['00', '30']) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minutes}`);
      }
    }
    return slots;
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      <Card className="p-6 animate-fade-in bg-gray-900/50 border-gray-800">
        <h2 className="text-xl font-semibold mb-6 text-white">Selecione a Data</h2>
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={ptBR}
            disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
            className="rounded-md border mx-auto text-white"
          />
        </div>
      </Card>

      <Card className="p-6 animate-fade-in bg-gray-900/50 border-gray-800">
        <h2 className="text-xl font-semibold mb-6 text-white">Selecione o Horário</h2>
        <div className="space-y-4">
          <Select 
            value={time} 
            onValueChange={setTime}
          >
            <SelectTrigger className="w-full text-gray-200 bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Selecione um horário">
                {time ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{time}</span>
                  </div>
                ) : (
                  "Selecione um horário"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[200px] bg-gray-800 border-gray-700">
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot} className="text-gray-200 focus:bg-gray-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{slot}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleSubmit}
            disabled={!date || !time}
            className="w-full"
          >
            Confirmar Agendamento
          </Button>
        </div>
      </Card>
    </div>
  )
}