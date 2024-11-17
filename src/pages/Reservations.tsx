import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import ReservationsList from "@/components/reservations/ReservationsList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ReservationFilter } from "@/types/reservation"
import { motion } from "framer-motion"

interface ReservationsProps {
  filter: ReservationFilter
}

const Reservations = ({ filter }: ReservationsProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

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

  if (filter === 'pending') {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-y-auto p-6 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Reservas Pendentes</h1>
            <div className="flex gap-2">
              {/* Add any additional actions/filters here */}
            </div>
          </div>
          <ReservationsList filter="pending" />
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-6 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Retiradas</h1>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="this-week">Esta Semana</TabsTrigger>
            <TabsTrigger value="next-week">Próxima Semana</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-6">
            <ReservationsList filter="today" />
          </TabsContent>
          <TabsContent value="this-week" className="mt-6">
            <ReservationsList filter="this-week" />
          </TabsContent>
          <TabsContent value="next-week" className="mt-6">
            <ReservationsList filter="next-week" />
          </TabsContent>
        </Tabs>
      </div>
    </motion.main>
  )
}

export default Reservations