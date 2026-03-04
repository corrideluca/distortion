"use client";
import { createContext, useContext, useReducer, useEffect, useRef, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "qty"> }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "INCREMENT"; payload: { id: string } }
  | { type: "DECREMENT"; payload: { id: string } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartItem[] };

function cartReducer(state: { items: CartItem[] }, action: CartAction) {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing)
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      return { items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case "DECREMENT":
      return {
        items: state.items
          .map((i) =>
            i.id === action.payload.id
              ? { ...i, qty: Math.max(0, i.qty - 1) }
              : i
          )
          .filter((i) => i.qty > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  state: { items: CartItem[] };
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "distortion_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [cartOpen, setCartOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ state, dispatch, totalItems, totalPrice, cartOpen, setCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
