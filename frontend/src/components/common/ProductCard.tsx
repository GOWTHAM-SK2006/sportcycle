'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { ProductSummary } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ConditionBadge } from './ConditionBadge';
import { RatingStars } from './RatingStars';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const favorited = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const imageUrl = product.primaryImageUrl || 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600';

  return (
    <div className="group relative flex flex-col bg-surface-white rounded-2xl border border-surface-border overflow-hidden hover:shadow-premium transition-all duration-300 hover:border-lime-300">
      {/* Top badges & Wishlist button */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <ConditionBadge
          condition={product.condition}
          isPreOwned={product.isPreOwned}
          isVerified={product.isVerified}
          className="pointer-events-auto"
        />

        <button
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          className="pointer-events-auto w-9 h-9 rounded-full bg-surface-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-dark hover:text-red-500 hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-red-500 text-red-500' : 'text-dark-muted'
            }`}
          />
        </button>
      </div>

      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square w-full bg-ivory/50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute bottom-3 left-3 bg-olive text-surface-white text-xs font-bold px-2 py-0.5 rounded-md">
            {product.discountPercentage}% OFF
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Sport & Brand */}
        <div className="flex items-center justify-between text-xs text-dark-muted mb-1.5 font-medium">
          <span className="uppercase tracking-wider text-olive font-semibold">{product.sportName}</span>
          <span>{product.brandName || 'SportCycle'}</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block mb-2">
          <h3 className="font-semibold text-dark text-sm sm:text-base line-clamp-2 group-hover:text-olive transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating || 4.8} reviewCount={product.reviewCount} />
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-3 border-t border-surface-border flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-dark">
                {formatPrice(product.sellingPrice)}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-xs text-dark-light line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stockQuantity <= 3 && product.stockQuantity > 0 && (
              <p className="text-[10px] text-amber-700 font-medium">Only {product.stockQuantity} left</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stockQuantity === 0}
            className={`h-9 px-3.5 rounded-xl font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-600 text-surface-white'
                : 'bg-lime hover:bg-lime-500 text-dark active:scale-95 shadow-sm'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

