import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutLayout } from "./ui/CheckoutLayout";
import { EmptyCartMessage } from "./ui/EmptyCartMessage";
import { CheckoutSteps } from "./sections/CheckoutSteps";
import { useCheckoutState } from "./sections/CheckoutContainer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartState } = useCheckoutState();

  const handleInsuranceSelect = async (insuranceId: string) => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({ insurance_option_id: insuranceId })
        .eq('id', cartState.checkoutSessionId);

      if (error) throw error;
      setStep(2);
    } catch (error) {
      console.error('Error selecting insurance:', error);
      toast({
        title: "Erro ao selecionar seguro",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleSubmit = async (scheduleData: any) => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({
          pickup_date: scheduleData.date,
          pickup_time: scheduleData.time,
        })
        .eq('id', cartState.checkoutSessionId);

      if (error) throw error;
      setStep(3);
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Erro ao agendar",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentLocationSelect = async (location: 'online' | 'store') => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({ payment_location: location })
        .eq('id', cartState.checkoutSessionId);

      if (error) throw error;
      setStep(5);
    } catch (error) {
      console.error('Error selecting payment location:', error);
      toast({
        title: "Erro ao selecionar local de pagamento",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    toast({
      title: "Pagamento confirmado!",
      description: "Sua reserva foi confirmada com sucesso.",
    });
    navigate('/driver/dashboard');
  };

  const handleKYCSubmit = (data: any) => {
    toast({
      title: "Cadastro realizado!",
      description: "Sua reserva foi confirmada. Você receberá um email para definir sua senha.",
    });
    navigate('/driver/dashboard');
  };

  if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
    return (
      <CheckoutLayout>
        <EmptyCartMessage />
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout>
      <div className="container max-w-4xl mx-auto">
        <CheckoutSteps
          step={step}
          checkoutSessionId={cartState.checkoutSessionId}
          onInsuranceSelect={handleInsuranceSelect}
          onScheduleSubmit={handleScheduleSubmit}
          onPaymentLocationSelect={handlePaymentLocationSelect}
          onPaymentSuccess={handlePaymentSuccess}
          onKYCSubmit={handleKYCSubmit}
        />
      </div>
    </CheckoutLayout>
  );
};