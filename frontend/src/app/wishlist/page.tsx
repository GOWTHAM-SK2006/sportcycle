'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ConditionBadge } from '@/components/common/ConditionBadge';
import Image from 'next/image';

export default function WishlistPage() {
  const { items, removeFromWishlist, moveToCart } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-ivory border border-surface-border flex items-center justify-center mx-auto mb-6 text-olive shadow-sm">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-dark mb-2">Your Wishlist is Empty</h1>
        <p className="text-sm text-dark-muted max-w-sm mx-auto mb-8">
          Save your favourite cricket bats, football cleats, badminton rackets, and pre-owned deals to review them anytime.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-lime font-black text-sm text-dark hover:bg-lime-500 shadow-sm transition-all"
        >
          <span>Explore Equipment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-black text-dark">My Saved Gear</h1>
          <p className="text-xs text-dark-muted mt-0.5">{items.length} item(s) saved</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const p = item.product;
            if (!p) return null;
            return (
              <div
                key={item.id}
                className="group flex flex-col bg-surface-white rounded-2xl border border-surface-border overflow-hidden hover:shadow-premium transition-all"
              >
                <div className="relative aspect-square w-full bg-ivory">
                  <Image
                    src={p.primaryImageUrl || 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400'}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <ConditionBadge condition={p.condition} isPreOwned={p.isPreOwned} isVerified={p.isVerified} />
                  </div>
                  <button
                    onClick={() => removeFromWishlist(p.id)}
                    aria-label="Remove"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-white/90 shadow-sm flex items-center justify-center text-dark-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-olive">{p.sportName}</span>
                    <Link href={`/products/${p.slug}`} className="block mt-0.5">
                      <h3 className="font-bold text-sm text-dark line-clamp-2 hover:text-olive transition-colors">{p.title}</h3>
                    </Link>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between gap-2">
                    <span className="text-base font-black text-dark">{formatPrice(p.sellingPrice)}</span>
                    <button
                      onClick={() => moveToCart(p.id)}
                      className="px-3.5 py-2 rounded-xl bg-lime hover:bg-lime-500 font-extrabold text-xs text-dark inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

