import { motion } from "framer-motion"
import { CheckoutProgress } from "./CheckoutProgress"
import { EnhancedSummary } from "./EnhancedSummary"
import { CustomerForm } from "./CustomerForm"
import { PickupScheduler } from "./PickupScheduler"
import { PaymentSection } from "./PaymentSection"
import { SuccessSection } from "./SuccessSection"
import { SupportCard } from "./SupportCard"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PlanSelectionStep } from "./steps/PlanSelectionStep"
import { InsurancePackageStep } from "./steps/InsurancePackageStep"
import { OptionalsList } from "@/components/optionals/OptionalsList"
import { Card } from "@/components/ui/card"

interface CheckoutContentProps {
  step: number;
  customerId: string | null;
  cartState: any;
  dispatch: any;
  toast: any;
  setStep: (step: number) => void;
  setCustomerId: (id: string | null) => void;
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
      setCustomerId(customerData.id)
      setStep(5)
      toast({
        title: "Dados salvos com sucesso!",
        description: "Seus dados foram salvos. Vamos agendar sua retirada.",
      })
    } catch (error: any) {
      console.error('Error saving customer details:', error)
      toast({
        title: "Erro ao salvar dados",
        description: error.message || "Ocorreu um erro ao salvar seus dados.",
        variant: "destructive",
      })
    }
  }

  const handleScheduleSubmit = async (scheduleData: any) => {
    try {
      setStep(6)
      toast({
        title: "Agendamento confirmado!",
        description: "Seu horário foi agendado com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao agendar seu horário.",
        variant: "destructive",
      })
    }
  }

  const handlePaymentSuccess = () => {
    setStep(7)
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pagamento foi processado com sucesso.",
    })
  }

  // Function to determine if side cards should be shown
  const shouldShowSideCards = (currentStep: number) => {
    // Hide cards for step 2 (insurance step)
    return currentStep !== 2;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {step > 1 && (
        <Button
          variant="ghost"
          onClick={() => setStep(step - 1)}
          className="flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
      )}

      <CheckoutProgress currentStep={step} />
      
      <div className={`grid gap-4 ${step === 1 ? '' : 'lg:grid-cols-3'}`}>
        <div className={step === 1 ? '' : 'lg:col-span-2'}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <PlanSelectionStep 
                onNext={() => {
                  setStep(2)
                  toast({
                    title: "Plano selecionado!",
                    description: "Agora vamos escolher sua proteção.",
                  })
                }}
              />
            )}

            {step === 2 && (
              <InsurancePackageStep 
                onSelect={(insuranceId) => {
                  setStep(3)
                  toast({
                    title: "Proteção selecionada!",
                    description: "Agora vamos escolher seus opcionais.",
                  })
                }}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h2 className="text-xl font-semibold mb-4 text-white">Escolha seus opcionais</h2>
                <OptionalsList />
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={() => setStep(4)} 
                    className="bg-primary hover:bg-primary/90 text-white gap-1.5"
                  >
                    Continuar
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )}
            
            {step === 4 && (
              <CustomerForm onSubmit={handleCustomerSubmit} />
            )}
            
            {step === 5 && (
              <PickupScheduler onSubmit={handleScheduleSubmit} />
            )}
            
            {step === 6 && customerId && (
              <PaymentSection
                amount={cartState.total}
                driverId={customerId}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
            
            {step === 7 && (
              <SuccessSection />
            )}
          </motion.div>
        </div>

        {step > 1 && shouldShowSideCards(step) && (
          <div className="space-y-4">
            <EnhancedSummary />
            {step < 7 && <SupportCard />}
          </div>
        )}
      </div>
    </motion.div>
  );
};
