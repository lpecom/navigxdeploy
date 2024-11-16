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
import { OptionalsList } from "@/components/optionals/OptionalsList"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { handleCustomerData } from "./handlers/CustomerHandler"
import { createDriverDetails } from "./handlers/DriverHandler"
import { createCheckoutSession } from "./CheckoutSessionHandler"
import { supabase } from "@/integrations/supabase/client"
import { Separator } from "@/components/ui/separator"

export const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const { toast } = useToast()
  const { state: cartState, dispatch } = useCart()
  const navigate = useNavigate()

  const steps = [
    { number: 1, title: "Seus Dados", icon: User },
    { number: 2, title: "Agendamento", icon: Calendar },
    { number: 3, title: "Confirmação", icon: ShoppingCart }
  ]

  const handleCustomerSubmit = async (customerData: any) => {
    try {
      const customer = await handleCustomerData(customerData)
      const driverData = await createDriverDetails(customer)

      const session = await createCheckoutSession({
        driverId: driverData.id,
        cartItems: cartState.items,
        totalAmount: cartState.total,
        onSuccess: (sessionId) => {
          dispatch({ type: 'SET_CHECKOUT_SESSION', payload: sessionId })
        }
      })

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
      if (!cartState.checkoutSessionId) {
        throw new Error('No checkout session found')
      }

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione itens ao seu carrinho para continuar com a reserva.</p>
            <Button onClick={() => navigate('/')} className="hover:scale-105 transition-transform">
              Voltar para a página inicial
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Steps currentStep={step} steps={steps} />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {step === 1 && (
              <>
                <CustomerForm onSubmit={handleCustomerSubmit} />
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Opcionais Disponíveis</h3>
                  <OptionalsList />
                </Card>
              </>
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
                    className="mt-4 hover:scale-105 transition-transform"
                  >
                    Voltar para a página inicial
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CheckoutSummary />
            {step < 3 && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-700">
                  Precisa de ajuda? Entre em contato com nosso suporte pelo WhatsApp
                </p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}