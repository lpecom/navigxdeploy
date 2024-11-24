import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckoutProgress } from "./CheckoutProgress";
import { EnhancedSummary } from "./EnhancedSummary";
import { CustomerForm } from "./CustomerForm";
import { PickupScheduler } from "./PickupScheduler";
import { PaymentSection } from "./PaymentSection";
import { SuccessSection } from "./SuccessSection";
import { SupportCard } from "./SupportCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OverviewStep } from "./steps/OverviewStep";
import { PlansStep } from "./steps/PlansStep";
import { InsurancePackageStep } from "./steps/InsurancePackageStep";
import { OptionalsList } from "@/components/optionals/OptionalsList";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleStepComplete = () => {
    setStep(step + 1);
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

  const handlePaymentSuccess = () => {
    handleStepComplete();
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pagamento foi processado com sucesso.",
    });
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
              <OverviewStep onNext={handleStepComplete} />
            )}

            {step === 2 && (
              <PlansStep onSelect={handleStepComplete} />
            )}

            {step === 3 && (
              <InsurancePackageStep 
                onSelect={() => handleStepComplete()}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Opcionais</h2>
                <OptionalsList />
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleStepComplete}
                    className="flex items-center gap-2"
                  >
                    Continuar
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )}
            
            {step === 5 && (
              <CustomerForm onSubmit={handleCustomerSubmit} />
            )}
            
            {step === 6 && (
              <PickupScheduler onSubmit={handleScheduleSubmit} />
            )}
            
            {step === 7 && customerId && (
              <PaymentSection
                amount={cartState.total}
                driverId={customerId}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
            
            {step === 8 && (
              <SuccessSection />
            )}
          </motion.div>
        </div>

        {step > 1 && (
          <div className="space-y-4">
            <EnhancedSummary />
            {step < 8 && <SupportCard />}
          </div>
        )}
      </div>
    </motion.div>
  );
};