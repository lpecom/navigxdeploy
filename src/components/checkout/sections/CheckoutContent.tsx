import { useState } from "react";
import { motion } from "framer-motion";
import { CheckoutProgress } from "./CheckoutProgress";
import { EnhancedSummary } from "./EnhancedSummary";
import { CustomerForm } from "./CustomerForm";
import { PickupScheduler } from "./PickupScheduler";
import { SuccessSection } from "./SuccessSection";
import { SupportCard } from "./SupportCard";
import { OptionalsStep } from "./steps/OptionalsStep";
import { OverviewStep } from "./steps/OverviewStep";
import { PlansStep } from "./steps/PlansStep";
import { InsurancePackageStep } from "./steps/InsurancePackageStep";

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStepComplete = () => {
    if (!isProcessing) {
      setIsProcessing(true);
      setStep(step + 1);
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (!isProcessing) {
      setStep(step - 1);
    }
  };

  const handleCustomerSubmit = async (customerData: any) => {
    try {
      setCustomerId(customerData.id);
      handleStepComplete();
      toast({
        title: "Dados salvos com sucesso!",
        description: "Seus dados foram salvos. Vamos agendar sua retirada.",
      });
    } catch (error: any) {
      console.error('Error saving customer details:', error);
      toast({
        title: "Erro ao salvar dados",
        description: error.message || "Ocorreu um erro ao salvar seus dados.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleSubmit = async (scheduleData: any) => {
    try {
      handleStepComplete();
      toast({
        title: "Agendamento confirmado!",
        description: "Seu horário foi agendado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao agendar seu horário.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <CheckoutProgress currentStep={step} />
      
      <div className={`grid gap-4 sm:gap-6 ${step === 1 ? '' : 'lg:grid-cols-3'}`}>
        <div className={step === 1 ? '' : 'lg:col-span-2'}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {step === 1 && (
              <OverviewStep onNext={handleStepComplete} />
            )}

            {step === 2 && (
              <PlansStep onSelect={handleStepComplete} />
            )}

            {step === 3 && (
              <InsurancePackageStep 
                onSelect={handleStepComplete}
                onBack={handleBack}
              />
            )}

            {step === 4 && (
              <OptionalsStep 
                onNext={handleStepComplete}
                onBack={handleBack}
              />
            )}
            
            {step === 5 && (
              <CustomerForm onSubmit={handleCustomerSubmit} />
            )}
            
            {step === 6 && (
              <PickupScheduler onSubmit={handleScheduleSubmit} />
            )}
            
            {step === 7 && (
              <SuccessSection />
            )}
          </motion.div>
        </div>

        {step > 1 && (
          <div className="space-y-4">
            <EnhancedSummary />
            {step < 7 && <SupportCard />}
          </div>
        )}
      </div>
    </motion.div>
  );
};