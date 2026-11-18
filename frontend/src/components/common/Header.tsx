'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  PlusCircle,
  LogOut,
  ChevronDown,
  Package,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Truck,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { SearchModal } from './SearchModal';

const CATEGORY_NAV_ITEMS = [
  { name: 'Cricket', slug: 'cricket', icon: '🏏' },
  { name: 'Football', slug: 'football', icon: '⚽' },
  { name: 'Badminton', slug: 'badminton', icon: '🏸' },
  { name: 'Tennis', slug: 'tennis', icon: '🎾' },
  { name: 'Basketball', slug: 'basketball', icon: '🏀' },
  { name: 'Fitness', slug: 'fitness', icon: '🏋️' },
  { name: 'Volleyball', slug: 'volleyball', icon: '🏐' },
  { name: 'Hockey', slug: 'hockey', icon: '🏑' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin, isSeller } = useAuth();
  const { itemCount: cartCount, cart } = useCart();
  const subtotal = cart?.subtotal || 0;
  const { itemCount: wishlistCount } = useWishlist();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle direct search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-white border-b border-surface-border shadow-sm">
        {/* 1. Top Announcement Bar */}
        <div className="bg-ivory border-b border-surface-border/70 py-1.5 px-4 text-xs font-semibold text-dark">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-lime animate-pulse" />
              <span>Welcome to <strong className="text-olive">SPORTCYCLE</strong>: India's Premier Sports Marketplace</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-dark-muted">
              <span className="flex items-center gap-1.5 text-olive font-bold">
                <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                Special Offer: Use code <strong>PLAY10</strong> for 10% off
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Free Express Delivery on orders over ₹1,999
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                100% Verified Pre-Owned Gear
              </span>
            </div>
          </div>
        </div>

        {/* 2. Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-lime flex items-center justify-center font-black text-dark text-xl sm:text-2xl shadow-sm border border-lime-300 group-hover:scale-105 transition-transform">
                SC
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl sm:text-2xl tracking-tighter text-dark leading-none">
                  SPORT<span className="text-olive">CYCLE</span>
                </span>
                <span className="text-[10px] font-extrabold tracking-widest text-olive uppercase mt-0.5">
                  GEAR. PLAY. REPEAT.
                </span>
              </div>
            </Link>

            {/* Large Product Search (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search cricket bats, football boots, rackets, fitness gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-24 rounded-full bg-ivory text-dark text-sm border border-surface-border focus:outline-none focus:border-olive focus:ring-2 focus:ring-lime/40 transition-all placeholder:text-dark-muted/80"
                />
                <Search className="w-5 h-5 text-dark-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 bg-olive hover:bg-olive/90 text-surface-white font-bold text-xs rounded-full transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Actions: Account, Wishlist, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Mobile Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search modal"
                className="md:hidden p-2 text-dark hover:text-olive rounded-full hover:bg-ivory"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative p-2.5 text-dark hover:text-olive rounded-full hover:bg-ivory transition-colors flex items-center gap-1.5"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-olive text-surface-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-white">
                    {wishlistCount}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-bold">Wishlist</span>
              </Link>

              {/* Shopping Cart */}
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="relative p-2.5 text-dark hover:text-olive rounded-full hover:bg-ivory transition-colors flex items-center gap-2"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-lime text-dark text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[10px] font-bold text-dark-muted uppercase">Cart</span>
                  <span className="text-xs font-extrabold text-dark leading-tight">
                    {cartCount > 0 ? `₹${Number(subtotal).toLocaleString()}` : 'Empty'}
                  </span>
                </div>
              </Link>

              {/* Account / Login Menu */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full border border-surface-border bg-ivory/60 hover:border-olive transition-colors text-xs font-bold text-dark"
                    >
                      <div className="w-7 h-7 rounded-full bg-olive text-surface-white flex items-center justify-center font-bold text-xs uppercase">
                        {user.fullName.charAt(0)}
                      </div>
                      <span className="hidden sm:inline max-w-[90px] truncate">{user.fullName.split(' ')[0]}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-dark-muted" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-surface-white rounded-2xl shadow-xl border border-surface-border py-2 z-50 animate-fade-in text-xs">
                        <div className="px-4 py-2 border-b border-surface-border">
                          <p className="font-bold text-dark truncate">{user.fullName}</p>
                          <p className="text-[11px] text-dark-muted truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ivory text-dark font-semibold">
                          <UserIcon className="w-4 h-4 text-olive" />
                          <span>My Profile</span>
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ivory text-dark font-semibold">
                          <Package className="w-4 h-4 text-olive" />
                          <span>My Orders & Tracking</span>
                        </Link>
                        {isSeller && (
                          <Link href="/seller" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ivory text-dark font-semibold">
                            <PlusCircle className="w-4 h-4 text-lime-700" />
                            <span>Seller Dashboard</span>
                          </Link>
                        )}
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ivory text-dark font-semibold">
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 font-semibold border-t border-surface-border mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="h-10 px-4 sm:px-5 rounded-full bg-olive hover:bg-olive/90 text-surface-white font-extrabold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Hamburger Toggle (Mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="lg:hidden p-2 text-dark hover:text-olive rounded-xl hover:bg-ivory"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>
        </div>

        {/* 3. Category Sub-Navigation Bar (Desktop) */}
        <div className="hidden lg:block bg-surface-white border-t border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-11 text-xs font-bold text-dark">
              <div className="flex items-center space-x-6">
                {CATEGORY_NAV_ITEMS.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/sports/${cat.slug}`}
                    className={`flex items-center gap-1.5 py-2 hover:text-olive transition-colors ${
                      pathname === `/sports/${cat.slug}` ? 'text-olive font-extrabold border-b-2 border-olive' : 'text-dark/90'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
                <Link
                  href="/sports"
                  className={`py-2 hover:text-olive transition-colors ${
                    pathname === '/sports' ? 'text-olive font-extrabold' : 'text-dark-muted font-bold'
                  }`}
                >
                  All Sports →
                </Link>
                <Link
                  href="/pre-owned"
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-ivory text-dark hover:bg-lime/30 transition-colors border border-surface-border font-extrabold ${
                    pathname === '/pre-owned' ? 'border-olive text-olive' : ''
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                  Pre-Owned Gear
                </Link>
              </div>

              {/* Sell Equipment CTA */}
              <Link
                href="/seller"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-lime hover:bg-lime-500 text-dark rounded-full font-black text-xs transition-all shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5 text-dark" />
                <span>Sell Equipment</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Dedicated Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-surface-white border-t border-surface-border px-4 py-6 space-y-5 animate-fade-in max-h-[85vh] overflow-y-auto">
            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search all sports equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-20 rounded-xl bg-ivory text-dark text-sm border border-surface-border focus:outline-none focus:border-olive"
              />
              <Search className="w-5 h-5 text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3.5 bg-olive text-surface-white font-bold text-xs rounded-lg"
              >
                Go
              </button>
            </form>

            {/* Primary Category Links */}
            <div>
              <p className="text-[11px] font-black uppercase text-dark-muted tracking-wider mb-2">Shop by Sport</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {CATEGORY_NAV_ITEMS.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/sports/${cat.slug}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-ivory/60 hover:bg-ivory border border-surface-border"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-1.5 pt-2 border-t border-surface-border text-sm font-bold">
              <Link href="/products" className="flex items-center justify-between p-2 rounded-xl hover:bg-ivory text-dark">
                <span>Browse All Equipment</span>
                <ArrowRight className="w-4 h-4 text-dark-muted" />
              </Link>
              <Link href="/pre-owned" className="flex items-center justify-between p-2 rounded-xl hover:bg-ivory text-dark">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime" />
                  Certified Pre-Owned Store
                </span>
                <ArrowRight className="w-4 h-4 text-dark-muted" />
              </Link>
              <Link href="/clubs" className="flex items-center justify-between p-2 rounded-xl hover:bg-ivory text-dark">
                <span>Sports Clubs Marketplace</span>
                <ArrowRight className="w-4 h-4 text-dark-muted" />
              </Link>
              <Link href="/seller" className="flex items-center justify-between p-2.5 rounded-xl bg-lime/30 text-olive border border-lime-400">
                <span className="flex items-center gap-2 font-black">
                  <PlusCircle className="w-4 h-4 text-olive" />
                  Sell Your Equipment
                </span>
                <ArrowRight className="w-4 h-4 text-olive" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
