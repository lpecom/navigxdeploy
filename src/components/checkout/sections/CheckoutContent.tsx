import { motion } from "framer-motion"
import { CheckoutProgress } from "./CheckoutProgress"
import { EnhancedSummary } from "./EnhancedSummary"
import { CustomerForm } from "./CustomerForm"
import { PickupScheduler } from "./PickupScheduler"
import { PaymentSection } from "./PaymentSection"
import { SuccessSection } from "./SuccessSection"
import { SupportCard } from "./SupportCard"
import { createCheckoutSession } from "../CheckoutSessionHandler"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface CheckoutContentProps {
  step: number
  customerId: string | null
  cartState: any
  dispatch: any
  toast: any
  setStep: (step: number) => void
  setCustomerId: (id: string | null) => void
}

export const CheckoutContent = ({
  step,
  customerId,
  cartState,
  dispatch,
  toast,
  setStep,
  setCustomerId
}: CheckoutContentProps) => {
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

  const handlePaymentSuccess = () => {
    setStep(4)
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pagamento foi processado com sucesso.",
    })
  }

  const handleBack = () => {
    // Only allow going back if we're in step 1 (to plans) or if we haven't completed the current step
    if (step === 1) {
      window.location.href = '/plans'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {step === 1 && (
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
      )}

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
  )
}