import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CartItem } from "@/contexts/CartContext";
import { CheckoutSession } from "@/types/checkout";

interface CheckoutSessionHandlerProps {
  driverId: string;
  cartItems: CartItem[];
  totalAmount: number;
  onSuccess: (sessionId: string) => void;
}

export const createCheckoutSession = async ({
  driverId,
  cartItems,
  totalAmount,
  onSuccess,
}: CheckoutSessionHandlerProps) => {
  try {
    const selectedCar = cartItems.find(item => item.type === 'car');
    const selectedOptionals = cartItems.filter(item => item.type === 'optional');

    const sessionData: CheckoutSession = {
      driver_id: driverId,
      selected_car: selectedCar || null,
      selected_optionals: selectedOptionals,
      total_amount: totalAmount,
      status: 'completed'
    };

    const { data: session, error: sessionError } = await supabase
      .from('checkout_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) throw sessionError;

    const { error: cartError } = await supabase
      .from('cart_items')
      .insert(
        cartItems.map(item => ({
          checkout_session_id: session.id,
          item_type: item.type,
          item_id: item.id,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice
        }))
      );

    if (cartError) throw cartError;

    onSuccess(session.id);
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};