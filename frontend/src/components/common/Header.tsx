'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Bell,
  Menu,
  X,
  PlusCircle,
  Shield,
  Layers,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { notificationApi } from '@/lib/api';
import { SearchModal } from './SearchModal';

export function Header() {
  const pathname = usePathname();
  const { user, logout, isAdmin, isSeller } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      notificationApi.getUnreadCount()
        .then(setUnreadNotifications)
        .catch(() => setUnreadNotifications(0));
    }
  }, [user]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-white/95 backdrop-blur-md border-b border-surface-border">
        {/* Top Mini Banner */}
        <div className="bg-ivory border-b border-surface-border py-1 px-4 text-center text-xs font-medium text-dark-muted hidden sm:block">
          <span className="font-semibold text-olive">SPORTCYCLE Circular Sports Economy:</span> Trade, verify and discover match-tested gear with 0% buyer commission.
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-lime flex items-center justify-center font-black text-dark text-xl shadow-sm border border-lime-300">
                SC
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl sm:text-2xl tracking-tighter text-dark">
                  SPORT<span className="text-olive">CYCLE</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest text-olive uppercase -mt-1 hidden sm:block">
                  Gear. Play. Repeat.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-dark">
              <Link
                href="/products"
                className={`transition-colors hover:text-olive ${
                  pathname.startsWith('/products') ? 'text-olive font-bold' : ''
                }`}
              >
                Shop Gear
              </Link>
              <Link
                href="/pre-owned"
                className={`transition-colors hover:text-olive flex items-center gap-1 ${
                  pathname === '/pre-owned' ? 'text-olive font-bold' : ''
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                Pre-Owned
              </Link>
              <Link
                href="/sports"
                className={`transition-colors hover:text-olive ${
                  pathname.startsWith('/sports') ? 'text-olive font-bold' : ''
                }`}
              >
                Sports
              </Link>
              <Link
                href="/clubs"
                className={`transition-colors hover:text-olive ${
                  pathname.startsWith('/clubs') ? 'text-olive font-bold' : ''
                }`}
              >
                Clubs
              </Link>
              <Link
                href="/seller"
                className="transition-colors text-olive font-bold hover:text-dark flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                Sell Gear
              </Link>
            </nav>

            {/* Search Bar (Desktop Trigger) */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-2.5 px-4 py-2 rounded-full bg-ivory text-dark-muted border border-surface-border text-sm hover:border-lime transition-all text-left"
              >
                <Search className="w-4 h-4 text-dark-muted" />
                <span className="truncate">Search equipment, brands, sports...</span>
                <kbd className="ml-auto hidden xl:inline-block text-[10px] font-semibold bg-surface-white px-1.5 py-0.5 rounded border border-surface-border">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Actions: Search (Mobile), Notifications, Wishlist, Cart, Profile */}
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="md:hidden p-2 text-dark hover:text-olive rounded-full hover:bg-ivory"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              {user && (
                <Link
                  href="/notifications"
                  aria-label="Notifications"
                  className="relative p-2 text-dark hover:text-olive rounded-full hover:bg-ivory transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-olive text-surface-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative p-2 text-dark hover:text-olive rounded-full hover:bg-ivory transition-colors hidden sm:block"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-olive text-surface-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="relative p-2 text-dark hover:text-olive rounded-full hover:bg-ivory transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-lime text-dark text-[10px] font-black rounded-full flex items-center justify-center border border-lime-400">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown / Auth Link */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-ivory border border-transparent hover:border-surface-border transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-lime/40 text-dark font-bold flex items-center justify-center text-xs border border-lime-300">
                      {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-dark hidden md:inline-block max-w-[100px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-dark-muted hidden md:inline-block" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface-white rounded-2xl shadow-xl border border-surface-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-surface-border">
                        <p className="text-xs font-bold text-dark truncate">{user.fullName}</p>
                        <p className="text-[11px] text-dark-muted truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-dark hover:bg-ivory"
                      >
                        <UserIcon className="w-4 h-4 text-olive" />
                        My Profile & Addresses
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-dark hover:bg-ivory"
                      >
                        <ShoppingBag className="w-4 h-4 text-olive" />
                        My Orders
                      </Link>
                      {isSeller && (
                        <Link
                          href="/seller"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-dark hover:bg-ivory"
                        >
                          <Layers className="w-4 h-4 text-olive" />
                          Seller Dashboard
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-olive font-bold hover:bg-ivory"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-surface-border my-1" />

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-lime text-dark font-bold text-xs hover:bg-lime-500 shadow-sm transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 text-dark hover:text-olive rounded-xl hover:bg-ivory"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-surface-white border-b border-surface-border px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/products"
              className="block px-3 py-2 rounded-xl text-base font-semibold text-dark hover:bg-ivory"
            >
              Shop All Equipment
            </Link>
            <Link
              href="/pre-owned"
              className="block px-3 py-2 rounded-xl text-base font-semibold text-dark hover:bg-ivory flex items-center justify-between"
            >
              <span>Pre-Owned Verified Gear</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-lime text-dark">CIRCULAR</span>
            </Link>
            <Link
              href="/sports"
              className="block px-3 py-2 rounded-xl text-base font-semibold text-dark hover:bg-ivory"
            >
              All 12 Sports
            </Link>
            <Link
              href="/clubs"
              className="block px-3 py-2 rounded-xl text-base font-semibold text-dark hover:bg-ivory"
            >
              Sports Clubs & Trainee Gear
            </Link>
            <Link
              href="/seller"
              className="block px-3 py-2 rounded-xl text-base font-bold text-olive hover:bg-ivory flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Sell Your Gear (0% Commission)
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

