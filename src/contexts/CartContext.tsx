import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, CartState, CartAction } from '@/types/cart';

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  total: number;
} | null>(null);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // If it's an insurance item, remove any existing insurance first
      let updatedItems = state.items;
      if (action.payload.type === 'insurance') {
        updatedItems = state.items.filter(item => item.type !== 'insurance');
      }
      
      const existingItem = updatedItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        updatedItems = updatedItems.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.unitPrice
              }
            : item
        );
      } else {
        updatedItems = [...updatedItems, action.payload];
      }
      
      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
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
        checkoutSessionId: undefined
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    checkoutSessionId: undefined
  });

  const total = calculateTotal(state.items);

  return (
    <CartContext.Provider value={{ state, dispatch, total }}>
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