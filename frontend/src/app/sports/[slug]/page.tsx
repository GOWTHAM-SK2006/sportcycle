'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight, PackageOpen } from 'lucide-react';
import { catalogApi, productApi } from '@/lib/api';
import { Sport, ProductSummary } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';

export default function SportDetailPage() {
  const { slug } = useParams();
  const [sport, setSport] = useState<Sport | null>(null);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([
      catalogApi.getSportBySlug(String(slug)),
      productApi.getProducts({ sportSlug: String(slug), size: 12 }),
    ])
      .then(([sportData, prodData]) => {
        setSport(sportData);
        setProducts(prodData.content || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-40 bg-ivory rounded-3xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-80 bg-ivory rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Sport Not Found</h2>
        <Link href="/sports" className="text-olive underline mt-2 block">Back to Sports</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-white min-h-screen pb-16">
      {/* Sport Hero */}
      <div className="relative bg-ivory border-b border-surface-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-dark-muted mb-3">
            <Link href="/sports" className="hover:text-dark">Sports</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-dark">{sport.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{sport.iconUrl || '🏅'}</span>
                <h1 className="text-3xl sm:text-5xl font-black text-dark">{sport.name} Gear</h1>
              </div>
              <p className="text-sm sm:text-base text-dark-muted max-w-xl">{sport.description}</p>
            </div>

            <Link
              href={`/products?sportSlug=${sport.slug}`}
              className="px-6 py-3 rounded-2xl bg-lime font-black text-xs text-dark hover:bg-lime-500 shadow-sm inline-flex items-center gap-2 self-start"
            >
              <span>Explore All {sport.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Subcategories Pills */}
          {sport.categories && sport.categories.length > 0 && (
            <div className="mt-8 pt-6 border-t border-surface-border/80">
              <p className="text-xs font-bold uppercase tracking-wider text-dark-muted mb-3">Subcategories</p>
              <div className="flex flex-wrap gap-2">
                {sport.categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?categorySlug=${c.slug}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-white text-dark hover:bg-lime/30 border border-surface-border shadow-sm transition-all"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Equipment Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-black text-dark mb-6">Popular {sport.name} Equipment</h2>

        {products.length === 0 ? (
          <div className="py-16 text-center bg-ivory/40 rounded-3xl border border-surface-border p-8">
            <PackageOpen className="w-10 h-10 text-olive mx-auto mb-2 opacity-60" />
            <h3 className="font-bold text-dark">No products currently listed</h3>
            <p className="text-xs text-dark-muted mt-1">Be the first to list gear in {sport.name}!</p>
            <Link href="/seller" className="mt-4 inline-block px-5 py-2 rounded-xl bg-lime text-dark font-bold text-xs">
              List Gear Now
            </Link>
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

