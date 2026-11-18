'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Layers,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { adminApi, productApi } from '@/lib/api';
import { AdminStats, Order, User, ProductSummary, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ConditionBadge } from '@/components/common/ConditionBadge';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'audit'>('overview');

  // Products moderation state
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [productSearch, setProductSearch] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('CONFIRMED');
  const [trackingNum, setTrackingNum] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('BlueDart Pro');
  const [statusNotes, setStatusNotes] = useState('');

  // Users state
  const [usersList, setUsersList] = useState<User[]>([]);

  // Audit state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      return;
    }

    loadAdminData();
  }, [user, isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, usersRes, auditRes] = await Promise.allSettled([
        adminApi.getStats(),
        productApi.getProducts({ size: 30 }),
        adminApi.getOrders(0, 30),
        adminApi.getUsers(0, 30),
        adminApi.getAuditLogs(0, 30),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (productsRes.status === 'fulfilled') setProducts(productsRes.value.content || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.content || []);
      if (usersRes.status === 'fulfilled') setUsersList(usersRes.value.content || []);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateProduct = async (productId: number, status: string, isVerified: boolean) => {
    try {
      await adminApi.moderateProduct(productId, { status, isVerified, reason: 'Admin approval' });
      alert('Product updated successfully');
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleFeatured = async (productId: number) => {
    try {
      await adminApi.toggleFeatured(productId);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    try {
      await adminApi.updateOrderStatus(selectedOrderId, {
        status: newStatus,
        trackingNumber: trackingNum,
        shippingCarrier,
        notes: statusNotes || `Order updated to ${newStatus}`,
      });
      alert('Order status updated');
      setSelectedOrderId(null);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleUser = async (userId: number) => {
    try {
      await adminApi.toggleUserStatus(userId);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Shield className="w-12 h-12 text-olive mx-auto mb-3" />
        <h2 className="text-2xl font-black text-dark">Admin Access Restricted</h2>
        <p className="text-xs text-dark-muted mt-1 max-w-sm mx-auto">
          You need an administrator account to access the SportCycle marketplace console.
        </p>
        <Link href="/auth/login" className="mt-4 inline-block px-6 py-2.5 rounded-xl bg-lime font-bold text-xs text-dark">
          Login as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-olive" />
              <span className="text-xs font-black uppercase tracking-wider text-olive">SportCycle Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-dark mt-0.5">Marketplace Command Console</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['overview', 'products', 'orders', 'users', 'audit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-olive text-surface-white shadow-sm'
                    : 'bg-surface-white border border-surface-border text-dark hover:bg-ivory'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* TAB 1: OVERVIEW KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-ivory/40 border border-surface-border">
                <span className="text-xs text-dark-muted font-bold">Total Gross Revenue</span>
                <p className="text-2xl sm:text-3xl font-black text-dark mt-1">{formatPrice(stats?.totalRevenue || 0)}</p>
                <span className="text-[10px] text-emerald-700 font-semibold">Verified transactions</span>
              </div>

              <div className="p-6 rounded-3xl bg-ivory/40 border border-surface-border">
                <span className="text-xs text-dark-muted font-bold">Total Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-dark mt-1">{stats?.totalOrders || 0}</p>
                <span className="text-[10px] text-dark-muted font-semibold">Across India</span>
              </div>

              <div className="p-6 rounded-3xl bg-ivory/40 border border-surface-border">
                <span className="text-xs text-dark-muted font-bold">Active Listings</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{stats?.activeListings || 0}</p>
                <span className="text-[10px] text-dark-muted font-semibold">{stats?.preOwnedProducts || 0} pre-owned</span>
              </div>

              <div className="p-6 rounded-3xl bg-ivory/40 border border-surface-border">
                <span className="text-xs text-dark-muted font-bold">Sports Clubs</span>
                <p className="text-2xl sm:text-3xl font-black text-olive mt-1">{stats?.totalClubs || 3}</p>
                <span className="text-[10px] text-dark-muted font-semibold">Partner academies</span>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-surface-white border border-surface-border shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-dark uppercase tracking-wider">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-xs p-3 rounded-xl bg-ivory/30 border border-surface-border">
                      <div>
                        <p className="font-mono font-bold text-dark">{o.orderNumber}</p>
                        <p className="text-[11px] text-dark-muted">{o.recipientName} • {formatDate(o.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-dark">{formatPrice(o.finalAmount)}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime/40 text-dark">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-surface-white border border-surface-border shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-dark uppercase tracking-wider">Recent System Audit Logs</h3>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log, idx) => (
                    <div key={idx} className="text-xs p-3 rounded-xl bg-ivory/30 border border-surface-border space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-olive">{log.action}</span>
                        <span className="text-[10px] text-dark-muted">{formatDate(log.createdAt)}</span>
                      </div>
                      <p className="text-dark-muted truncate">{log.details}</p>
                      <p className="text-[10px] text-dark-light">Actor: {log.userEmail || 'System'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MODERATION */}
        {activeTab === 'products' && (
          <div className="bg-surface-white rounded-3xl border border-surface-border overflow-hidden shadow-sm">
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <h2 className="font-extrabold text-base text-dark">Product Moderation & Verification</h2>
              <span className="text-xs text-dark-muted">{products.length} products total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory/60 text-dark-muted font-bold uppercase tracking-wider border-b border-surface-border">
                  <tr>
                    <th className="p-4">Product Title</th>
                    <th className="p-4">Sport</th>
                    <th className="p-4">Condition</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Verified Badge</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-ivory/20">
                      <td className="p-4 font-bold text-dark max-w-xs truncate">{p.title}</td>
                      <td className="p-4 text-dark-muted">{p.sportName}</td>
                      <td className="p-4">
                        <ConditionBadge condition={p.condition} isPreOwned={p.isPreOwned} />
                      </td>
                      <td className="p-4 font-black text-dark">{formatPrice(p.sellingPrice)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleModerateProduct(p.id, p.status, !p.isVerified)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            p.isVerified
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          {p.isVerified ? '✓ Verified' : '+ Mark Verified'}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleFeatured(p.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.isFeatured ? 'bg-lime text-dark' : 'bg-gray-100 text-dark-muted'
                          }`}
                        >
                          {p.isFeatured ? '★ Featured' : 'Normal'}
                        </button>
                      </td>
                      <td className="p-4 font-bold text-dark">{p.status}</td>
                      <td className="p-4 text-right space-x-2">
                        {p.status !== 'ACTIVE' ? (
                          <button
                            onClick={() => handleModerateProduct(p.id, 'ACTIVE', p.isVerified)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-surface-white font-bold text-[10px]"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerateProduct(p.id, 'PAUSED', p.isVerified)}
                            className="px-2.5 py-1 rounded-lg border border-red-300 text-red-600 font-bold text-[10px]"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-surface-white rounded-3xl border border-surface-border overflow-hidden shadow-sm">
              <div className="p-5 border-b border-surface-border flex items-center justify-between">
                <h2 className="font-extrabold text-base text-dark">Order Fulfillment Control</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory/60 text-dark-muted font-bold uppercase tracking-wider border-b border-surface-border">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-ivory/20">
                        <td className="p-4 font-mono font-bold text-dark">{o.orderNumber}</td>
                        <td className="p-4 text-dark-muted">{formatDate(o.createdAt)}</td>
                        <td className="p-4 font-bold text-dark">{o.recipientName}</td>
                        <td className="p-4 text-dark-muted">{o.city}</td>
                        <td className="p-4 font-black text-dark">{formatPrice(o.finalAmount)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-olive">{o.status}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrderId(o.id);
                              setNewStatus(o.status);
                              setTrackingNum(o.trackingNumber || '');
                              setShippingCarrier(o.shippingCarrier || 'BlueDart Pro');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-lime text-dark font-bold text-[11px]"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STATUS UPDATE MODAL */}
            {selectedOrderId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
                <form onSubmit={handleUpdateOrderStatus} className="bg-surface-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-surface-border shadow-2xl space-y-4">
                  <h3 className="font-black text-base text-dark">Update Order Status</h3>

                  <div>
                    <label className="text-xs font-bold text-dark block mb-1">New Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="PACKED">PACKED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-dark block mb-1">Shipping Carrier</label>
                    <input
                      type="text"
                      value={shippingCarrier}
                      onChange={(e) => setShippingCarrier(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-dark block mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNum}
                      onChange={(e) => setTrackingNum(e.target.value)}
                      placeholder="e.g. BD987654321IN"
                      className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-dark block mb-1">Internal Notes</label>
                    <textarea
                      rows={2}
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(null)}
                      className="flex-1 py-2.5 rounded-xl border border-surface-border font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-lime font-bold text-xs text-dark"
                    >
                      Save Status
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-surface-white rounded-3xl border border-surface-border overflow-hidden shadow-sm">
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <h2 className="font-extrabold text-base text-dark">Platform Users & Roles</h2>
              <span className="text-xs text-dark-muted">{usersList.length} accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory/60 text-dark-muted font-bold uppercase tracking-wider border-b border-surface-border">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Roles</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-ivory/20">
                      <td className="p-4 font-bold text-dark">{u.fullName}</td>
                      <td className="p-4 text-dark-muted">{u.email}</td>
                      <td className="p-4 text-dark-muted">{u.phone || 'N/A'}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span key={r} className="px-2 py-0.5 rounded bg-ivory text-dark font-bold text-[10px] border border-surface-border">
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                            u.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.isActive ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-surface-white rounded-3xl border border-surface-border overflow-hidden shadow-sm">
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <h2 className="font-extrabold text-base text-dark">Tamper-Evident System Audit Trail</h2>
              <span className="text-xs text-dark-muted">{auditLogs.length} events logged</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory/60 text-dark-muted font-bold uppercase tracking-wider border-b border-surface-border">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Resource</th>
                    <th className="p-4">Actor Email</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-mono text-[11px]">
                  {auditLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-ivory/20">
                      <td className="p-4 text-dark-muted whitespace-nowrap">{formatDate(log.createdAt)}</td>
                      <td className="p-4 font-bold text-olive">{log.action}</td>
                      <td className="p-4 font-bold text-dark">{log.resource} #{log.resourceId}</td>
                      <td className="p-4 text-dark-muted">{log.userEmail || 'System'}</td>
                      <td className="p-4 text-dark font-sans truncate max-w-sm">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

