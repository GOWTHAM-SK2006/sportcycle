'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { productApi } from '@/lib/api';
import { ProductSummary, ProductCondition } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';

export default function PreOwnedPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [conditionFilter, setConditionFilter] = useState<ProductCondition | ''>('');

  useEffect(() => {
    setLoading(true);
    productApi.getProducts({
      isPreOwned: true,
      condition: conditionFilter || undefined,
      size: 16,
    })
      .then((res) => setProducts(res.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [conditionFilter]);

  return (
    <div className="bg-surface-white min-h-screen pb-16">
      {/* Hero */}
      <section className="bg-ivory/80 border-b border-surface-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime/40 border border-lime text-xs font-bold uppercase tracking-wider text-dark">
              <RotateCcw className="w-3.5 h-3.5 text-olive" />
              <span>SportCycle Circular Economy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-dark tracking-tight">
              Verified Pre-Owned Gear
            </h1>
            <p className="text-sm sm:text-base text-dark-muted leading-relaxed">
              Play with premium equipment at up to 60% off retail prices. Every piece undergoes a multi-point inspection for structural integrity, genuine materials, and true condition ratings.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/seller"
                className="px-6 py-3 rounded-2xl bg-olive text-surface-white font-bold text-xs hover:bg-olive/90 shadow-sm flex items-center gap-2"
              >
                <span>List Your Used Gear</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#condition-guide"
                className="px-6 py-3 rounded-2xl bg-surface-white border border-surface-border font-bold text-xs text-dark hover:bg-ivory"
              >
                Condition Rating Guide
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Condition Rating Guide Section */}
      <section id="condition-guide" className="py-12 bg-surface-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-black text-dark mb-6">
            Condition Rating Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-xs font-black text-emerald-900 px-2 py-0.5 rounded bg-emerald-200 uppercase">
                Brand New
              </span>
              <h3 className="font-bold text-sm text-dark mt-2 mb-1">Factory Sealed</h3>
              <p className="text-[11px] text-dark-muted">Unopened with original packaging, tags, holograms, and zero court or field usage.</p>
            </div>

            <div className="p-4 rounded-2xl bg-lime-50/60 border border-lime-200">
              <span className="text-xs font-black text-lime-900 px-2 py-0.5 rounded bg-lime-200 uppercase">
                Like New
              </span>
              <h3 className="font-bold text-sm text-dark mt-2 mb-1">Flawless</h3>
              <p className="text-[11px] text-dark-muted">Used 1–3 times only in practice nets or indoor courts. Clean face, no chips, zero toe cracks.</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
              <span className="text-xs font-black text-blue-900 px-2 py-0.5 rounded bg-blue-200 uppercase">
                Excellent
              </span>
              <h3 className="font-bold text-sm text-dark mt-2 mb-1">Light Wear</h3>
              <p className="text-[11px] text-dark-muted">Light cosmetic scuffs or small paint blemishes. 100% sound frame, strings, or handle cane.</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <span className="text-xs font-black text-amber-900 px-2 py-0.5 rounded bg-amber-200 uppercase">
                Good
              </span>
              <h3 className="font-bold text-sm text-dark mt-2 mb-1">Match Tested</h3>
              <p className="text-[11px] text-dark-muted">Normal ball marks, grip wear, or cosmetic turf discoloration. Fully ready for competitive club games.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-black text-stone-900 px-2 py-0.5 rounded bg-stone-200 uppercase">
                Fair
              </span>
              <h3 className="font-bold text-sm text-dark mt-2 mb-1">Budget Friendly</h3>
              <p className="text-[11px] text-dark-muted">Visible surface wear and scratches but completely functional. Ideal for beginner practice and drills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setConditionFilter('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                conditionFilter === '' ? 'bg-olive text-surface-white' : 'bg-ivory text-dark border border-surface-border'
              }`}
            >
              All Conditions
            </button>
            <button
              onClick={() => setConditionFilter('LIKE_NEW')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                conditionFilter === 'LIKE_NEW' ? 'bg-olive text-surface-white' : 'bg-ivory text-dark border border-surface-border'
              }`}
            >
              Like New
            </button>
            <button
              onClick={() => setConditionFilter('EXCELLENT')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                conditionFilter === 'EXCELLENT' ? 'bg-olive text-surface-white' : 'bg-ivory text-dark border border-surface-border'
              }`}
            >
              Excellent
            </button>
            <button
              onClick={() => setConditionFilter('GOOD')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                conditionFilter === 'GOOD' ? 'bg-olive text-surface-white' : 'bg-ivory text-dark border border-surface-border'
              }`}
            >
              Good
            </button>
          </div>
          <span className="text-xs font-semibold text-dark-muted">{products.length} Items Found</span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-ivory animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center bg-ivory/30 rounded-3xl border border-surface-border p-8">
            <RotateCcw className="w-10 h-10 text-olive mx-auto mb-2 opacity-60" />
            <h3 className="font-bold text-dark">No pre-owned equipment found in this filter</h3>
            <p className="text-xs text-dark-muted mt-1">Check back soon or list your own equipment for cash!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

