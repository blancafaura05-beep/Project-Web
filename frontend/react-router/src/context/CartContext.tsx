import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "../models/cart";

type CartCtx = {
  items: CartLine[];
  addItem: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartCtx | null>(null);

const STORAGE_KEY = "cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (productId: number, quantity: number) => {
    if (quantity <= 0) return;
    setItems(prev => {
      const found = prev.find(i => i.product_id === productId);
      if (!found) return [...prev, { product_id: productId, quantity }];
      return prev.map(i => i.product_id === productId ? { ...i, quantity: i.quantity + quantity } : i);
    });
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.product_id !== productId));
  };

  const setQuantity = (productId: number, quantity: number) => {
    setItems(prev => prev.map(i => i.product_id === productId ? { ...i, quantity: Math.max(0, quantity) } : i).filter(i => i.quantity > 0));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);

  const value: CartCtx = { items, addItem, removeItem, setQuantity, clear, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
