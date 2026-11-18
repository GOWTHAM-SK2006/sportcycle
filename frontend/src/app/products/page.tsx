'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Search,
  Check,
  PackageOpen
} from 'lucide-react';
import { productApi, catalogApi } from '@/lib/api';
import { ProductSummary, Sport, Category, Brand, ProductCondition } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';

const CONDITIONS: { label: string; value: ProductCondition }[] = [
  { label: 'Brand New', value: 'BRAND_NEW' },
  { label: 'Like New', value: 'LIKE_NEW' },
  { label: 'Excellent', value: 'EXCELLENT' },
  { label: 'Good', value: 'GOOD' },
  { label: 'Fair', value: 'FAIR' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State filters
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sportSlug') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categorySlug') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brandSlug') || '');
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | ''>(
    (searchParams.get('condition') as ProductCondition) || ''
  );
  const [isPreOwned, setIsPreOwned] = useState<boolean | undefined>(
    searchParams.get('isPreOwned') ? searchParams.get('isPreOwned') === 'true' : undefined
  );
  const [isVerified, setIsVerified] = useState<boolean | undefined>(
    searchParams.get('isVerified') ? searchParams.get('isVerified') === 'true' : undefined
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStockOnly') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recommended');
  const [page, setPage] = useState(0);

  // Data
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sports, setSports] = useState<Sport[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load catalog metadata
  useEffect(() => {
    Promise.all([
      catalogApi.getSports(),
      catalogApi.getCategories(),
      catalogApi.getBrands(),
    ]).then(([s, c, b]) => {
      setSports(s);
      setCategories(c);
      setBrands(b);
    }).catch(console.error);
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        size: 12,
        sortBy,
      };

      if (query.trim()) params.query = query.trim();
      if (selectedSport) params.sportSlug = selectedSport;
      if (selectedCategory) params.categorySlug = selectedCategory;
      if (selectedBrand) params.brandSlug = selectedBrand;
      if (selectedCondition) params.condition = selectedCondition;
      if (isPreOwned !== undefined) params.isPreOwned = isPreOwned;
      if (isVerified !== undefined) params.isVerified = isVerified;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (inStockOnly) params.inStockOnly = true;

      const res = await productApi.getProducts(params);
      setProducts(res.content || []);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  }, [
    query,
    selectedSport,
    selectedCategory,
    selectedBrand,
    selectedCondition,
    isPreOwned,
    isVerified,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    page,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearAllFilters = () => {
    setQuery('');
    setSelectedSport('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedCondition('');
    setIsPreOwned(undefined);
    setIsVerified(undefined);
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('recommended');
    setPage(0);
    router.push('/products');
  };

  const filteredCategories = selectedSport
    ? categories.filter((c) => {
        const sportObj = sports.find((s) => s.slug === selectedSport);
        return sportObj ? c.sportId === sportObj.id : true;
      })
    : categories;

  return (
    <div className="bg-surface-white min-h-screen">
      {/* Top Banner & Title */}
      <div className="bg-ivory/60 border-b border-surface-border py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-olive">
                Sports Equipment Catalog
              </p>
              <h1 className="text-2xl sm:text-4xl font-black text-dark mt-1">
                {selectedSport
                  ? `${sports.find((s) => s.slug === selectedSport)?.name || ''} Gear`
                  : 'All Sports Equipment'}
              </h1>
              <p className="text-xs sm:text-sm text-dark-muted mt-1">
                Showing {totalElements} items across brand-new & verified pre-owned collections
              </p>
            </div>

            {/* Quick Sport Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => { setSelectedSport(''); setPage(0); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  !selectedSport
                    ? 'bg-lime text-dark shadow-sm'
                    : 'bg-surface-white text-dark-muted border border-surface-border hover:bg-ivory'
                }`}
              >
                All Sports
              </button>
              {sports.slice(0, 7).map((s) => (
                <button
                  key={s.slug}
                  onClick={() => { setSelectedSport(s.slug); setPage(0); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSport === s.slug
                      ? 'bg-lime text-dark shadow-sm'
                      : 'bg-surface-white text-dark-muted border border-surface-border hover:bg-ivory'
                  }`}
                >
                  <span className="mr-1">{s.iconUrl}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar: Search Input, Mobile Filter Drawer Button, Sorting Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-border">
          {/* Search box inside page */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
              placeholder="Search gear name, model, willow, weight..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-ivory/30 text-sm focus:outline-none focus:border-olive"
            />
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl border border-surface-border bg-surface-white font-semibold text-xs text-dark inline-flex items-center gap-2 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-olive" />
              <span>Filters</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-dark-muted hidden sm:inline-block">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                className="px-3 py-2 rounded-xl border border-surface-border bg-surface-white text-xs font-semibold text-dark focus:outline-none focus:border-olive shadow-sm cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block space-y-6 pr-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <span className="font-extrabold text-sm text-dark uppercase tracking-wider">Filters</span>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-olive hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Condition Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark mb-3">Product Condition</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-dark cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === ''}
                    onChange={() => { setSelectedCondition(''); setPage(0); }}
                    className="accent-olive"
                  />
                  <span>All Conditions</span>
                </label>
                {CONDITIONS.map((c) => (
                  <label key={c.value} className="flex items-center gap-2 text-xs font-medium text-dark cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      checked={selectedCondition === c.value}
                      onChange={() => { setSelectedCondition(c.value); setPage(0); }}
                      className="accent-olive"
                    />
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pre-Owned & Verified Toggles */}
            <div className="pt-4 border-t border-surface-border space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark mb-2">Marketplace Type</h4>
              <label className="flex items-center gap-2 text-xs font-medium text-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPreOwned === true}
                  onChange={(e) => { setIsPreOwned(e.target.checked ? true : undefined); setPage(0); }}
                  className="rounded accent-olive w-4 h-4"
                />
                <span>Pre-Owned Only</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified === true}
                  onChange={(e) => { setIsVerified(e.target.checked ? true : undefined); setPage(0); }}
                  className="rounded accent-olive w-4 h-4"
                />
                <span>SportCycle Verified Only</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => { setInStockOnly(e.target.checked); setPage(0); }}
                  className="rounded accent-olive w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Subcategories */}
            {filteredCategories.length > 0 && (
              <div className="pt-4 border-t border-surface-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark mb-3">Category</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setSelectedCategory(''); setPage(0); }}
                    className={`block w-full text-left px-2 py-1 rounded-md text-xs font-medium ${
                      !selectedCategory ? 'bg-lime/30 text-dark font-bold' : 'text-dark-muted hover:text-dark'
                    }`}
                  >
                    All Categories
                  </button>
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => { setSelectedCategory(cat.slug); setPage(0); }}
                      className={`block w-full text-left px-2 py-1 rounded-md text-xs font-medium truncate ${
                        selectedCategory === cat.slug ? 'bg-lime/30 text-dark font-bold' : 'text-dark-muted hover:text-dark'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="pt-4 border-t border-surface-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark mb-3">Price Range (₹)</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(0); }}
                  className="px-2.5 py-1.5 rounded-lg border border-surface-border text-xs focus:outline-none focus:border-olive"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }}
                  className="px-2.5 py-1.5 rounded-lg border border-surface-border text-xs focus:outline-none focus:border-olive"
                />
              </div>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 rounded-2xl bg-ivory/60 border border-surface-border animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-ivory/30 rounded-3xl border border-surface-border p-8">
                <PackageOpen className="w-12 h-12 text-olive mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-dark">No equipment found</h3>
                <p className="text-xs text-dark-muted max-w-sm mx-auto mt-1 mb-6">
                  Try clearing your filters or searching for another term like &quot;cricket&quot;, &quot;badminton&quot;, or &quot;cleats&quot;.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-lime text-dark font-bold text-xs hover:bg-lime-500 shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-4 py-2 rounded-xl border border-surface-border text-xs font-semibold text-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-dark px-3">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="px-4 py-2 rounded-xl border border-surface-border text-xs font-semibold text-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-dark/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-surface-white p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                <h3 className="font-bold text-base text-dark">Filter Equipment</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-dark-muted hover:text-dark"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conditions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark mb-3">Condition</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-dark">
                    <input
                      type="radio"
                      name="m_condition"
                      checked={selectedCondition === ''}
                      onChange={() => { setSelectedCondition(''); setPage(0); }}
                      className="accent-olive"
                    />
                    <span>All Conditions</span>
                  </label>
                  {CONDITIONS.map((c) => (
                    <label key={c.value} className="flex items-center gap-2 text-xs font-medium text-dark">
                      <input
                        type="radio"
                        name="m_condition"
                        checked={selectedCondition === c.value}
                        onChange={() => { setSelectedCondition(c.value); setPage(0); }}
                        className="accent-olive"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-surface-border space-y-3">
                <label className="flex items-center gap-2 text-xs font-medium text-dark">
                  <input
                    type="checkbox"
                    checked={isPreOwned === true}
                    onChange={(e) => { setIsPreOwned(e.target.checked ? true : undefined); setPage(0); }}
                    className="accent-olive rounded"
                  />
                  <span>Pre-Owned Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-dark">
                  <input
                    type="checkbox"
                    checked={isVerified === true}
                    onChange={(e) => { setIsVerified(e.target.checked ? true : undefined); setPage(0); }}
                    className="accent-olive rounded"
                  />
                  <span>Verified Badged Only</span>
                </label>
              </div>

              <div className="pt-6 border-t border-surface-border flex gap-3">
                <button
                  onClick={() => { clearAllFilters(); setIsMobileFilterOpen(false); }}
                  className="flex-1 py-3 rounded-xl border border-surface-border font-bold text-xs text-dark hover:bg-ivory"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-lime font-bold text-xs text-dark shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-surface-white" />}>
      <ProductsContent />
    </React.Suspense>
  );
}
