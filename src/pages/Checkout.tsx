import { useState, useCallback } from "react";
import { CustomerForm } from "@/components/checkout/sections/CustomerForm";
import { PlanDetails } from "@/components/checkout/sections/PlanDetails";
import { OptionalsList } from "@/components/optionals/OptionalsList";
import { PickupScheduler } from "@/components/checkout/sections/PickupScheduler";
import { SuccessSection } from "@/components/checkout/sections/SuccessSection";
import { Steps } from "@/components/checkout/Steps";
import { CheckoutLayout } from "@/components/checkout/ui/CheckoutLayout";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, Car, Package, Calendar, CheckCircle } from "lucide-react";

const steps = [
  { number: 1, title: "Dados Pessoais", icon: User },
  { number: 2, title: "Plano", icon: Car },
  { number: 3, title: "Opcionais", icon: Package },
  { number: 4, title: "Agendamento", icon: Calendar },
  { number: 5, title: "Confirmação", icon: CheckCircle },
];

export const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const { state: cartState, dispatch } = useCart();
  const { toast } = useToast();

  const handleCustomerSubmit = useCallback(async (data: any) => {
    try {
      const { data: customer, error } = await supabase
        .from('driver_details')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      setCustomerId(customer.id);
      setCurrentStep(2);
      
      toast({
        title: "Dados salvos com sucesso!",
        description: "Vamos escolher seu plano.",
      });
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleScheduleSubmit = useCallback(async (scheduleData: any) => {
    try {
      if (!cartState.checkoutSessionId) return;

      const { error } = await supabase
        .from('checkout_sessions')
        .update({
          pickup_date: scheduleData.date,
          pickup_time: scheduleData.time,
          status: 'scheduled'
        })
        .eq('id', cartState.checkoutSessionId);

      if (error) throw error;

      setCurrentStep(5);
      
      toast({
        title: "Agendamento confirmado!",
        description: "Sua reserva foi agendada com sucesso.",
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Erro ao agendar",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [cartState.checkoutSessionId, toast]);

  const selectedPlan = cartState?.items?.find(item => item.type === 'car_group');
  const planDetails = selectedPlan ? {
    type: selectedPlan.period || 'mensal',
    name: selectedPlan.name,
    features: [
      'Seguro completo incluso',
      'Manutenção preventiva',
      'Assistência 24h',
      'Documentação e IPVA'
    ],
    price: selectedPlan.unitPrice,
    period: 'mês'
  } : null;

  return (
    <CheckoutLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Steps steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          {currentStep === 1 && (
            <CustomerForm onSubmit={handleCustomerSubmit} />
          )}

          {currentStep === 2 && planDetails && (
            <PlanDetails 
              plan={planDetails}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <OptionalsList />
              <Button 
                onClick={() => setCurrentStep(4)}
                className="w-full"
              >
                Continuar para Agendamento
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <PickupScheduler onSubmit={handleScheduleSubmit} />
          )}

          {currentStep === 5 && (
            <SuccessSection />
          )}
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default CheckoutPage;