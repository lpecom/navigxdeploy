import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Car, Calendar, User, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/components/ui/use-toast"
import { Steps } from "./Steps"
import { CustomerForm } from "./sections/CustomerForm"
import { PickupScheduler } from "./sections/PickupScheduler"
import { CheckoutSummary } from "./sections/CheckoutSummary"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

export const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const { toast } = useToast()
  const { state: cartState } = useCart()
  const navigate = useNavigate()

  const steps = [
    { number: 1, title: "Seus Dados", icon: User },
    { number: 2, title: "Agendamento", icon: Calendar },
    { number: 3, title: "Confirmação", icon: ShoppingCart }
  ]

  const handleCustomerSubmit = async (customerData: any) => {
    try {
      const { data: customer, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single()

      if (error) throw error

      setCustomerId(customer.id)
      setStep(2)
      
      toast({
        title: "Dados salvos",
        description: "Seus dados foram salvos com sucesso.",
      })
    } catch (error: any) {
      console.error('Error saving customer details:', error)
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleScheduleSubmit = async (scheduleData: any) => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({
          pickup_date: scheduleData.date,
          pickup_time: scheduleData.time,
          status: 'pending_approval'
        })
        .eq('id', cartState.checkoutSessionId)

      if (error) throw error

      setStep(3)
      
      toast({
        title: "Agendamento confirmado",
        description: "Seu horário foi agendado com sucesso.",
      })
    } catch (error: any) {
      console.error('Error saving schedule:', error)
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao agendar seu horário. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">Adicione itens ao seu carrinho para continuar com a reserva.</p>
          <Button onClick={() => navigate('/')}>
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Steps currentStep={step} steps={steps} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {step === 1 && (
              <CustomerForm onSubmit={handleCustomerSubmit} />
            )}

            {step === 2 && (
              <PickupScheduler onSubmit={handleScheduleSubmit} />
            )}

            {step === 3 && (
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <Car className="w-8 h-8" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-semibold">Reserva Confirmada!</h2>
                  <p className="text-gray-600">
                    Sua reserva foi recebida com sucesso. Em breve nossa equipe entrará em contato para confirmar os detalhes.
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    className="mt-4"
                  >
                    Voltar para a página inicial
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>

          <div className="space-y-6">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  )
}