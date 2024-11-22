import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { StripePaymentForm } from "../../payment-methods/StripePaymentForm";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentSectionProps {
  checkoutSessionId: string;
  onSuccess: (paymentId: string) => void;
}

export const PaymentSection = ({ checkoutSessionId, onSuccess }: PaymentSectionProps) => {
  const { toast } = useToast();
  const { data: session } = useQuery({
    queryKey: ['checkout-session', checkoutSessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', checkoutSessionId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (!session) return null;

  return (
    <Card className="p-6">
      <Elements stripe={stripePromise}>
        <StripePaymentForm onSuccess={onSuccess} />
      </Elements>
    </Card>
  );
};