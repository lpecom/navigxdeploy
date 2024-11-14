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

export const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [driverId, setDriverId] = useState<string | null>(null)
  const { toast } = useToast()
  
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

  const handlePaymentSuccess = async (id: string) => {
    setPaymentId(id)
    if (!driverId) {
      try {
        const { data, error } = await supabase
          .from('driver_details')
          .insert([{
            full_name: form.getValues('fullName'),
            birth_date: form.getValues('birthDate'),
            license_number: form.getValues('licenseNumber'),
            license_expiry: form.getValues('licenseExpiry'),
            cpf: form.getValues('cpf'),
            phone: form.getValues('phone'),
            email: form.getValues('email'),
          }])
          .select()
          .single()

        if (error) throw error
        setDriverId(data.id)
        setStep(3)
      } catch (error) {
        console.error('Error saving driver details:', error)
        toast({
          title: "Erro ao salvar dados do condutor",
          description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  const steps = [
    { number: 1, title: "Seus Dados", icon: User },
    { number: 2, title: "Pagamento", icon: CreditCard },
    { number: 3, title: "Confirmação", icon: ShoppingCart }
  ]

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
                  <form className="space-y-4">
                    <DriverForm form={form} />
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
                      amount={1000}
                      driverId={driverId || ''}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}
                  {paymentMethod === "pix" && (
                    <PixPayment
                      amount={1000}
                      driverId={driverId || ''}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}
                  {paymentMethod === "boleto" && (
                    <BoletoPayment
                      amount={1000}
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