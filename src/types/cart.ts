export interface CartItem {
  id: string;
  type: 'car_group' | 'optional';
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
  customerId?: string;  // Added this property
}