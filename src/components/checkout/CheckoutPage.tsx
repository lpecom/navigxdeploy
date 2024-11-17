import { useState } from "react"
import { User, Calendar, CreditCard, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { CustomerForm } from "./sections/CustomerForm"
import { PickupScheduler } from "./sections/PickupScheduler"
import { CheckoutSummary } from "./sections/CheckoutSummary"
import { OptionalsList } from "@/components/optionals/OptionalsList"
import { Card } from "@/components/ui/card"
import { handleCustomerData } from "./handlers/CustomerHandler"
import { createDriverDetails } from "./handlers/DriverHandler"
import { createCheckoutSession } from "./CheckoutSessionHandler"
import { supabase } from "@/integrations/supabase/client"
import { CheckoutLayout } from "./ui/CheckoutLayout"
import { EmptyCartMessage } from "./ui/EmptyCartMessage"
import { PaymentSection } from "./sections/PaymentSection"
import { motion } from "framer-motion"
import { Steps } from "./Steps"
import { SupportCard } from "./sections/SupportCard"

export const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit")
  const { toast } = useToast()
  const { state: cartState, dispatch } = useCart()

  const steps = [
    { number: 1, title: "Seus Dados", icon: User },
    { number: 2, title: "Agendamento", icon: Calendar },
    { number: 3, title: "Pagamento", icon: CreditCard },
    { number: 4, title: "Confirmação", icon: ShoppingCart }
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
        className="space-y-6"
      >
        <Steps currentStep={step} steps={steps} />
        
        <div className="mb-6">
          <CheckoutSummary />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {step === 1 && (
              <CustomerForm onSubmit={handleCustomerSubmit} />
            )}

            {step === 2 && (
              <>
                <PickupScheduler onSubmit={handleScheduleSubmit} />
                <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Opcionais Disponíveis
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Aproveite para adicionar itens que tornarão sua experiência ainda melhor:
                  </p>
                  <OptionalsList />
                </Card>
              </>
            )}

            {step === 3 && customerId && cartState.checkoutSessionId && (
              <PaymentSection
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                onPaymentSuccess={handlePaymentSuccess}
                amount={cartState.total}
                driverId={customerId}
              />
            )}

            {step === 4 && (
              <Card className="p-4 sm:p-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 text-green-500 mb-4">
                    <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Reserva Confirmada!</h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Sua reserva foi recebida com sucesso. Em breve nossa equipe entrará em contato para confirmar os detalhes.
                  </p>
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="mt-6"
                  >
                    Voltar para Home
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {step < 4 && <SupportCard />}
          </div>
        </div>
      </motion.div>
    </CheckoutLayout>
  );
};
