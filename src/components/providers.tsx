"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

type CartItem = { productId: string; qty: number };

interface CartContextType {
  items: CartItem[];
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: (prices: Record<string, number>) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CART);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = useCallback((productId: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        const next = prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
        try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(next)); } catch {}
        return next;
      }
      const next = [...prev, { productId, qty }];
      try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      remove(productId);
      return;
    }
    setItems((prev) => {
      const next = prev.map((i) => (i.productId === productId ? { ...i, qty } : i));
      try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [remove]);

  const clear = useCallback(() => {
    setItems([]);
    try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([])); } catch {}
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = useCallback((prices: Record<string, number>) => {
    return items.reduce((s, i) => s + (prices[i.productId] || 0) * i.qty, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

interface WishlistContextType {
  ids: Set<string>;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (raw) setIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([...ids]));
    } catch {}
  }, [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const has = useCallback((id: string) => ids.has(id), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, toggle, has }}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
