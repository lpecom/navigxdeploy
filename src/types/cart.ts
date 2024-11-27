export interface CartItem {
  id: string;
  type: 'car_group' | 'optional' | 'insurance';
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  period?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  checkoutSessionId?: string;
}