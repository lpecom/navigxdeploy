import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/cart";
import { Json } from "@/integrations/supabase/types";

interface CheckoutSessionHandlerProps {
  driverId?: string;
  cartItems: CartItem[];
  totalAmount: number;
  onSuccess: (sessionId: string) => void;
  guestToken?: string;
  guestEmail?: string;
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
  guestToken,
  guestEmail,
}: CheckoutSessionHandlerProps) => {
  try {
    const selectedGroup = cartItems.find(item => item.type === 'car_group');
    const selectedOptionals = cartItems.filter(item => item.type === 'optional');

    const sessionData = {
      driver_id: driverId,
      selected_car: selectedGroup ? {
        group_id: getValidUUID(selectedGroup.id),
        name: selectedGroup.name,
        category: selectedGroup.category,
        price: selectedGroup.unitPrice,
        period: selectedGroup.period
      } as Json : {} as Json,
      selected_optionals: selectedOptionals.map(opt => ({
        ...opt,
        id: getValidUUID(opt.id)
      })) as unknown as Json,
      total_amount: totalAmount,
      status: 'pending',
      guest_token: guestToken,
      guest_email: guestEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: session, error: sessionError } = await supabase
      .from('checkout_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) throw sessionError;

    const cartItemsData = cartItems.map(item => ({
      checkout_session_id: session.id,
      item_type: item.type === 'car_group' ? 'car' : item.type,
      item_id: getValidUUID(item.id),
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