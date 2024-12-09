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
            className="rounded-md border-0 mx-auto text-white bg-transparent"
            classNames={{
              months: "space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:flex-row",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-white mb-4",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "p-1 hover:bg-gray-700/50 rounded-md transition-colors duration-200",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem] mb-2",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-800/50 [&:has([aria-selected])]:bg-gray-800/50",
              day: "h-9 w-9 p-0 font-normal rounded-md transition-colors duration-200 hover:bg-gray-700/50 focus:bg-gray-700/50 aria-selected:opacity-100",
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-gray-800/80 text-white",
              day_outside: "text-gray-500 opacity-50 aria-selected:bg-gray-800/50 aria-selected:text-gray-400 aria-selected:opacity-30",
              day_disabled: "text-gray-500 opacity-50",
              day_hidden: "invisible",
            }}
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
            <SelectTrigger className="w-full text-gray-200 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
              <SelectValue placeholder="Selecione um horário">
                {time ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{time}</span>
                  </div>
                ) : (
                  "Selecione um horário"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[200px] bg-gray-800 border-gray-700">
              {timeSlots.map((slot) => (
                <SelectItem 
                  key={slot} 
                  value={slot} 
                  className="text-gray-200 focus:bg-gray-700 focus:text-white hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{slot}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleSubmit}
            disabled={!date || !time}
            className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            Confirmar Agendamento
          </Button>
        </div>
      </Card>
    </div>
  )
}