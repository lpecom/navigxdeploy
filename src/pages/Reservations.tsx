import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import ReservationsList from "@/components/reservations/ReservationsList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ReservationFilter } from "@/types/reservation"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { addDays, format, startOfToday } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ReservationsProps {
  filter: ReservationFilter
}

type StatusFilter = 'pending_approval' | 'approved' | 'rejected';

const Reservations = ({ filter }: ReservationsProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending_approval')
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          return
        }
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível verificar sua autenticação",
          variant: "destructive",
        })
      }
    }

    checkAuth()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const content = (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {filter === 'pending' ? (
        <>
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Aprovações</h1>
              <p className="text-gray-500">Gerencie e analise as solicitações de reserva</p>
            </div>
            <Card className="w-[200px]">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending_approval">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>
          <ReservationsList filter="pending" status={statusFilter} />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Retiradas</h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <Card className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  disabled={(date) => date < startOfToday() || date > addDays(startOfToday(), 30)}
                  className="rounded-md"
                />
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Resumo do Dia</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de Retiradas:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendentes:</span>
                    <span className="font-medium text-amber-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concluídas:</span>
                    <span className="font-medium text-green-600">9</span>
                  </div>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-8">
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="bg-white shadow-sm">
                  <TabsTrigger value="today">Hoje</TabsTrigger>
                  <TabsTrigger value="this-week">Esta Semana</TabsTrigger>
                  <TabsTrigger value="next-week">Próxima Semana</TabsTrigger>
                </TabsList>
                <TabsContent value="today" className="mt-6">
                  <ReservationsList filter="pickup" selectedDate={selectedDate} />
                </TabsContent>
                <TabsContent value="this-week" className="mt-6">
                  <ReservationsList filter="pickup" selectedDate={selectedDate} />
                </TabsContent>
                <TabsContent value="next-week" className="mt-6">
                  <ReservationsList filter="pickup" selectedDate={selectedDate} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-gray-50 min-h-screen"
    >
      {content}
    </motion.main>
  )
}

export default Reservations
