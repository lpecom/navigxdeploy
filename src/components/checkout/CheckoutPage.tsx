import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CheckoutLayout } from "./ui/CheckoutLayout"
import { EmptyCartMessage } from "./ui/EmptyCartMessage"
import { motion } from "framer-motion"
import { CheckoutProgress } from "./sections/CheckoutProgress"
import { EnhancedSummary } from "./sections/EnhancedSummary"
import { CustomerForm } from "./sections/CustomerForm"
import { PickupScheduler } from "./sections/PickupScheduler"
import { PaymentSection } from "./sections/PaymentSection"
import { SuccessSection } from "./sections/SuccessSection"
import { SupportCard } from "./sections/SupportCard"
import { createCheckoutSession } from "./CheckoutSessionHandler"
import { useNavigate } from "react-router-dom"
import { useSession } from "@supabase/auth-helpers-react"

export const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const { toast } = useToast()
  const { state: cartState, dispatch } = useCart()
  const session = useSession()
  const navigate = useNavigate()

  // Check for existing session and driver details
  useEffect(() => {
    const checkSession = async () => {
      if (session?.user) {
        try {
          const { data: driverDetails, error } = await supabase
            .from('driver_details')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single()

          if (error) throw error

          if (driverDetails) {
            setCustomerId(driverDetails.id)
            // Create checkout session for logged-in user
            if (cartState.items.length > 0 && !cartState.checkoutSessionId) {
              await createCheckoutSession({
                driverId: driverDetails.id,
                cartItems: cartState.items,
                totalAmount: cartState.total,
                onSuccess: (sessionId) => {
                  dispatch({ type: 'SET_CHECKOUT_SESSION', payload: sessionId })
                }
              })
            }
            setStep(2)
          }
        } catch (error) {
          console.error('Error fetching driver details:', error)
        }
      }
    }

    checkSession()
  }, [session, cartState.items, cartState.total, cartState.checkoutSessionId, dispatch])

  // Prevent empty cart access
  useEffect(() => {
    if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de prosseguir.",
        variant: "destructive",
      })
      navigate('/plans')
    }
  }, [cartState.items.length, cartState.checkoutSessionId, toast, navigate])

  const handleCustomerSubmit = async (customerData: any) => {
    try {
      if (cartState.items.length === 0) {
        toast({
          title: "Carrinho vazio",
          description: "Adicione itens ao carrinho antes de prosseguir.",
          variant: "destructive",
        })
        return
      }

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

  // Only show empty cart message if there are no items and user hasn't started checkout
  if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
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
            {step === 1 && (
              <CustomerForm onSubmit={handleCustomerSubmit} />
            )}
            
            {step === 2 && (
              <PickupScheduler onSubmit={handleScheduleSubmit} />
            )}
            
            {step === 3 && customerId && (
              <PaymentSection
                amount={cartState.total}
                driverId={customerId}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
            
            {step === 4 && (
              <SuccessSection />
            )}
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