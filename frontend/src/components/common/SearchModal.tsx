'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { productApi } from '@/lib/api';
import { ProductSummary } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ConditionBadge } from './ConditionBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SPORTS = [
  { name: 'Cricket', slug: 'cricket', icon: '🏏' },
  { name: 'Football', slug: 'football', icon: '⚽' },
  { name: 'Badminton', slug: 'badminton', icon: '🏸' },
  { name: 'Tennis', slug: 'tennis', icon: '🎾' },
  { name: 'Running', slug: 'running', icon: '🏃' },
  { name: 'Fitness', slug: 'fitness', icon: '🏋️' },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productApi.getProducts({ query: query.trim(), size: 5 });
        setResults(res.content || []);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-20">
      <div className="relative w-full max-w-2xl bg-surface-white rounded-3xl shadow-2xl border border-surface-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-surface-border bg-ivory/40">
          <Search className="w-5 h-5 text-dark-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sports gear, brands, bats, racquets, cleats..."
            className="flex-1 bg-transparent text-dark placeholder-dark-muted font-medium text-base sm:text-lg focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-olive animate-spin" />
          ) : query ? (
            <button onClick={() => setQuery('')} className="p-1 text-dark-muted hover:text-dark">
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={onClose} className="p-1 text-dark-muted hover:text-dark">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Sports Discovery */}
        <div className="p-4 sm:p-6">
          <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3">
            Popular Sports
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {QUICK_SPORTS.map((s) => (
              <Link
                key={s.slug}
                href={`/products?sportSlug=${s.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-ivory text-dark hover:bg-lime/30 border border-surface-border transition-colors"
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
              </Link>
            ))}
          </div>

          {/* Search Results */}
          {query.trim() && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
                  Results ({results.length})
                </p>
                {results.length > 0 && (
                  <Link
                    href={`/products?query=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="text-xs font-semibold text-olive hover:underline inline-flex items-center gap-1"
                  >
                    View all results <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {results.length === 0 && !loading ? (
                <div className="py-8 text-center text-dark-muted">
                  <p className="text-sm font-medium">No equipment found matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs mt-1">Try searching for &quot;cricket&quot;, &quot;badminton&quot;, &quot;boots&quot;, or &quot;racket&quot;</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ivory/60 transition-colors"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-ivory flex-shrink-0">
                        <Image
                          src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=200'}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-olive">{product.sportName}</span>
                          <ConditionBadge condition={product.condition} isPreOwned={product.isPreOwned} />
                        </div>
                        <p className="text-sm font-semibold text-dark truncate">{product.title}</p>
                        <p className="text-xs font-bold text-dark">{formatPrice(product.sellingPrice)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

