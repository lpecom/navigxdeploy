import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/dashboard/Sidebar";

interface Appointment {
  id: string;
  title: string;
  customerName: string;
  time: string;
  type: "pickup" | "return";
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("week");

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i;
    return `${hour}:00`;
  });

  const weekDays = Array.from({ length: 6 }, (_, i) => {
    return addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i);
  });

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: "1",
      title: "Honda Civic",
      customerName: "João Silva",
      time: "10:00",
      type: "pickup",
    },
    {
      id: "2",
      title: "Toyota Corolla",
      customerName: "Maria Santos",
      time: "14:00",
      type: "return",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="px-6 py-4 bg-white border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold">Calendário</h1>
                <Button variant="outline" size="sm">
                  Hoje
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
              <Tabs defaultValue="all" className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="pickup">Retiradas</TabsTrigger>
                  <TabsTrigger value="return">Devoluções</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </header>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-[auto,1fr] h-full">
              {/* Time Labels */}
              <div className="w-20 border-r bg-white">
                <div className="h-14 border-b" /> {/* Header spacer */}
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-20 border-b px-4 py-2 text-xs text-gray-500"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-6 flex-1">
                {/* Days Header */}
                <div className="col-span-full grid grid-cols-6 border-b">
                  {weekDays.map((date) => (
                    <div
                      key={date.toString()}
                      className="h-14 border-r px-4 py-2 bg-white"
                    >
                      <div className="text-sm font-medium">
                        {format(date, "EEE", { locale: ptBR })}
                      </div>
                      <div className="text-2xl font-semibold">
                        {format(date, "d")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Grid */}
                {weekDays.map((date) => (
                  <div key={date.toString()} className="border-r">
                    {timeSlots.map((time) => (
                      <div
                        key={`${date}-${time}`}
                        className="h-20 border-b relative group"
                      >
                        {appointments.map((apt) => (
                          <Card
                            key={apt.id}
                            className={`absolute inset-x-2 h-16 p-2 cursor-pointer transition-all hover:shadow-md ${
                              apt.type === "pickup"
                                ? "bg-blue-50 border-blue-200"
                                : "bg-pink-50 border-pink-200"
                            }`}
                            style={{
                              top: "4px",
                            }}
                          >
                            <div className="flex flex-col h-full">
                              <div className="text-sm font-medium truncate">
                                {apt.title}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="h-6 w-6">
                                  <div className="bg-gray-100 h-full w-full flex items-center justify-center text-xs font-medium">
                                    {apt.customerName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                </Avatar>
                                <span className="text-xs text-gray-600 truncate">
                                  {apt.customerName}
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;