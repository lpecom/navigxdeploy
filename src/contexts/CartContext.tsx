import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, CartState } from '@/types/cart';

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_CHECKOUT_SESSION'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_CAR_GROUP'; payload: CartItem };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // If it's a car_group item, replace any existing car_group
      if (action.payload.type === 'car_group') {
        const nonCarItems = state.items.filter(item => item.type !== 'car_group');
        return {
          ...state,
          items: [...nonCarItems, action.payload],
          total: nonCarItems.reduce((sum, item) => sum + item.totalPrice, 0) + action.payload.totalPrice
        };
      }

      // For optionals, update quantity if exists
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.unitPrice
              }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.totalPrice
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: action.payload.quantity,
              totalPrice: action.payload.quantity * item.unitPrice
            }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
      };
    }

    case 'UPDATE_CAR_GROUP': {
      const nonCarItems = state.items.filter(item => item.type !== 'car_group');
      return {
        ...state,
        items: [...nonCarItems, action.payload],
        total: nonCarItems.reduce((sum, item) => sum + item.totalPrice, 0) + action.payload.totalPrice
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