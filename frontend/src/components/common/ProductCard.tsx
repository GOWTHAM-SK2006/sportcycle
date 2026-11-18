'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check, Eye, X, Star } from 'lucide-react';
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
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const favorited = isInWishlist(product.id);

  // Safe price extraction
  const currentPrice = product.sellingPrice != null ? product.sellingPrice : (product.price != null ? product.price : 0);
  const origPrice = product.originalPrice != null ? product.originalPrice : currentPrice;
  const hasDiscount = origPrice > currentPrice && currentPrice > 0;
  const discountPercent = product.discountPercentage || (hasDiscount ? Math.round(((origPrice - currentPrice) / origPrice) * 100) : 0);

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

  const imageUrl = product.primaryImageUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800';

  return (
    <>
      <div className="group relative flex flex-col bg-surface-white rounded-2xl border border-surface-border overflow-hidden hover:shadow-premium transition-all duration-300 hover:border-lime hover:-translate-y-1">
        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            <ConditionBadge
              condition={product.condition}
              isPreOwned={product.isPreOwned}
              isVerified={product.isVerified}
              className="pointer-events-auto"
            />
            {product.isFeatured && (
              <span className="pointer-events-auto bg-olive text-surface-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Best Deal
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              title="Quick view"
              aria-label="Quick view product"
              className="w-8 h-8 rounded-full bg-surface-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-dark hover:text-olive hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 sm:flex hidden"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              title={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label="Add to wishlist"
              className="w-8 h-8 rounded-full bg-surface-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-dark hover:text-red-500 hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorited ? 'fill-red-500 text-red-500' : 'text-dark-muted'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] w-full bg-ivory/60 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {discountPercent > 0 && (
            <span className="absolute bottom-3 left-3 bg-olive text-surface-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex flex-col flex-1 p-4">
          {/* Sport & Brand */}
          <div className="flex items-center justify-between text-xs text-dark-muted mb-1.5 font-medium">
            <span className="uppercase tracking-wider text-olive font-bold text-[11px]">{product.sportName}</span>
            <span className="text-[11px] font-semibold text-dark-muted">{product.brandName || 'SportCycle'}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block mb-2">
            <h3 className="font-bold text-dark text-sm sm:text-[15px] line-clamp-2 group-hover:text-olive transition-colors leading-snug h-10">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-1.5">
            <RatingStars rating={product.rating || 4.8} reviewCount={product.reviewCount} />
          </div>

          {/* Price & Add to Cart */}
          <div className="mt-auto pt-3 border-t border-surface-border flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-dark tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-dark-light line-through font-medium">
                    {formatPrice(origPrice)}
                  </span>
                )}
              </div>
              {product.stockQuantity <= 3 && product.stockQuantity > 0 && (
                <p className="text-[10px] text-amber-700 font-bold mt-0.5">Only {product.stockQuantity} left</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stockQuantity === 0}
              className={`h-9 px-3.5 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all ${
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

      {/* Quick View Modal */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-surface-white rounded-3xl shadow-2xl overflow-hidden border border-surface-border">
            {/* Close Button */}
            <button
              onClick={() => setQuickViewOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ivory text-dark hover:bg-surface-border flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square bg-ivory">
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <ConditionBadge condition={product.condition} isPreOwned={product.isPreOwned} isVerified={product.isVerified} />
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-olive uppercase tracking-wider">
                    <span>{product.sportName}</span>
                    <span>•</span>
                    <span>{product.categoryName}</span>
                  </div>

                  <h2 className="text-xl font-black text-dark leading-snug mb-2">
                    {product.title}
                  </h2>

                  <div className="flex items-center gap-2 mb-4">
                    <RatingStars rating={product.rating || 4.8} reviewCount={product.reviewCount} />
                    <span className="text-xs text-dark-muted">({product.reviewCount || 12} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-surface-border">
                    <span className="text-2xl font-black text-dark">
                      {formatPrice(currentPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-dark-light line-through font-semibold">
                        {formatPrice(origPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-lime text-dark text-xs font-extrabold px-2 py-0.5 rounded-full">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-dark-muted mb-6">
                    <p><strong>Brand:</strong> {product.brandName || 'SportCycle Certified'}</p>
                    <p><strong>Condition:</strong> {product.condition.replace('_', ' ')}</p>
                    <p><strong>Stock:</strong> {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}</p>
                    {product.location && <p><strong>Location:</strong> {product.location}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stockQuantity === 0}
                    className="w-full py-3 bg-lime hover:bg-lime-500 text-dark font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{added ? 'Added to Cart!' : 'Add to Shopping Cart'}</span>
                  </button>

                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => setQuickViewOpen(false)}
                    className="w-full py-2.5 bg-ivory hover:bg-surface-border text-dark text-center font-bold text-xs rounded-xl block transition-colors"
                  >
                    View Full Product Details & Specifications →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
