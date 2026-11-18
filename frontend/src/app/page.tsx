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
  Award,
  ChevronRight,
  TrendingUp,
  Tag,
  CheckCircle2,
  Users
} from 'lucide-react';
import { catalogApi, productApi, clubApi } from '@/lib/api';
import { ProductSummary, Sport, Club } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';
import { RatingStars } from '@/components/common/RatingStars';

// Initial fallback sports for instant rendering
const FALLBACK_SPORTS: Sport[] = [
  { id: 1, name: 'Cricket', slug: 'cricket', iconUrl: '🏏', imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=600', displayOrder: 1 },
  { id: 2, name: 'Football', slug: 'football', iconUrl: '⚽', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600', displayOrder: 2 },
  { id: 3, name: 'Badminton', slug: 'badminton', iconUrl: '🏸', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600', displayOrder: 3 },
  { id: 4, name: 'Tennis', slug: 'tennis', iconUrl: '🎾', imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600', displayOrder: 4 },
  { id: 5, name: 'Basketball', slug: 'basketball', iconUrl: '🏀', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600', displayOrder: 5 },
  { id: 6, name: 'Volleyball', slug: 'volleyball', iconUrl: '🏐', imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600', displayOrder: 6 },
  { id: 7, name: 'Running', slug: 'running', iconUrl: '🏃', imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600', displayOrder: 7 },
  { id: 8, name: 'Fitness & Gym', slug: 'fitness', iconUrl: '🏋️', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600', displayOrder: 8 },
  { id: 9, name: 'Swimming', slug: 'swimming', iconUrl: '🏊', imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600', displayOrder: 9 },
  { id: 10, name: 'Hockey', slug: 'hockey', iconUrl: '🏑', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=600', displayOrder: 10 },
  { id: 11, name: 'Table Tennis', slug: 'table-tennis', iconUrl: '🏓', imageUrl: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600', displayOrder: 11 },
  { id: 12, name: 'Other Sports', slug: 'other-sports', iconUrl: '🎯', imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600', displayOrder: 12 },
];

export default function HomePage() {
  const [sports, setSports] = useState<Sport[]>(FALLBACK_SPORTS);
  const [featuredProducts, setFeaturedProducts] = useState<ProductSummary[]>([]);
  const [preOwnedProducts, setPreOwnedProducts] = useState<ProductSummary[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductSummary[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sportsRes, featuredRes, preOwnedRes, trendingRes, clubsRes] = await Promise.allSettled([
          catalogApi.getSports(),
          productApi.getFeaturedProducts(),
          productApi.getPreOwnedProducts(0, 4),
          productApi.getProducts({ sortBy: 'popularity', size: 4 }),
          clubApi.getAll(),
        ]);

        if (sportsRes.status === 'fulfilled' && sportsRes.value.length > 0) {
          setSports(sportsRes.value);
        }
        if (featuredRes.status === 'fulfilled') {
          setFeaturedProducts(featuredRes.value);
        }
        if (preOwnedRes.status === 'fulfilled') {
          setPreOwnedProducts(preOwnedRes.value.content || []);
        }
        if (trendingRes.status === 'fulfilled') {
          setTrendingProducts(trendingRes.value.content || []);
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

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-ivory/80 border-b border-surface-border">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 right-5 w-96 h-96 rounded-full bg-lime/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 left-10 w-80 h-80 rounded-full bg-olive/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-white border border-surface-border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-olive">
                  India’s #1 Multi-Sport Marketplace
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-dark tracking-tight leading-[1.08]">
                Your Game. <br />
                <span className="text-olive">Your Gear.</span>
              </h1>

              <p className="text-base sm:text-xl text-dark-muted font-normal max-w-xl leading-relaxed">
                Discover quality sports equipment, find great deals and give pre-loved gear a new game. Handcrafted bats, pro racquets, certified academy equipment, and athlete exchanges.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-lime hover:bg-lime-500 text-dark font-extrabold text-sm sm:text-base transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/seller"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-surface-white hover:bg-ivory text-dark font-bold text-sm sm:text-base border border-surface-border transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Sell Your Gear</span>
                  <Tag className="w-4 h-4 text-olive" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-surface-border/80 flex flex-wrap items-center gap-6 text-xs text-dark font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-olive" />
                  <span>Verified Pre-Owned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-olive" />
                  <span>0% Buyer Fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-olive" />
                  <span>Circular Sports Economy</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-surface-white bg-ivory">
                <Image
                  src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1200"
                  alt="English willow cricket bat and tournament equipment"
                  fill
                  priority
                  className="object-cover"
                />
                {/* Floating pill: Pre-Owned Certified */}
                <div className="absolute top-4 left-4 bg-surface-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-surface-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-lime/40 border border-lime flex items-center justify-center font-bold text-olive">
                    🏏
                  </div>
                  <div>
                    <p className="text-xs font-bold text-dark">Verified Match Willow</p>
                    <p className="text-[10px] text-dark-muted">Save 45% vs retail MRP</p>
                  </div>
                </div>

                {/* Floating pill: 12 Sports */}
                <div className="absolute bottom-4 right-4 bg-surface-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-surface-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-olive text-surface-white flex items-center justify-center font-bold text-xs">
                    12+
                  </div>
                  <div>
                    <p className="text-xs font-bold text-dark">Multi-Sport Marketplace</p>
                    <p className="text-[10px] text-olive font-semibold">Cricket, Football, Tennis & more</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY SPORT (All 12 Sports with responsive scroll) */}
      <section className="py-12 sm:py-16 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-olive mb-1">Explore Disciplines</p>
              <h2 className="text-2xl sm:text-3xl font-black text-dark">Shop by Sport</h2>
            </div>
            <Link
              href="/sports"
              className="text-xs sm:text-sm font-bold text-olive hover:underline inline-flex items-center gap-1"
            >
              All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {sports.map((sport) => (
              <Link
                key={sport.slug}
                href={`/products?sportSlug=${sport.slug}`}
                className="group relative flex flex-col p-4 rounded-2xl bg-ivory/50 border border-surface-border hover:border-lime hover:bg-surface-white hover:shadow-premium transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-white shadow-sm flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  {sport.iconUrl || '🏅'}
                </div>
                <h3 className="font-bold text-sm text-dark group-hover:text-olive transition-colors">
                  {sport.name}
                </h3>
                <p className="text-[11px] text-dark-muted mt-0.5">Explore Gear &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="py-12 sm:py-16 bg-ivory/30 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-olive mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>What Athletes Are Buying</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-dark">Trending Equipment</h2>
            </div>
            <Link
              href="/products?sortBy=popularity"
              className="text-xs sm:text-sm font-bold text-olive hover:underline inline-flex items-center gap-1"
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

      {/* 4. FEATURED EQUIPMENT */}
      <section className="py-12 sm:py-16 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-olive mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Hand-Selected Pro Quality</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-dark">Featured Equipment</h2>
            </div>
            <Link
              href="/products?isFeatured=true"
              className="text-xs sm:text-sm font-bold text-olive hover:underline inline-flex items-center gap-1"
            >
              Browse All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRE-OWNED COLLECTION (Highlight of SportCycle Circular Marketplace) */}
      <section className="py-14 sm:py-20 bg-ivory/70 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-white rounded-3xl p-6 sm:p-10 border border-surface-border shadow-premium">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime/40 border border-lime text-dark text-xs font-bold uppercase tracking-wider">
                  <RotateCcw className="w-3.5 h-3.5 text-olive" />
                  <span>Circular Sports Marketplace</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-dark">
                  Certified Pre-Owned Collection
                </h2>
                <p className="text-sm sm:text-base text-dark-muted max-w-2xl">
                  Each pre-owned item is physically checked by verified academies or independent technicians. Real wear ratings, condition breakdown, and full transparency.
                </p>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  href="/pre-owned"
                  className="px-6 py-3.5 rounded-2xl bg-olive text-surface-white font-bold text-sm hover:bg-olive/90 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Explore Pre-Owned Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Pre-owned grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {preOwnedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FEATURED CLUBS MARKETPLACE */}
      <section className="py-12 sm:py-16 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-olive mb-1">
                <Users className="w-4 h-4" />
                <span>Sports Academies & Clubs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-dark">Featured Sports Clubs</h2>
            </div>
            <Link
              href="/clubs"
              className="text-xs sm:text-sm font-bold text-olive hover:underline inline-flex items-center gap-1"
            >
              Browse All Clubs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="flex flex-col bg-ivory/40 rounded-2xl border border-surface-border overflow-hidden hover:shadow-premium transition-all p-5"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-white border border-surface-border flex-shrink-0">
                    <Image
                      src={club.logoUrl || 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=300'}
                      alt={club.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-dark line-clamp-1">{club.name}</h3>
                    <p className="text-xs text-dark-muted">{club.city}, {club.state}</p>
                  </div>
                </div>

                <p className="text-xs text-dark-muted line-clamp-2 mb-4">
                  {club.description}
                </p>

                <div className="mt-auto pt-3 border-t border-surface-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-olive">
                    {club.memberCount} Trainees & Members
                  </span>
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="text-xs font-bold text-dark hover:text-olive inline-flex items-center gap-1"
                  >
                    View Gear &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 & 10. WHY SPORTCYCLE & HOW IT WORKS */}
      <section className="py-14 sm:py-20 bg-ivory/50 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-extrabold uppercase tracking-widest text-olive mb-1">
              Engineered For Athletes
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-dark">
              How SportCycle Works
            </h2>
            <p className="text-sm text-dark-muted mt-2">
              The simplest, most trustworthy way to upgrade your gear and monetize unused sports equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-surface-white rounded-3xl p-6 border border-surface-border shadow-card relative">
              <div className="w-12 h-12 rounded-2xl bg-lime flex items-center justify-center font-black text-dark text-lg mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">Discover & Choose</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Filter across 12 sports, condition levels from Brand New to Fair, and verified club listings. Inspect real wear details before committing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-white rounded-3xl p-6 border border-surface-border shadow-card relative">
              <div className="w-12 h-12 rounded-2xl bg-olive text-surface-white flex items-center justify-center font-black text-lg mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">Verified Authenticity</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Sellers submit detailed wear descriptions and authentic photos. Verification teams approve listings so you get what you pay for.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-white rounded-3xl p-6 border border-surface-border shadow-card relative">
              <div className="w-12 h-12 rounded-2xl bg-lime flex items-center justify-center font-black text-dark text-lg mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">Play, Repeat & Sell</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Outgrown your bat, upgraded your racquet, or seasonal gear switch? Re-list with 0% listing fee and pass it on to a new athlete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CUSTOMER REVIEWS */}
      <section className="py-12 sm:py-16 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-dark">
              What Athletes Say
            </h2>
            <p className="text-xs sm:text-sm text-dark-muted mt-1">
              Verified customer reviews from Indian club cricketers, badminton players, and runners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ivory/40 p-6 rounded-2xl border border-surface-border flex flex-col justify-between">
              <div>
                <RatingStars rating={5} showCount={false} />
                <h4 className="font-bold text-sm text-dark mt-3 mb-1">
                  &ldquo;Saved ₹7,000 on Grade 1 Willow&rdquo;
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Bought an SG Tonny bat listed under Like-New. It arrived oiled, knocked and pinged like lightning. Best sports gear experience!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-border/80 flex items-center justify-between text-xs">
                <span className="font-bold text-dark">Aarav M.</span>
                <span className="text-olive font-semibold">Verified Buyer • Cricket</span>
              </div>
            </div>

            <div className="bg-ivory/40 p-6 rounded-2xl border border-surface-border flex flex-col justify-between">
              <div>
                <RatingStars rating={5} showCount={false} />
                <h4 className="font-bold text-sm text-dark mt-3 mb-1">
                  &ldquo;Sold my Astrox in 48 hours&rdquo;
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  The seller onboarding is seamless. Uploaded 3 photos, described string tension, and a local club trainee purchased it without hassles.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-border/80 flex items-center justify-between text-xs">
                <span className="font-bold text-dark">Devika R.</span>
                <span className="text-olive font-semibold">Verified Seller • Badminton</span>
              </div>
            </div>

            <div className="bg-ivory/40 p-6 rounded-2xl border border-surface-border flex flex-col justify-between">
              <div>
                <RatingStars rating={5} showCount={false} />
                <h4 className="font-bold text-sm text-dark mt-3 mb-1">
                  &ldquo;Great club marketplace&rdquo;
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Our academy in Bangalore now equips junior trainees with tournament equipment at half the cost. Truly game changing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-border/80 flex items-center justify-between text-xs">
                <span className="font-bold text-dark">Coach Vikram</span>
                <span className="text-olive font-semibold">Club Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

