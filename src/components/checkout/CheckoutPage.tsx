import { useState, useCallback } from "react";
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

  const handleInsuranceSelect = useCallback(async (insuranceId: string) => {
    try {
      if (!cartState.checkoutSessionId) return;

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
  }, [cartState.checkoutSessionId, toast]);

  const handleScheduleSubmit = useCallback(async (scheduleData: any) => {
    try {
      if (!cartState.checkoutSessionId) return;

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
  }, [cartState.checkoutSessionId, toast]);

  const handlePaymentLocationSelect = useCallback(async (location: 'online' | 'store') => {
    try {
      if (!cartState.checkoutSessionId) return;

      const { error } = await supabase
        .from('checkout_sessions')
        .update({ payment_location: location })
        .eq('id', cartState.checkoutSessionId);

      if (error) throw error;
      setStep(4);
    } catch (error) {
      console.error('Error selecting payment location:', error);
      toast({
        title: "Erro ao selecionar local de pagamento",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [cartState.checkoutSessionId, toast]);

  const handlePaymentSuccess = useCallback((paymentId: string) => {
    toast({
      title: "Pagamento confirmado!",
      description: "Sua reserva foi confirmada com sucesso.",
    });
    navigate('/driver/dashboard');
  }, [navigate, toast]);

  const handleKYCSubmit = useCallback(async (data: any) => {
    try {
      if (!cartState.checkoutSessionId) return;

      const { error } = await supabase
        .from('driver_details')
        .update({
          full_name: data.full_name,
          birth_date: data.birth_date,
          cpf: data.cpf,
          phone: data.phone,
          email: data.email,
          license_number: data.license_number,
          license_expiry: data.license_expiry
        })
        .eq('id', cartState.driver_id);

      if (error) throw error;
      setStep(5);
    } catch (error) {
      console.error('Error saving KYC data:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [cartState.checkoutSessionId, cartState.driver_id, toast]);

  if (!cartState || (cartState.items.length === 0 && !cartState.checkoutSessionId)) {
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