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
import { CalendarDays, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const content = (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {filter === 'pending' ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Aprovações
              </h1>
              <p className="text-muted-foreground">
                Gerencie e analise as solicitações de reserva
              </p>
            </div>
            <Card className="w-full md:w-[200px] shadow-sm">
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
          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Retiradas
            </h1>
            <p className="text-muted-foreground">
              Acompanhe e gerencie as retiradas de veículos
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <Card className="p-6 shadow-sm backdrop-blur-xl bg-white/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <CalendarDays className="w-5 h-5" />
                  <h3 className="font-semibold">Calendário</h3>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  disabled={(date) => date < startOfToday() || date > addDays(startOfToday(), 30)}
                  className="rounded-md"
                />
              </Card>
              
              <Card className="p-6 shadow-sm backdrop-blur-xl bg-white/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-semibold">Resumo do Dia</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm">Total de Retiradas</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm">Pendentes</span>
                    </div>
                    <span className="font-medium text-amber-600">3</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50/50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Concluídas</span>
                    </div>
                    <span className="font-medium text-green-600">9</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-8">
              <Card className="shadow-sm backdrop-blur-xl bg-white/50 dark:bg-gray-800/50">
                <Tabs defaultValue="today" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
                    <TabsTrigger 
                      value="today" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Hoje
                    </TabsTrigger>
                    <TabsTrigger 
                      value="this-week"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Esta Semana
                    </TabsTrigger>
                    <TabsTrigger 
                      value="next-week"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Próxima Semana
                    </TabsTrigger>
                  </TabsList>
                  <div className="p-6">
                    <TabsContent value="today" className="m-0">
                      <ReservationsList filter="today" selectedDate={selectedDate} />
                    </TabsContent>
                    <TabsContent value="this-week" className="m-0">
                      <ReservationsList filter="this-week" selectedDate={selectedDate} />
                    </TabsContent>
                    <TabsContent value="next-week" className="m-0">
                      <ReservationsList filter="next-week" selectedDate={selectedDate} />
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
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
      className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
    >
      {content}
    </motion.main>
  )
}

export default Reservations