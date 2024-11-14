import { useState } from "react"
import { Card } from "@/components/ui/card"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { CreditCardForm } from "./CreditCardForm"
import { PixPayment } from "./PixPayment"
import { BoletoPayment } from "./BoletoPayment"
import { OrderSummary } from "@/components/optionals/OrderSummary"
import { DriverForm } from "@/components/driver/DriverForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { driverSchema, type DriverFormValues } from "@/types/driver"
import { Form } from "@/components/ui/form"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Steps } from "./Steps"
import { motion } from "framer-motion"
import { ShoppingCart, CreditCard, User } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useNavigate } from "react-router-dom"

export const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [driverId, setDriverId] = useState<string | null>(null)
  const { toast } = useToast()
  const { state: cartState } = useCart()
  const navigate = useNavigate()
  
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      licenseNumber: "",
      licenseExpiry: "",
      cpf: "",
      phone: "",
      email: "",
    },
  })

  const handleDriverSubmit = async (data: DriverFormValues) => {
    try {
      const { data: driver, error } = await supabase
        .from('driver_details')
        .insert([{
          full_name: data.fullName,
          birth_date: data.birthDate,
          license_number: data.licenseNumber,
          license_expiry: data.licenseExpiry,
          cpf: data.cpf,
          phone: data.phone,
          email: data.email,
        }])
        .select()
        .single()

      if (error) throw error

      setDriverId(driver.id)
      setStep(2)
    } catch (error) {
      console.error('Error saving driver details:', error)
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handlePaymentSuccess = async (id: string) => {
    setPaymentId(id)
    try {
      // Create checkout session
      const { data: session, error: sessionError } = await supabase
        .from('checkout_sessions')
        .insert([{
          driver_id: driverId,
          selected_car: cartState.items.find(item => item.type === 'car'),
          selected_optionals: cartState.items.filter(item => item.type === 'optional'),
          total_amount: cartState.total,
          status: 'completed'
        }])
        .select()
        .single()

      if (sessionError) throw sessionError

      // Link cart items to checkout session
      const { error: cartError } = await supabase
        .from('cart_items')
        .insert(
          cartState.items.map(item => ({
            checkout_session_id: session.id,
            item_type: item.type,
            item_id: item.id,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice
          }))
        )

      if (cartError) throw cartError

      setStep(3)
    } catch (error) {
      console.error('Error finalizing checkout:', error)
      toast({
        title: "Erro ao finalizar compra",
        description: "Ocorreu um erro ao finalizar sua compra. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const steps = [
    { number: 1, title: "Seus Dados", icon: User },
    { number: 2, title: "Pagamento", icon: CreditCard },
    { number: 3, title: "Confirmação", icon: ShoppingCart }
  ]

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">Adicione itens ao seu carrinho para continuar com a compra.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            Voltar para a página inicial
          </button>
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
              <Card className="p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Informações do Condutor</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleDriverSubmit)} className="space-y-4">
                    <DriverForm form={form} />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Continuar para pagamento
                    </button>
                  </form>
                </Form>
              </Card>
            )}

            {step === 2 && (
              <>
                <Card className="p-6 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-6">Método de Pagamento</h2>
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                  />
                </Card>

                <Card className="p-6 shadow-lg">
                  {paymentMethod === "credit" && (
                    <CreditCardForm
                      amount={cartState.total}
                      driverId={driverId || ''}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}
                  {paymentMethod === "pix" && (
                    <PixPayment
                      amount={cartState.total}
                      driverId={driverId || ''}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}
                  {paymentMethod === "boleto" && (
                    <BoletoPayment
                      amount={cartState.total}
                      driverId={driverId || ''}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}
                </Card>
              </>
            )}

            {step === 3 && (
              <Card className="p-6 shadow-lg">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <ShoppingCart className="w-8 h-8" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-semibold">Pedido Confirmado!</h2>
                  <p className="text-gray-600">
                    Seu pedido foi processado com sucesso. Você receberá um email com os detalhes em breve.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 mt-4"
                  >
                    Voltar para a página inicial
                  </button>
                </div>
              </Card>
            )}
          </motion.div>

          <div className="space-y-6">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}