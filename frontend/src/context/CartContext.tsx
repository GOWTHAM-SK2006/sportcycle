'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '@/types';
import { cartApi } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number, selectedSize?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number, selectedSize?: string) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [user, refreshCart]);

  const addToCart = async (productId: number, quantity = 1, selectedSize?: string) => {
    setIsLoading(true);
    try {
      const updated = await cartApi.addToCart({ productId, quantity, selectedSize });
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number, selectedSize?: string) => {
    setIsLoading(true);
    try {
      const updated = await cartApi.updateItem(itemId, { quantity, selectedSize });
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    setIsLoading(true);
    try {
      const updated = await cartApi.removeItem(itemId);
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await cartApi.clearCart();
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        totalItems: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cart?.totalItems || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

