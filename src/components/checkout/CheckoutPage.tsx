import { useState } from "react"
import { Car, Calendar, User, ShoppingCart } from "lucide-react"
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
import { ProgressSteps } from "./ui/ProgressSteps"
import { EmptyCartMessage } from "./ui/EmptyCartMessage"

export const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const { toast } = useToast()
  const { state: cartState, dispatch } = useCart()

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
      <CheckoutLayout>
        <EmptyCartMessage />
      </CheckoutLayout>
    )
  }

  return (
    <CheckoutLayout>
      <CheckoutSummary />
      <ProgressSteps currentStep={step} steps={steps} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <CustomerForm onSubmit={handleCustomerSubmit} />
          )}

          {step === 2 && (
            <>
              <PickupScheduler onSubmit={handleScheduleSubmit} />
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
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

          {step === 3 && (
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <Car className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold">Reserva Confirmada!</h2>
                <p className="text-gray-600">
                  Sua reserva foi recebida com sucesso. Em breve nossa equipe entrará em contato para confirmar os detalhes.
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {step < 3 && (
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100 sticky top-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Precisa de ajuda?
              </h3>
              <p className="text-sm text-gray-600">
                Nossa equipe está disponível para te ajudar pelo WhatsApp. Clique no botão abaixo para iniciar uma conversa.
              </p>
              <Button 
                variant="outline"
                className="w-full mt-4 bg-white hover:bg-gray-50"
                onClick={() => window.open('https://wa.me/seu-numero', '_blank')}
              >
                Falar com Suporte
              </Button>
            </Card>
          )}
        </div>
      </div>
    </CheckoutLayout>
  )
}