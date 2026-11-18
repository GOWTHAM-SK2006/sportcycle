'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { userApi, orderApi, paymentApi } from '@/lib/api';
import { Address } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Address form fields
  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    userApi.getAddresses()
      .then((data) => {
        setAddresses(data);
        if (data.length > 0) {
          const defaultAddr = data.find((a) => a.isDefault) || data[0];
          setSelectedAddressId(defaultAddr.id || null);
          setRecipientName(defaultAddr.recipientName);
          setPhone(defaultAddr.phone);
          setStreet(defaultAddr.street);
          setLandmark(defaultAddr.landmark || '');
          setCity(defaultAddr.city);
          setState(defaultAddr.state);
          setPostalCode(defaultAddr.postalCode);
        }
      })
      .catch(console.error);
  }, [user, router]);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id || null);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setStreet(addr.street);
    setLandmark(addr.landmark || '');
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!recipientName || !phone || !street || !city || !state || !postalCode) {
      alert('Please fill out all required address fields');
      return;
    }

    setLoading(true);
    setStatusMessage('Creating your order securely...');

    try {
      // 1. Create order on backend
      const order = await orderApi.checkout({
        addressId: selectedAddressId,
        recipientName,
        phone,
        street,
        landmark,
        city,
        state,
        postalCode,
        country: 'India',
        paymentMethod,
      });

      setStatusMessage('Order created! Preparing Razorpay secure checkout...');

      // 2. Create Razorpay Payment Order on backend
      const paymentOrder = await paymentApi.createPaymentOrder(order.orderNumber);

      // 3. Razorpay Checkout Flow (with dev sandbox verification simulation)
      setStatusMessage('Simulating Razorpay payment gateway authorization...');

      // Simulate instant sandbox payment completion
      const simulatedPaymentId = 'pay_' + Math.random().toString(36).substring(2, 12);
      const simulatedSignature = 'mock_test_signature';

      // 4. Verify Payment cryptographically on backend
      setStatusMessage('Verifying payment signature with SportCycle servers...');
      await paymentApi.verifyPayment({
        orderNumber: order.orderNumber,
        gatewayOrderId: paymentOrder.gatewayOrderId,
        gatewayPaymentId: simulatedPaymentId,
        gatewaySignature: simulatedSignature,
      });

      await refreshCart();
      router.push(`/orders/${order.orderNumber}`);
    } catch (err: any) {
      alert(err.message || 'Payment or checkout failed');
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = deliveryMethod === 'EXPRESS' ? 149 : (cart?.shipping || 0);
  const total = subtotal + shipping;

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-black text-dark">Secure Checkout</h1>
          <p className="text-xs text-dark-muted mt-0.5">Step-by-step verified fulfillment</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: SHIPPING ADDRESS & PAYMENT DETAILS */}
          <div className="lg:col-span-8 space-y-8">
            {/* Saved Addresses (if any) */}
            {addresses.length > 0 && (
              <div className="bg-surface-white rounded-3xl p-6 border border-surface-border shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-dark flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-olive" />
                  <span>Choose Saved Address</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-olive bg-ivory/50 shadow-sm'
                          : 'border-surface-border hover:border-lime'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-dark">{addr.recipientName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-lime text-dark">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-dark-muted line-clamp-2">{addr.street}, {addr.city}</p>
                      <p className="text-[11px] text-dark-light mt-1">{addr.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Address Input Fields */}
            <div className="bg-surface-white rounded-3xl p-6 border border-surface-border shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-dark">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-dark-muted block mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs font-medium p-3 rounded-xl border border-surface-border bg-ivory/20 focus:border-olive focus:outline-none"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-dark-muted block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-medium p-3 rounded-xl border border-surface-border bg-ivory/20 focus:border-olive focus:outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-dark-muted block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full text-xs font-medium p-3 rounded-xl border border-surface-border bg-ivory/20 focus:border-olive focus:outline-none"
                    placeholder="Flat/House number, Building name, Street"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-dark-muted block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full text-xs font-medium p-3 rounded-xl border border-surface-border bg-ivory/20 focus:border-olive focus:outline-none"
                    placeholder="Near sports complex, metro station"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-dark-muted block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs font-medium p-3 rounded-xl border border-surface-border bg-ivory/20 focus:border-olive focus:outline-none"
                    placeholder="Bengaluru, Mumbai, Delhi"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-dark-muted block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs font-medium p-3 rounded-xl border border-surface-border bg-ivory/20 focus:border-olive focus:outline-none"
                    placeholder="Karnataka, Maharashtra"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-dark-muted block mb-1">Postal PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-xs font-medium p-3 rounded-xl border border-surface-border bg-ivory/20 focus:border-olive focus:outline-none"
                    placeholder="560103"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-surface-white rounded-3xl p-6 border border-surface-border shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-dark flex items-center gap-2">
                <Truck className="w-4 h-4 text-olive" />
                <span>Delivery Method</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('STANDARD')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryMethod === 'STANDARD' ? 'border-olive bg-ivory/50 shadow-sm' : 'border-surface-border'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-dark">Standard Courier</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {cart?.shipping === 0 ? 'FREE' : '₹99'}
                    </span>
                  </div>
                  <p className="text-[11px] text-dark-muted">Delivery in 3–5 business days across India.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('EXPRESS')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryMethod === 'EXPRESS' ? 'border-olive bg-ivory/50 shadow-sm' : 'border-surface-border'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-dark">Express Priority</span>
                    <span className="text-xs font-bold text-dark">₹149</span>
                  </div>
                  <p className="text-[11px] text-dark-muted">Priority dispatch in 1–2 business days.</p>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-surface-white rounded-3xl p-6 border border-surface-border shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-dark flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-olive" />
                <span>Payment Gateway</span>
              </h2>
              <div className="p-4 rounded-2xl border-2 border-olive bg-ivory/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-dark">Razorpay Secure Checkout</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime text-dark">RECOMMENDED</span>
                  </div>
                  <p className="text-xs text-dark-muted mt-1">UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, EMI</p>
                </div>
                <Lock className="w-5 h-5 text-olive" />
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 p-6 rounded-3xl bg-ivory/60 border border-surface-border shadow-premium space-y-5">
              <h2 className="text-lg font-black text-dark">Order Items ({items.length})</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 text-xs">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-white flex-shrink-0 relative border border-surface-border">
                      {i.productImage && <Image src={i.productImage} alt={i.productTitle} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-dark truncate">{i.productTitle}</p>
                      <p className="text-[11px] text-dark-muted">Qty: {i.quantity} {i.selectedSize && `• ${i.selectedSize}`}</p>
                    </div>
                    <span className="font-bold text-dark">{formatPrice(i.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-surface-border space-y-2 text-xs text-dark-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-dark">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-dark pt-2 border-t border-surface-border">
                  <span>Total Amount</span>
                  <span className="text-2xl font-black text-dark">{formatPrice(total)}</span>
                </div>
              </div>

              {statusMessage && (
                <div className="p-3 rounded-xl bg-lime/30 text-xs font-semibold text-olive flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-lime hover:bg-lime-500 font-black text-sm text-dark flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatPrice(total)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-dark-muted">
                <ShieldCheck className="w-4 h-4 text-olive" />
                <span>256-Bit SSL Secured Transaction</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
