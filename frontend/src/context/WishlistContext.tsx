'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Wishlist, WishlistItem } from '@/types';
import { wishlistApi } from '@/lib/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Wishlist | null;
  items: WishlistItem[];
  itemCount: number;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  moveToCart: (productId: number) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const { user } = useAuth();

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(null);
      return;
    }
    try {
      const data = await wishlistApi.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [user, refreshWishlist]);

  const items = wishlist?.items || [];
  const itemCount = wishlist?.totalItems || items.length;

  const isInWishlist = (productId: number) => {
    return items.some((item) => item.product?.id === productId);
  };

  const toggleWishlist = async (productId: number) => {
    if (!user) {
      window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (isInWishlist(productId)) {
      const updated = await wishlistApi.removeFromWishlist(productId);
      setWishlist(updated);
    } else {
      const updated = await wishlistApi.addToWishlist(productId);
      setWishlist(updated);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const updated = await wishlistApi.removeFromWishlist(productId);
    setWishlist(updated);
  };

  const moveToCart = async (productId: number) => {
    await wishlistApi.moveToCart(productId);
    await refreshWishlist();
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        items,
        itemCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

