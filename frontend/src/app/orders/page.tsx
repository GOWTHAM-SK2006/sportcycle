'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowRight, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    orderApi.getUserOrders(0, 20)
      .then((res) => setOrders(res.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'CONFIRMED':
      case 'PROCESSING':
      case 'PACKED':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-900 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-dark">Please sign in to view your orders</h2>
        <Link href="/auth/login" className="mt-4 inline-block px-6 py-3 rounded-2xl bg-lime font-bold text-xs text-dark">
          Login to SportCycle
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-black text-dark">My Orders</h1>
          <p className="text-xs text-dark-muted mt-0.5">Track active deliveries and view past equipment purchases</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-3xl bg-ivory/50 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-ivory/30 rounded-3xl border border-surface-border p-8">
            <Package className="w-12 h-12 text-olive mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-dark">No orders placed yet</h3>
            <p className="text-xs text-dark-muted max-w-sm mx-auto mt-1 mb-6">
              Ready for your next tournament? Discover cricket bats, football boots, and badminton racquets today.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-lime text-dark font-bold text-xs hover:bg-lime-500 shadow-sm"
            >
              <span>Explore Gear</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface-white rounded-3xl border border-surface-border shadow-sm overflow-hidden hover:border-lime transition-all"
              >
                {/* Header */}
                <div className="p-4 sm:p-6 bg-ivory/40 border-b border-surface-border flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Order Placed</span>
                    <p className="text-xs font-bold text-dark">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Order Number</span>
                    <p className="text-xs font-mono font-bold text-dark">{order.orderNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Total</span>
                    <p className="text-xs font-black text-dark">{formatPrice(order.finalAmount)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block mb-1">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="px-4 py-2 rounded-xl bg-surface-white border border-surface-border text-xs font-bold text-dark hover:bg-lime/30 transition-colors shadow-sm ml-auto"
                  >
                    View Details & Track
                  </Link>
                </div>

                {/* Items preview */}
                <div className="p-4 sm:p-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-ivory border border-surface-border flex-shrink-0">
                        {item.productImage && (
                          <Image src={item.productImage} alt={item.productTitle} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-dark truncate">{item.productTitle}</h4>
                        <p className="text-xs text-dark-muted mt-0.5">
                          Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                        </p>
                        <p className="text-xs font-black text-dark mt-0.5">{formatPrice(item.unitPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

