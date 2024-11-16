import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  type: 'car' | 'optional';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  name?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  checkoutSessionId?: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_CHECKOUT_SESSION'; payload: string }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
              : item
          ),
          total: state.total + action.payload.unitPrice
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.totalPrice
      };
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove?.totalPrice || 0)
      };
    }

    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              quantity: action.payload.quantity,
              totalPrice: action.payload.quantity * item.unitPrice
            };
          }
          return item;
        }),
        total: state.items.reduce((acc, item) => {
          if (item.id === action.payload.id) {
            return acc + (action.payload.quantity * item.unitPrice);
          }
          return acc + item.totalPrice;
        }, 0)
      };
    }

    case 'SET_CHECKOUT_SESSION': {
      return {
        ...state,
        checkoutSessionId: action.payload
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        checkoutSessionId: undefined
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    checkoutSessionId: undefined
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};