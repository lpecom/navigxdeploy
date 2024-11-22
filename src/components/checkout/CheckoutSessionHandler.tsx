import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/cart";

interface CheckoutSessionHandlerProps {
  driverId: string;
  cartItems: CartItem[];
  totalAmount: number;
  onSuccess: (sessionId: string) => void;
}

const getValidUUID = (id: string) => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = id.match(uuidPattern);
  return match ? match[0] : id;
};

export const createCheckoutSession = async ({
  driverId,
  cartItems,
  totalAmount,
  onSuccess,
}: CheckoutSessionHandlerProps) => {
  try {
    const selectedGroup = cartItems.find(item => item.type === 'car_group');
    const selectedOptionals = cartItems.filter(item => item.type === 'optional');
    const selectedInsurance = cartItems.find(item => item.type === 'insurance');

    // Create the checkout session with minimal required data first
    const { data: session, error: sessionError } = await supabase
      .from('checkout_sessions')
      .insert({
        driver_id: driverId,
        selected_car: selectedGroup ? {
          group_id: getValidUUID(selectedGroup.id),
          name: selectedGroup.name,
          category: selectedGroup.category,
          price: selectedGroup.unitPrice,
          period: selectedGroup.period
        } : {},
        selected_optionals: [],
        total_amount: totalAmount,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    if (session) {
      // Then update with insurance if selected
      if (selectedInsurance) {
        const { error: insuranceError } = await supabase
          .from('checkout_sessions')
          .update({ 
            insurance_option_id: getValidUUID(selectedInsurance.id)
          })
          .eq('id', session.id);

        if (insuranceError) throw insuranceError;
      }

      // Then add optionals if any
      if (selectedOptionals.length > 0) {
        const { error: optionalsError } = await supabase
          .from('checkout_sessions')
          .update({ 
            selected_optionals: selectedOptionals.map(opt => ({
              id: getValidUUID(opt.id),
              name: opt.name,
              totalPrice: opt.totalPrice
            }))
          })
          .eq('id', session.id);

        if (optionalsError) throw optionalsError;
      }

      // Finally insert cart items
      const cartItemsData = cartItems.map(item => ({
        checkout_session_id: session.id,
        item_type: item.type,
        item_id: getValidUUID(item.id),
        quantity: item.quantity || 1,
        unit_price: item.unitPrice,
        total_price: item.totalPrice
      }));

      const { error: cartError } = await supabase
        .from('cart_items')
        .insert(cartItemsData);

      if (cartError) throw cartError;

      onSuccess(session.id);
      return session;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};