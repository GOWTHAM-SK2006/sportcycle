'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { catalogApi } from '@/lib/api';
import { Sport } from '@/types';

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogApi.getSports()
      .then(setSports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface-white min-h-screen pb-16">
      <div className="bg-ivory/60 border-b border-surface-border py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-olive mb-1">
            Browse Disciplines
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-dark tracking-tight">
            All 12 Sports & Categories
          </h1>
          <p className="text-sm sm:text-base text-dark-muted mt-2 max-w-xl">
            Choose your sport to explore pro match equipment, practice accessories, and academy kits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sports.map((sport) => (
            <div
              key={sport.id}
              className="group relative flex flex-col rounded-3xl bg-surface-white border border-surface-border overflow-hidden hover:shadow-premium transition-all duration-300 hover:border-lime"
            >
              <div className="relative h-48 w-full bg-ivory">
                <Image
                  src={sport.imageUrl || 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=600'}
                  alt={sport.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-surface-white">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{sport.iconUrl || '🏅'}</span>
                    <h2 className="text-xl font-black text-surface-white">{sport.name}</h2>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-dark-muted line-clamp-2">
                  {sport.description}
                </p>

                {sport.categories && sport.categories.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-surface-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Popular Gear:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sport.categories.slice(0, 4).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?categorySlug=${cat.slug}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-ivory text-dark hover:bg-lime/30 border border-surface-border/60 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/sports/${sport.slug}`}
                    className="text-xs font-bold text-dark hover:text-olive flex items-center gap-1"
                  >
                    View Subcategories &rarr;
                  </Link>

                  <Link
                    href={`/products?sportSlug=${sport.slug}`}
                    className="px-4 py-2 rounded-xl bg-lime text-dark font-extrabold text-xs hover:bg-lime-500 shadow-sm transition-all"
                  >
                    Shop All {sport.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

