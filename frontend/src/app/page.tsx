'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Tag,
  CheckCircle2,
  Users,
  Flame,
  Clock,
  Percent,
  Star,
  Award,
  Send,
  Check
} from 'lucide-react';
import { catalogApi, productApi, clubApi } from '@/lib/api';
import { ProductSummary, Sport, Club, Brand } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';
import { RatingStars } from '@/components/common/RatingStars';

// All 12 Sports with high-resolution photography
const ALL_SPORTS: Sport[] = [
  { id: 1, name: 'Cricket', slug: 'cricket', iconUrl: '🏏', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800', displayOrder: 1 },
  { id: 2, name: 'Football', slug: 'football', iconUrl: '⚽', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', displayOrder: 2 },
  { id: 3, name: 'Badminton', slug: 'badminton', iconUrl: '🏸', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', displayOrder: 3 },
  { id: 4, name: 'Tennis', slug: 'tennis', iconUrl: '🎾', imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800', displayOrder: 4 },
  { id: 5, name: 'Basketball', slug: 'basketball', iconUrl: '🏀', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', displayOrder: 5 },
  { id: 6, name: 'Volleyball', slug: 'volleyball', iconUrl: '🏐', imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800', displayOrder: 6 },
  { id: 7, name: 'Fitness & Gym', slug: 'fitness', iconUrl: '🏋️', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800', displayOrder: 7 },
  { id: 8, name: 'Running', slug: 'running', iconUrl: '🏃', imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', displayOrder: 8 },
  { id: 9, name: 'Swimming', slug: 'swimming', iconUrl: '🏊', imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', displayOrder: 9 },
  { id: 10, name: 'Hockey', slug: 'hockey', iconUrl: '🏑', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800', displayOrder: 10 },
  { id: 11, name: 'Table Tennis', slug: 'table-tennis', iconUrl: '🏓', imageUrl: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800', displayOrder: 11 },
  { id: 12, name: 'Other Sports', slug: 'other-sports', iconUrl: '🎯', imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800', displayOrder: 12 },
];

const FEATURED_BRANDS = [
  { name: 'MRF', slug: 'mrf', logo: '🏏', category: 'Cricket Willows' },
  { name: 'SG', slug: 'sg', logo: '🏏', category: 'Cricket Match Gear' },
  { name: 'Yonex', slug: 'yonex', logo: '🏸', category: 'Badminton & Tennis' },
  { name: 'Nike', slug: 'nike', logo: '⚽', category: 'Football & Running' },
  { name: 'Wilson', slug: 'wilson', logo: '🎾', category: 'Tennis & Basketball' },
  { name: 'Kookaburra', slug: 'kookaburra', logo: '🏏', category: 'Pro Cricket Willows' },
  { name: 'Nivia', slug: 'nivia', logo: '⚽', category: 'Match Balls & Accessories' },
];

export default function HomePage() {
  const [sports, setSports] = useState<Sport[]>(ALL_SPORTS);
  const [trendingProducts, setTrendingProducts] = useState<ProductSummary[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductSummary[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductSummary[]>([]);
  const [preOwnedProducts, setPreOwnedProducts] = useState<ProductSummary[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<ProductSummary[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // Newsletter State
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [sportsRes, trendingRes, preOwnedRes, clubsRes] = await Promise.allSettled([
          catalogApi.getSports(),
          productApi.getProducts({ size: 12 }),
          productApi.getPreOwnedProducts(0, 8),
          clubApi.getAll(),
        ]);

        if (sportsRes.status === 'fulfilled' && sportsRes.value.length > 0) {
          setSports(sportsRes.value);
        }

        if (trendingRes.status === 'fulfilled' && trendingRes.value.content) {
          const list = trendingRes.value.content;
          setTrendingProducts(list.slice(0, 4));
          setBestSellers(list.slice(2, 6));
          setNewArrivals(list.slice(4, 8));
          setFeaturedDeals(list.filter(p => (p.discountPercentage || 0) > 10).slice(0, 4));
        }

        if (preOwnedRes.status === 'fulfilled' && preOwnedRes.value.content) {
          setPreOwnedProducts(preOwnedRes.value.content.slice(0, 4));
        }

        if (clubsRes.status === 'fulfilled') {
          setClubs(clubsRes.value.slice(0, 3));
        }
      } catch (err) {
        console.error('Home data load error', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      
      {/* =========================================================
          1. HERO BANNER
      ========================================================= */}
      <section className="relative overflow-hidden bg-ivory border-b border-surface-border">
        {/* Subtle decorative lime gradients */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-lime/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-olive/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-white border border-surface-border shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-olive">
                  GEAR. PLAY. REPEAT.
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-dark tracking-tight leading-[1.06]">
                Your Game. <br />
                <span className="text-olive">Your Gear.</span>
              </h1>

              <p className="text-base sm:text-xl text-dark-muted font-medium max-w-xl leading-relaxed">
                Discover the equipment that takes your game further. Shop new and pre-owned sports gear at great prices.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-8 py-4 rounded-2xl bg-lime hover:bg-lime-500 text-dark font-black text-base transition-all shadow-md active:scale-95 flex items-center gap-2.5"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5 text-dark" />
                </Link>

                <Link
                  href="/seller"
                  className="px-8 py-4 rounded-2xl bg-surface-white hover:bg-ivory text-dark font-black text-base border-2 border-surface-border transition-all active:scale-95 flex items-center gap-2.5 shadow-sm"
                >
                  <span>Sell Your Gear</span>
                  <Tag className="w-5 h-5 text-olive" />
                </Link>
              </div>

              {/* Value Badges */}
              <div className="pt-6 border-t border-surface-border flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-dark font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-olive" />
                  <span>100% Verified Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-olive" />
                  <span>0% Buyer Platform Fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-olive" />
                  <span>Circular Sports Economy</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-surface-white bg-ivory">
                <Image
                  src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200"
                  alt="Professional match cricket equipment and sports gear"
                  fill
                  priority
                  className="object-cover"
                />
                
                {/* Floating Tag 1 */}
                <div className="absolute top-4 left-4 bg-surface-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-surface-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime/40 border border-lime flex items-center justify-center font-black text-dark text-lg">
                    🏏
                  </div>
                  <div>
                    <p className="text-xs font-black text-dark">Verified Match Gear</p>
                    <p className="text-[11px] text-olive font-extrabold">Save up to 50% vs MRP</p>
                  </div>
                </div>

                {/* Floating Tag 2 */}
                <div className="absolute bottom-4 right-4 bg-surface-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-surface-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-olive text-surface-white flex items-center justify-center font-black text-sm">
                    12+
                  </div>
                  <div>
                    <p className="text-xs font-black text-dark">Multi-Sport Catalog</p>
                    <p className="text-[11px] text-dark-muted font-bold">Badminton, Football & Tennis</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          2. SHOP BY SPORTS (12 Sports Disciplines with Photography)
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-olive mb-1">Athletic Disciplines</p>
              <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">Shop by Sport</h2>
            </div>
            <Link
              href="/sports"
              className="text-xs sm:text-sm font-extrabold text-olive hover:underline inline-flex items-center gap-1"
            >
              All Sports Directory <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {sports.map((sport) => (
              <Link
                key={sport.slug}
                href={`/sports/${sport.slug}`}
                className="group relative flex flex-col p-4 rounded-2xl bg-ivory/50 border border-surface-border hover:border-lime hover:bg-surface-white hover:shadow-premium transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-surface-border/50">
                  <Image
                    src={sport.imageUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400'}
                    alt={sport.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/10 transition-colors" />
                  <span className="absolute bottom-1.5 left-1.5 text-lg drop-shadow">{sport.iconUrl || '🏅'}</span>
                </div>
                <h3 className="font-extrabold text-sm text-dark group-hover:text-olive transition-colors">
                  {sport.name}
                </h3>
                <p className="text-[11px] text-dark-muted font-semibold mt-0.5 flex items-center justify-between">
                  <span>Explore Gear</span>
                  <span className="text-olive">&rarr;</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          3. TRENDING PRODUCTS
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-ivory/30 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-olive mb-1">
                <TrendingUp className="w-4 h-4 text-olive" />
                <span>What Athletes Are Buying</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">Trending Equipment</h2>
            </div>
            <Link
              href="/products?sortBy=popularity"
              className="text-xs sm:text-sm font-extrabold text-olive hover:underline inline-flex items-center gap-1"
            >
              See All Trending <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.length > 0
              ? trendingProducts.map((p) => <ProductCard key={p.id} product={p} />)
              : [1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-ivory animate-pulse" />
                ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          4. BEST SELLERS
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-olive mb-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Highest Rated & Match-Proven</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">Best Sellers</h2>
            </div>
            <Link
              href="/products?sortBy=rating"
              className="text-xs sm:text-sm font-extrabold text-olive hover:underline inline-flex items-center gap-1"
            >
              Shop Best Sellers <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          5. NEW ARRIVALS
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-ivory/40 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-olive mb-1">
                <Clock className="w-4 h-4 text-lime-600" />
                <span>Just Listed On Marketplace</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">New Arrivals</h2>
            </div>
            <Link
              href="/products?sortBy=createdAt"
              className="text-xs sm:text-sm font-extrabold text-olive hover:underline inline-flex items-center gap-1"
            >
              View All New <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          6. CERTIFIED PRE-OWNED EQUIPMENT (Flagship Hub)
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-ivory border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-white rounded-3xl p-6 sm:p-10 border border-surface-border shadow-premium">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime/40 border border-lime text-dark text-xs font-extrabold uppercase tracking-wider">
                  <RotateCcw className="w-3.5 h-3.5 text-olive" />
                  <span>Circular Sports Marketplace</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">
                  Certified Pre-Owned Collection
                </h2>
                <p className="text-sm sm:text-base text-dark-muted max-w-2xl font-medium">
                  Every pre-loved item is authenticated with wear descriptions and inspection ratings. Get premium tournament-grade equipment at 30% to 60% below retail MRP.
                </p>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  href="/pre-owned"
                  className="px-6 py-3.5 rounded-2xl bg-olive text-surface-white font-extrabold text-sm hover:bg-olive/90 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Explore Pre-Owned Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Pre-owned Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {preOwnedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          7. FEATURED DEALS (Discount Highlights)
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-olive mb-1">
                <Percent className="w-4 h-4 text-olive" />
                <span>Special Clearance & Offers</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">Featured Deals</h2>
            </div>
            <Link
              href="/products?hasDiscount=true"
              className="text-xs sm:text-sm font-extrabold text-olive hover:underline inline-flex items-center gap-1"
            >
              Browse All Deals <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDeals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          8. SHOP BY BRAND
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-ivory/50 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-olive mb-1">Top Sports Manufacturers</p>
            <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">Shop by Brand</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {FEATURED_BRANDS.map((b) => (
              <Link
                key={b.slug}
                href={`/products?brand=${b.slug}`}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-surface-white border border-surface-border hover:border-lime hover:shadow-premium transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-ivory flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                  {b.logo}
                </div>
                <h4 className="font-extrabold text-sm text-dark group-hover:text-olive">{b.name}</h4>
                <p className="text-[10px] text-dark-muted font-medium mt-0.5">{b.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          9. FEATURED SPORTS CLUBS
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-olive mb-1">
                <Users className="w-4 h-4 text-olive" />
                <span>Verified Academies & Community</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">Featured Sports Clubs</h2>
            </div>
            <Link
              href="/clubs"
              className="text-xs sm:text-sm font-extrabold text-olive hover:underline inline-flex items-center gap-1"
            >
              Browse All Clubs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="flex flex-col bg-ivory/40 rounded-2xl border border-surface-border overflow-hidden hover:shadow-premium transition-all p-6"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-white border border-surface-border flex-shrink-0">
                    <Image
                      src={club.logoUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300'}
                      alt={club.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-dark line-clamp-1">{club.name}</h3>
                    <p className="text-xs text-dark-muted font-semibold">{club.city}, {club.state}</p>
                  </div>
                </div>

                <p className="text-xs text-dark-muted line-clamp-2 mb-4 font-medium leading-relaxed">
                  {club.description}
                </p>

                <div className="mt-auto pt-3 border-t border-surface-border flex items-center justify-between">
                  <span className="text-xs font-bold text-olive">
                    {club.memberCount} Members
                  </span>
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="text-xs font-extrabold text-dark hover:text-olive inline-flex items-center gap-1"
                  >
                    View Club Hub &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          10. WHY CHOOSE SPORTCYCLE?
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-ivory/60 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-olive mb-1">
              The Athlete Advantage
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              Why Choose SportCycle?
            </h2>
            <p className="text-sm text-dark-muted mt-2 font-medium">
              We eliminate counterfeit gear, overpriced equipment, and untrusted second-hand deals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-white p-6 rounded-2xl border border-surface-border shadow-sm text-left">
              <div className="w-12 h-12 rounded-xl bg-lime/40 border border-lime flex items-center justify-center text-dark mb-4">
                <ShieldCheck className="w-6 h-6 text-olive" />
              </div>
              <h3 className="font-extrabold text-base text-dark mb-1.5">100% Authenticity Verified</h3>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Physical and photographic multi-point wear checks on all pre-owned equipment before dispatch.
              </p>
            </div>

            <div className="bg-surface-white p-6 rounded-2xl border border-surface-border shadow-sm text-left">
              <div className="w-12 h-12 rounded-xl bg-lime/40 border border-lime flex items-center justify-center text-dark mb-4">
                <RotateCcw className="w-6 h-6 text-olive" />
              </div>
              <h3 className="font-extrabold text-base text-dark mb-1.5">Circular Sports Economy</h3>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Give tournament equipment a second innings. Reduce waste and save up to 60% compared to MRP.
              </p>
            </div>

            <div className="bg-surface-white p-6 rounded-2xl border border-surface-border shadow-sm text-left">
              <div className="w-12 h-12 rounded-xl bg-lime/40 border border-lime flex items-center justify-center text-dark mb-4">
                <Award className="w-6 h-6 text-olive" />
              </div>
              <h3 className="font-extrabold text-base text-dark mb-1.5">7-Day Play Guarantee</h3>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Inspect and test your gear on court. If it does not match its verification report, return with zero hassle.
              </p>
            </div>

            <div className="bg-surface-white p-6 rounded-2xl border border-surface-border shadow-sm text-left">
              <div className="w-12 h-12 rounded-xl bg-lime/40 border border-lime flex items-center justify-center text-dark mb-4">
                <Zap className="w-6 h-6 text-olive" />
              </div>
              <h3 className="font-extrabold text-base text-dark mb-1.5">Player-to-Player Fair Trade</h3>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Direct community trade connecting club players, academies, and recreational athletes across India.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          11. HOW SPORTCYCLE WORKS
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-olive mb-1">
              Simple & Transparent
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              How SportCycle Works
            </h2>
            <p className="text-sm text-dark-muted mt-2 font-medium">
              Three easy steps to discover, purchase, and re-circulate quality sporting equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-ivory/50 rounded-3xl p-7 border border-surface-border shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-lime flex items-center justify-center font-black text-dark text-lg mb-4 shadow-sm">
                01
              </div>
              <h3 className="text-lg font-black text-dark mb-2">Discover & Choose</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                Filter across 12 sports, condition tiers from Brand New to Fair, and verified club listings. Inspect actual photographs before purchasing.
              </p>
            </div>

            <div className="bg-ivory/50 rounded-3xl p-7 border border-surface-border shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-olive text-surface-white flex items-center justify-center font-black text-lg mb-4 shadow-sm">
                02
              </div>
              <h3 className="text-lg font-black text-dark mb-2">Verified Authenticity</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                Sellers submit detailed wear descriptions and authentic photos. Verification teams approve listings so you get what you pay for.
              </p>
            </div>

            <div className="bg-ivory/50 rounded-3xl p-7 border border-surface-border shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-lime flex items-center justify-center font-black text-dark text-lg mb-4 shadow-sm">
                03
              </div>
              <h3 className="text-lg font-black text-dark mb-2">Play, Repeat & Sell</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                Outgrown your bat, upgraded your racket, or seasonal switch? Re-list with 0% listing fee and pass it on to a new athlete.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          12. CUSTOMER REVIEWS
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-ivory/40 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-olive mb-1">Real Player Testimonials</p>
            <h2 className="text-2xl sm:text-4xl font-black text-dark tracking-tight">
              Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-dark-muted mt-1 font-medium">
              Verified feedback from club cricketers, tournament badminton players, and runners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col justify-between">
              <div>
                <RatingStars rating={5} showCount={false} />
                <h4 className="font-extrabold text-sm text-dark mt-3 mb-1">
                  &ldquo;Saved ₹7,000 on Grade 1 Willow&rdquo;
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed font-medium">
                  Bought an SG Tonny bat listed under Like-New. It arrived oiled, knocked and pinged like lightning. Best sports gear experience!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="font-extrabold text-dark">Aarav M.</span>
                <span className="text-olive font-bold">Verified Buyer • Cricket</span>
              </div>
            </div>

            <div className="bg-surface-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col justify-between">
              <div>
                <RatingStars rating={5} showCount={false} />
                <h4 className="font-extrabold text-sm text-dark mt-3 mb-1">
                  &ldquo;Sold my Astrox in 48 hours&rdquo;
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed font-medium">
                  The seller onboarding is seamless. Uploaded 3 photos, described string tension, and a local club trainee purchased it without hassles.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="font-extrabold text-dark">Devika R.</span>
                <span className="text-olive font-bold">Verified Seller • Badminton</span>
              </div>
            </div>

            <div className="bg-surface-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col justify-between">
              <div>
                <RatingStars rating={5} showCount={false} />
                <h4 className="font-extrabold text-sm text-dark mt-3 mb-1">
                  &ldquo;Essential academy partner&rdquo;
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed font-medium">
                  Our academy in Bangalore now equips junior trainees with tournament equipment at half the cost. Truly game changing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="font-extrabold text-dark">Coach Vikram</span>
                <span className="text-olive font-bold">Club Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          13. NEWSLETTER
      ========================================================= */}
      <section className="py-14 sm:py-20 bg-olive text-surface-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-lime/20 blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-lime text-dark text-xs font-black uppercase tracking-wider mb-3">
            SportCycle Community
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-surface-white">
            Get ₹500 Off Your First Order
          </h2>
          <p className="text-sm sm:text-base text-surface-white/80 max-w-xl mx-auto mb-8 font-medium">
            Join 25,000+ athletes. Receive weekly alerts for certified pre-owned drops, club clearance deals, and tournament gear tips.
          </p>

          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full sm:w-80 h-12 px-5 rounded-2xl bg-surface-white text-dark text-sm placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-lime font-medium"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-8 bg-lime hover:bg-lime-400 text-dark font-black text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 text-dark" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-dark" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </form>
          <p className="text-[11px] text-surface-white/60 mt-3">No spam. Only gear drops & match equipment discounts. Unsubscribe anytime.</p>
        </div>
      </section>

    </div>
  );
}
