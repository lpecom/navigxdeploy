export type CartItemType = 'car_group' | 'optional' | 'insurance';

export interface CartItem {
  id: string;
  type: CartItemType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  name: string;
  category?: string;
  period?: string;
}

export interface CartState {
  items: CartItem[];
  checkoutSessionId?: string;
  driver_id?: string;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_CHECKOUT_SESSION'; payload: string }
  | { type: 'SET_DRIVER_ID'; payload: string }
  | { type: 'CLEAR_CART' };