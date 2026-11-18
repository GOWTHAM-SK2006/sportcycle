'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, Plus, Minus, PackageOpen } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const discount = cart?.discount || 0;
  const total = cart?.total || 0;

  if (items.length === 0 && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-ivory border border-surface-border flex items-center justify-center mx-auto mb-6 text-olive shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-dark mb-2">Your Cart is Empty</h1>
        <p className="text-sm text-dark-muted max-w-sm mx-auto mb-8">
          You haven&apos;t added any sports equipment to your cart yet. Explore our pro and pre-owned gear to get started.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-lime font-black text-sm text-dark hover:bg-lime-500 shadow-sm transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-dark">Shopping Cart</h1>
            <p className="text-xs text-dark-muted mt-0.5">
              {cart?.totalItems || 0} item(s) in your cart
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ITEMS LIST */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-surface-white border border-surface-border shadow-sm gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-ivory flex-shrink-0 border border-surface-border">
                    <Image
                      src={item.productImage || 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=300'}
                      alt={item.productTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="font-bold text-sm text-dark hover:text-olive transition-colors line-clamp-1"
                    >
                      {item.productTitle}
                    </Link>
                    {item.selectedSize && (
                      <p className="text-xs text-dark-muted mt-0.5">
                        Size / Spec: <span className="font-semibold text-dark">{item.selectedSize}</span>
                      </p>
                    )}
                    <p className="text-sm font-black text-dark mt-1">
                      {formatPrice(item.unitPrice)}
                    </p>
                    {!item.inStock && (
                      <p className="text-xs text-red-600 font-bold mt-0.5">Stock limit reached</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:justify-end">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-surface-border rounded-xl bg-ivory/50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                      className="p-2 text-dark hover:bg-ivory rounded-l-xl transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-dark">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                      disabled={item.availableStock !== undefined && item.quantity >= item.availableStock}
                      className="p-2 text-dark hover:bg-ivory rounded-r-xl transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for item */}
                  <div className="text-right min-w-[80px]">
                    <span className="font-black text-sm text-dark">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="p-2 text-dark-muted hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 p-6 rounded-3xl bg-ivory/60 border border-surface-border shadow-premium space-y-5">
              <h2 className="text-lg font-black text-dark">Order Summary</h2>

              <div className="space-y-3 text-xs font-medium text-dark-muted pb-4 border-b border-surface-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline justify-between text-base font-black text-dark">
                <span>Total Amount</span>
                <span className="text-2xl font-black text-dark">{formatPrice(total)}</span>
              </div>

              {shipping > 0 && (
                <p className="text-[11px] text-olive font-semibold bg-lime/20 p-2 rounded-xl text-center">
                  Add items worth {formatPrice(999 - subtotal)} more for FREE Delivery!
                </p>
              )}

              <Link
                href="/checkout"
                className="w-full py-4 rounded-2xl bg-lime hover:bg-lime-500 font-black text-sm text-dark flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-dark-muted">
                <ShieldCheck className="w-4 h-4 text-olive" />
                <span>Encrypted checkout via Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

