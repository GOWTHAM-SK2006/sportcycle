'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  PlusCircle,
  TrendingUp,
  Tag,
  DollarSign,
  Package,
  CheckCircle2,
  AlertCircle,
  Upload,
  PauseCircle,
  PlayCircle,
  Trash2,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { sellerApi, catalogApi, productApi } from '@/lib/api';
import { SellerProfile, SellerStats, ProductSummary, Sport, Category, Brand, ProductCondition } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ConditionBadge } from '@/components/common/ConditionBadge';

export default function SellerPage() {
  const { user, isSeller } = useAuth();

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab: 'dashboard' | 'new-listing'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new-listing'>('dashboard');

  // Seller Onboarding state
  const [businessName, setBusinessName] = useState('');
  const [sellerType, setSellerType] = useState('INDIVIDUAL');
  const [sellerPhone, setSellerPhone] = useState(user?.phone || '');
  const [sellerBio, setSellerBio] = useState('');
  const [gstin, setGstin] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  // Sell Equipment Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSportId, setFormSportId] = useState<number | ''>('');
  const [formCategoryId, setFormCategoryId] = useState<number | ''>('');
  const [formBrandId, setFormBrandId] = useState<number | ''>('');
  const [formDescription, setFormDescription] = useState('');
  const [formCondition, setFormCondition] = useState<ProductCondition>('BRAND_NEW');
  const [formIsPreOwned, setFormIsPreOwned] = useState(false);
  const [formUsageMonths, setFormUsageMonths] = useState(0);
  const [formWearDetails, setFormWearDetails] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formSellingPrice, setFormSellingPrice] = useState('');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formSizes, setFormSizes] = useState('');
  const [formLocation, setFormLocation] = useState('Bengaluru, India');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  useEffect(() => {
    catalogApi.getSports().then(setSports).catch(console.error);
    catalogApi.getCategories().then(setCategories).catch(console.error);
    catalogApi.getBrands().then(setBrands).catch(console.error);

    if (user && isSeller) {
      loadSellerDashboard();
    } else {
      setLoading(false);
    }
  }, [user, isSeller]);

  const loadSellerDashboard = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, prRes] = await Promise.allSettled([
        sellerApi.getProfile(),
        sellerApi.getStats(),
        sellerApi.getProducts(),
      ]);

      if (pRes.status === 'fulfilled') setProfile(pRes.value);
      if (sRes.status === 'fulfilled') setStats(sRes.value);
      if (prRes.status === 'fulfilled') setProducts(prRes.value);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingLoading(true);
    try {
      await sellerApi.register({
        businessName,
        sellerType,
        phone: sellerPhone,
        bio: sellerBio,
        gstin,
        bankAccountNumber: bankAcc,
        bankIfsc,
      });
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Onboarding failed');
    } finally {
      setOnboardingLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSportId || !formCategoryId) {
      alert('Please select both Sport and Category');
      return;
    }

    setSubmittingProduct(true);
    try {
      const imageUrl = formImageUrl.trim() || 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800';

      await productApi.createProduct({
        title: formTitle,
        sportId: Number(formSportId),
        categoryId: Number(formCategoryId),
        brandId: formBrandId ? Number(formBrandId) : null,
        description: formDescription,
        condition: formCondition,
        isPreOwned: formIsPreOwned || formCondition !== 'BRAND_NEW',
        usageDurationMonths: Number(formUsageMonths),
        wearDetails: formWearDetails,
        originalPrice: Number(formOriginalPrice),
        sellingPrice: Number(formSellingPrice),
        stockQuantity: Number(formQuantity),
        sizes: formSizes,
        location: formLocation,
        imageUrls: [imageUrl],
      });

      alert('Equipment listed successfully!');
      // Reset form & go back to dashboard
      setFormTitle('');
      setFormDescription('');
      setFormOriginalPrice('');
      setFormSellingPrice('');
      setFormWearDetails('');
      setFormImageUrl('');
      setActiveTab('dashboard');
      loadSellerDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to list product');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleToggleStatus = async (productId: number) => {
    try {
      await sellerApi.toggleStatus(productId);
      loadSellerDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-dark">Join the SportCycle Seller Network</h2>
        <p className="text-sm text-dark-muted mt-2 max-w-md mx-auto">
          Monetize your pre-loved sports equipment or sell retail stock across India with 0% listing fee.
        </p>
        <Link href="/auth/login?redirect=/seller" className="mt-6 inline-block px-8 py-4 rounded-2xl bg-lime font-black text-xs text-dark shadow-sm">
          Login or Sign Up to Sell
        </Link>
      </div>
    );
  }

  // Not yet registered as seller -> Show Onboarding form
  if (!isSeller) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 rounded-3xl bg-surface-white border border-surface-border shadow-premium space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime/40 border border-lime text-xs font-bold uppercase tracking-wider text-dark mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-olive" />
              <span>Seller Onboarding</span>
            </div>
            <h1 className="text-3xl font-black text-dark">Register as a SportCycle Seller</h1>
            <p className="text-xs text-dark-muted mt-1">Start listing pre-owned or new tournament gear in minutes.</p>
          </div>

          <form onSubmit={handleRegisterSeller} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-dark block mb-1">Business or Seller Display Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Sports Gear or Rahul's Cricket Collection"
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Seller Type</label>
                <select
                  value={sellerType}
                  onChange={(e) => setSellerType(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                >
                  <option value="INDIVIDUAL">Individual Athlete / Player</option>
                  <option value="RETAILER">Authorized Sports Retailer</option>
                  <option value="PRO_ATHLETE">Professional Athlete</option>
                  <option value="CLUB">Sports Club / Academy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-dark block mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-dark block mb-1">Seller Bio / Description</label>
              <textarea
                rows={2}
                value={sellerBio}
                onChange={(e) => setSellerBio(e.target.value)}
                placeholder="Briefly describe your sport specialization (e.g. English Willow bats & badminton strings)"
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-dark block mb-1">GSTIN (Optional for Individuals)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="29AAAAA0000A1Z5"
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Bank Account Number (Payouts)</label>
                <input
                  type="text"
                  value={bankAcc}
                  onChange={(e) => setBankAcc(e.target.value)}
                  placeholder="Account number"
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={onboardingLoading}
              className="w-full py-4 rounded-2xl bg-lime hover:bg-lime-500 font-black text-sm text-dark shadow-sm transition-all"
            >
              {onboardingLoading ? 'Registering Seller Profile...' : 'Complete Registration & Start Selling'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Seller Dashboard
  return (
    <div className="bg-surface-white min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-olive">Seller Portal</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-lime text-dark">ACTIVE SELLER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-dark mt-0.5">{profile?.businessName}</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard' ? 'bg-olive text-surface-white' : 'bg-surface-white border border-surface-border text-dark'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('new-listing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'new-listing' ? 'bg-lime text-dark' : 'bg-surface-white border border-surface-border text-dark'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Equipment</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-ivory/40 border border-surface-border">
                <span className="text-xs text-dark-muted font-bold">Total Listings</span>
                <p className="text-2xl sm:text-3xl font-black text-dark mt-1">{stats?.totalListings || products.length}</p>
              </div>

              <div className="p-5 rounded-2xl bg-ivory/40 border border-surface-border">
                <span className="text-xs text-dark-muted font-bold">Active Listings</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{stats?.activeListings || products.length}</p>
              </div>

              <div className="p-5 rounded-2xl bg-ivory/40 border border-surface-border">
                <span className="text-xs text-dark-muted font-bold">Sold Gear</span>
                <p className="text-2xl sm:text-3xl font-black text-dark mt-1">{stats?.soldProducts || 0}</p>
              </div>

              <div className="p-5 rounded-2xl bg-ivory/40 border border-surface-border">
                <span className="text-xs text-dark-muted font-bold">Seller Rating</span>
                <p className="text-2xl sm:text-3xl font-black text-olive mt-1">⭐ {profile?.rating || '5.0'}</p>
              </div>
            </div>

            {/* MY LISTINGS TABLE */}
            <div className="bg-surface-white rounded-3xl border border-surface-border overflow-hidden shadow-sm">
              <div className="p-5 border-b border-surface-border flex items-center justify-between">
                <h2 className="font-extrabold text-base text-dark">My Equipment Listings</h2>
                <button
                  onClick={() => setActiveTab('new-listing')}
                  className="px-3.5 py-1.5 rounded-xl bg-lime font-bold text-xs text-dark hover:bg-lime-500 shadow-sm inline-flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              {products.length === 0 ? (
                <div className="py-16 text-center text-dark-muted">
                  <p className="text-sm font-semibold">You have no listings yet.</p>
                  <button
                    onClick={() => setActiveTab('new-listing')}
                    className="mt-3 px-5 py-2 rounded-xl bg-lime font-bold text-xs text-dark"
                  >
                    Create Your First Listing
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-ivory/60 text-dark-muted font-bold uppercase tracking-wider border-b border-surface-border">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Sport</th>
                        <th className="p-4">Condition</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-ivory/20">
                          <td className="p-4 font-bold text-dark max-w-xs truncate">
                            <Link href={`/products/${p.slug}`} className="hover:text-olive">
                              {p.title}
                            </Link>
                          </td>
                          <td className="p-4 text-dark-muted">{p.sportName}</td>
                          <td className="p-4">
                            <ConditionBadge condition={p.condition} isPreOwned={p.isPreOwned} />
                          </td>
                          <td className="p-4 font-black text-dark">{formatPrice(p.sellingPrice)}</td>
                          <td className="p-4 font-bold text-dark">{p.stockQuantity}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleStatus(p.id)}
                              className="p-1 text-dark-muted hover:text-dark rounded-md"
                              title="Toggle status"
                            >
                              {p.status === 'ACTIVE' ? <PauseCircle className="w-4 h-4 text-amber-600" /> : <PlayCircle className="w-4 h-4 text-emerald-600" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* NEW LISTING FORM */
          <div className="max-w-3xl mx-auto bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-premium space-y-6">
            <div>
              <h2 className="text-2xl font-black text-dark">List New Sports Equipment</h2>
              <p className="text-xs text-dark-muted mt-0.5">Fill out equipment details accurately to ensure quick verification</p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Equipment Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. MRF Grand Edition English Willow Bat (Grade 1)"
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Sport *</label>
                  <select
                    required
                    value={formSportId}
                    onChange={(e) => setFormSportId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  >
                    <option value="">Select Sport</option>
                    {sports.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Category *</label>
                  <select
                    required
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  >
                    <option value="">Select Category</option>
                    {categories
                      .filter((c) => !formSportId || c.sportId === Number(formSportId))
                      .map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Brand</label>
                  <select
                    value={formBrandId}
                    onChange={(e) => setFormBrandId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  >
                    <option value="">Select Brand (Optional)</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Condition Rating *</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as ProductCondition)}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  >
                    <option value="BRAND_NEW">Brand New (Factory Sealed)</option>
                    <option value="LIKE_NEW">Like New (1-3 practice games)</option>
                    <option value="EXCELLENT">Excellent (Light cosmetic scuffs)</option>
                    <option value="GOOD">Good (Match tested wear)</option>
                    <option value="FAIR">Fair (Visible scuffs / practice gear)</option>
                  </select>
                </div>
              </div>

              {/* Pre-owned specific inputs */}
              {formCondition !== 'BRAND_NEW' && (
                <div className="p-4 rounded-2xl bg-ivory border border-lime-300 space-y-3">
                  <span className="text-xs font-bold text-olive uppercase tracking-wider block">
                    Pre-Owned Wear Declaration
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-dark-muted block mb-1">Usage Duration (Months)</label>
                      <input
                        type="number"
                        min="0"
                        value={formUsageMonths}
                        onChange={(e) => setFormUsageMonths(Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-muted block mb-1">Wear & Teardown Notes *</label>
                      <input
                        type="text"
                        value={formWearDetails}
                        onChange={(e) => setFormWearDetails(e.target.value)}
                        placeholder="e.g. Scuff sheet applied, no cracks on toe"
                        className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(e.target.value)}
                    placeholder="11999"
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Original Price / MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="18500"
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  />
                </div>
              </div>

              {/* Size & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Sizes / Specs (Comma separated)</label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    placeholder="SH, 4U/G5, UK 9, Size 5"
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">Location City</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Bengaluru, India"
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-dark block mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
                <p className="text-[10px] text-dark-muted mt-1">Provide image URL or test asset link.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-dark block mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe willow grade, balance, string tension, match history, or warranty details..."
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="flex-1 py-3 rounded-2xl border border-surface-border font-bold text-xs text-dark hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="flex-1 py-3 rounded-2xl bg-lime hover:bg-lime-500 font-black text-xs text-dark shadow-sm transition-all"
                >
                  {submittingProduct ? 'Publishing Equipment...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

