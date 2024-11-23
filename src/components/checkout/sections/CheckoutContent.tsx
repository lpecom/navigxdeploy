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
import { InsuranceAndOptionalsStep } from "./steps/InsuranceAndOptionalsStep"

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
      setStep(2) // Move to plan selection after customer data
      toast({
        title: "Dados salvos com sucesso!",
        description: "Seus dados foram salvos. Vamos escolher seu plano.",
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
      setStep(5)
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
    setStep(6)
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pagamento foi processado com sucesso.",
    })
  }

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
      toast({
        title: "Step completed!",
        description: "Moving to the next step...",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {step > 1 && (
        <Button
          variant="ghost"
          onClick={() => setStep(step - 1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
      )}

      <CheckoutProgress currentStep={step} />
      
      <div className={`grid grid-cols-1 ${step === 1 ? '' : 'lg:grid-cols-3'} gap-6 lg:gap-8`}>
        <div className={step === 1 ? '' : 'lg:col-span-2'}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <CustomerForm onSubmit={handleCustomerSubmit} />
            )}
            
            {step === 2 && (
              <PlanSelectionStep onNext={() => setStep(3)} />
            )}
            
            {step === 3 && (
              <InsuranceAndOptionalsStep onNext={() => setStep(4)} />
            )}
            
            {step === 4 && (
              <PickupScheduler onSubmit={handleScheduleSubmit} />
            )}
            
            {step === 5 && customerId && (
              <PaymentSection
                amount={cartState.total}
                driverId={customerId}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
            
            {step === 6 && (
              <SuccessSection />
            )}
          </motion.div>
        </div>

        {step > 1 && (
          <div className="space-y-6">
            <EnhancedSummary />
            {step < 6 && <SupportCard />}
          </div>
        )}
      </div>
    </motion.div>
  )
}
