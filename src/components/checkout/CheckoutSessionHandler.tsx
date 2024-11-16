import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

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

    const sessionData = {
      driver_id: driverId,
      selected_car: selectedCar ? JSON.parse(JSON.stringify(selectedCar)) : null,
      selected_optionals: JSON.parse(JSON.stringify(selectedOptionals)),
      total_amount: totalAmount,
      status: 'pending'
    };

    const { data: session, error: sessionError } = await supabase
      .from('checkout_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Map cart items to the correct format with valid UUIDs
    const cartItemsData = cartItems.map(item => ({
      checkout_session_id: session.id,
      item_type: item.type,
      item_id: item.id.replace(/[^a-fA-F0-9-]/g, ''), // Clean non-UUID characters
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice
    }));

    const { error: cartError } = await supabase
      .from('cart_items')
      .insert(cartItemsData);

    if (cartError) throw cartError;

    onSuccess(session.id);
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};