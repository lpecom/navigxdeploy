import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CheckoutLayout } from "./ui/CheckoutLayout"
import { EmptyCartMessage } from "./ui/EmptyCartMessage"
import { motion } from "framer-motion"
import { CheckoutProgress } from "./sections/CheckoutProgress"
import { EnhancedSummary } from "./sections/EnhancedSummary"
import { CheckoutSteps } from "./sections/CheckoutSteps"
import { SupportCard } from "./sections/SupportCard"
import { createCheckoutSession } from "./CheckoutSessionHandler"

export const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()
  const { state: cartState, dispatch } = useCart()

  const handleLoginSuccess = async (userId: string) => {
    try {
      const { data: driverData, error } = await supabase
        .from('driver_details')
        .select('*')
        .eq('auth_user_id', userId)
        .single()

      if (error) throw error

      setCustomerId(driverData.id)
      setIsLoggedIn(true)
      setStep(2)

      toast({
        title: "Login realizado com sucesso!",
        description: "Vamos agendar sua retirada.",
      })
    } catch (error: any) {
      console.error('Error fetching driver details:', error)
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao carregar seus dados. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCustomerSubmit = async (customerData: any) => {
    try {
      const session = await createCheckoutSession({
        driverId: customerData.id,
        cartItems: cartState.items,
        totalAmount: cartState.total,
        onSuccess: (sessionId) => {
          dispatch({ type: 'SET_CHECKOUT_SESSION', payload: sessionId })
        }
      })

      setCustomerId(customerData.id)
      setStep(2)
      
      toast({
        title: "Dados salvos com sucesso!",
        description: "Seus dados foram salvos. Vamos agendar sua retirada.",
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
        title: "Agendamento confirmado!",
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

  const handlePaymentSuccess = (paymentId: string) => {
    setStep(4)
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pagamento foi processado com sucesso.",
    })
  }

  if (cartState.items.length === 0) {
    return (
      <CheckoutLayout>
        <EmptyCartMessage />
      </CheckoutLayout>
    )
  }

  return (
    <CheckoutLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <CheckoutProgress currentStep={step} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CheckoutSteps
              step={step}
              isLoggedIn={isLoggedIn}
              customerId={customerId}
              checkoutSessionId={cartState.checkoutSessionId}
              onLoginSuccess={handleLoginSuccess}
              onCustomerSubmit={handleCustomerSubmit}
              onScheduleSubmit={handleScheduleSubmit}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>

          <div className="space-y-6">
            <EnhancedSummary />
            {step < 4 && <SupportCard />}
          </div>
        </div>
      </motion.div>
    </CheckoutLayout>
  )
}