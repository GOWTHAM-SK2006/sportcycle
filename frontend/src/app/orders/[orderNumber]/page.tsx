'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  CreditCard
} from 'lucide-react';
import { orderApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const TIMELINE_STEPS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export default function OrderDetailPage() {
  const { orderNumber } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    setLoading(true);
    orderApi.getOrderByNumber(String(orderNumber))
      .then(setOrder)
      .catch((err) => {
        console.error('Failed to load order', err);
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const updated = await orderApi.cancelOrder(order.id, cancelReason);
      setOrder(updated);
      setShowCancelModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-8 w-40 bg-ivory rounded-md" />
        <div className="h-44 bg-ivory rounded-3xl" />
        <div className="h-60 bg-ivory rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-dark">Order Not Found</h2>
        <Link href="/orders" className="text-olive underline mt-2 block font-semibold">
          Return to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';
  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-ivory/60 border-b border-surface-border py-6 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link href="/orders" className="text-xs font-bold text-dark-muted hover:text-dark flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-surface-white border border-surface-border text-xs font-bold text-dark hover:bg-ivory flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Order Header Summary */}
        <div className="p-6 rounded-3xl bg-ivory/50 border border-surface-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-olive">Order Reference</span>
            <h1 className="text-xl sm:text-2xl font-black text-dark font-mono mt-0.5">{order.orderNumber}</h1>
            <p className="text-xs text-dark-muted mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">Total Amount</span>
            <p className="text-2xl sm:text-3xl font-black text-dark">{formatPrice(order.finalAmount)}</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mt-1">
              {order.paymentStatus === 'PAID' ? 'Payment Verified' : order.paymentStatus}
            </span>
          </div>
        </div>

        {/* TRACKING TIMELINE */}
        {!isCancelled ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-white border border-surface-border shadow-sm">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-dark mb-6 flex items-center gap-2">
              <Truck className="w-4 h-4 text-olive" />
              <span>Shipment Status Tracker</span>
            </h2>

            {/* Stepper */}
            <div className="relative">
              <div className="overflow-x-auto no-scrollbar pb-4">
                <div className="min-w-[600px] flex items-center justify-between relative">
                  {/* Background track line */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-surface-border -z-0" />

                  {TIMELINE_STEPS.map((step, idx) => {
                    const isPassed = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={step} className="flex flex-col items-center z-10 text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isPassed
                              ? 'bg-olive text-surface-white shadow-sm ring-4 ring-lime/30'
                              : 'bg-surface-white border-2 border-surface-border text-dark-muted'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[10px] mt-2 max-w-[80px] leading-tight ${
                          isCurrent ? 'font-black text-olive' : isPassed ? 'font-bold text-dark' : 'text-dark-muted'
                        }`}>
                          {step.replace(/_/g, ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between text-xs text-dark-muted">
                <span>Shipping Carrier: <strong className="text-dark">{order.shippingCarrier || 'BlueDart Pro'}</strong></span>
                <span>Tracking Number: <strong className="font-mono text-dark">{order.trackingNumber}</strong></span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Order {order.status}</h3>
              <p className="text-xs text-red-700 mt-0.5">
                {order.cancellationReason || 'This order was cancelled and inventory was returned to stock.'}
              </p>
            </div>
          </div>
        )}

        {/* ORDER ITEMS & ADDRESS BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items */}
          <div className="lg:col-span-8 bg-surface-white rounded-3xl p-6 border border-surface-border shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-dark mb-2">Itemized Equipment</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-surface-border last:border-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-ivory border border-surface-border flex-shrink-0">
                    {item.productImage && (
                      <Image src={item.productImage} alt={item.productTitle} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-dark truncate">{item.productTitle}</h3>
                    <p className="text-xs text-dark-muted mt-0.5">
                      Qty: {item.quantity} {item.selectedSize && `• Spec: ${item.selectedSize}`}
                    </p>
                    <p className="text-xs font-semibold text-dark-muted">{formatPrice(item.unitPrice)} each</p>
                  </div>
                  <span className="font-black text-sm text-dark">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-surface-border space-y-2 text-xs text-dark-muted">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-dark">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Packaging</span>
                <span className="font-bold text-dark">{order.shippingAmount === 0 ? 'FREE' : formatPrice(order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-dark pt-2 border-t border-surface-border">
                <span>Total Paid</span>
                <span className="text-xl font-black text-dark">{formatPrice(order.finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-ivory/50 rounded-3xl p-6 border border-surface-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive" />
                <span>Shipping Address</span>
              </h3>
              <div className="text-xs text-dark space-y-1">
                <p className="font-bold">{order.recipientName}</p>
                <p>{order.street}</p>
                {order.landmark && <p>{order.landmark}</p>}
                <p>{order.city}, {order.state} - {order.postalCode}</p>
                <p className="text-dark-muted pt-1">Phone: {order.phone}</p>
              </div>
            </div>

            <div className="bg-ivory/50 rounded-3xl p-6 border border-surface-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-olive" />
                <span>Payment Summary</span>
              </h3>
              <div className="text-xs text-dark space-y-1">
                <p><span className="text-dark-muted">Method:</span> {order.paymentMethod}</p>
                <p><span className="text-dark-muted">Status:</span> <strong className="text-emerald-700 font-bold">{order.paymentStatus}</strong></p>
                <p><span className="text-dark-muted">Currency:</span> INR (₹)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-surface-white rounded-3xl p-6 max-w-md w-full border border-surface-border shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Cancel Order</span>
            </div>
            <p className="text-xs text-dark-muted">
              Are you sure you want to cancel order #{order.orderNumber}? If already paid, the refund process will be initiated automatically.
            </p>
            <div>
              <label className="text-xs font-semibold text-dark-muted block mb-1">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found better price elsewhere">Found better price elsewhere</option>
                <option value="Incorrect shipping address selected">Incorrect shipping address selected</option>
                <option value="Delivery duration too long">Delivery duration too long</option>
                <option value="Changed sport requirement">Changed sport requirement</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-surface-border font-bold text-xs text-dark hover:bg-ivory"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-surface-white"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

