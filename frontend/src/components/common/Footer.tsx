'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, Truck, Award, Mail, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ivory/60 border-t border-surface-border text-dark pb-20 md:pb-12">
      {/* 4 Value Pillars */}
      <div className="border-b border-surface-border bg-surface-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-lime/40 border border-lime-300 flex items-center justify-center text-olive flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-olive" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-dark">Verified Inspection</h4>
                <p className="text-xs text-dark-muted mt-0.5">Every pre-owned listing certified by equipment experts.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-lime/40 border border-lime-300 flex items-center justify-center text-olive flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-olive" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-dark">Circular Play</h4>
                <p className="text-xs text-dark-muted mt-0.5">Give pre-loved gear a new game & reduce landfill waste.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-lime/40 border border-lime-300 flex items-center justify-center text-olive flex-shrink-0">
                <Truck className="w-5 h-5 text-olive" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-dark">Safe Transit</h4>
                <p className="text-xs text-dark-muted mt-0.5">Free shipping on orders above ₹999 with tracking.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-lime/40 border border-lime-300 flex items-center justify-center text-olive flex-shrink-0">
                <Award className="w-5 h-5 text-olive" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-dark">Authentic Brands</h4>
                <p className="text-xs text-dark-muted mt-0.5">100% genuine equipment from Yonex, MRF, SG, Nike & more.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-lime flex items-center justify-center font-black text-dark text-lg border border-lime-300">
                SC
              </div>
              <span className="font-black text-2xl tracking-tighter text-dark">
                SPORT<span className="text-olive">CYCLE</span>
              </span>
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-olive mb-3">
              Gear. Play. Repeat.
            </p>
            <p className="text-sm text-dark-muted leading-relaxed max-w-sm mb-6">
              India’s premier sports equipment marketplace. Discover brand-new tournament gear, certified pre-owned bats and racquets, and connect with accredited sports clubs across the country.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold text-dark uppercase tracking-wider mb-2">
                Join the Athlete Club
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-dark-muted" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-surface-border bg-surface-white focus:outline-none focus:border-olive"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-lime text-dark font-bold text-xs hover:bg-lime-500 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Sports Links */}
          <div>
            <h4 className="font-bold text-sm text-dark uppercase tracking-wider mb-4">
              Main Sports
            </h4>
            <ul className="space-y-2.5 text-xs text-dark-muted font-medium">
              <li><Link href="/products?sportSlug=cricket" className="hover:text-olive">Cricket Equipment</Link></li>
              <li><Link href="/products?sportSlug=football" className="hover:text-olive">Football & Cleats</Link></li>
              <li><Link href="/products?sportSlug=badminton" className="hover:text-olive">Badminton Racquets</Link></li>
              <li><Link href="/products?sportSlug=tennis" className="hover:text-olive">Tennis Championship</Link></li>
              <li><Link href="/products?sportSlug=basketball" className="hover:text-olive">Basketball & Hoops</Link></li>
              <li><Link href="/products?sportSlug=running" className="hover:text-olive">Running & Sprint</Link></li>
              <li><Link href="/products?sportSlug=fitness" className="hover:text-olive">Gym & Weights</Link></li>
              <li><Link href="/sports" className="text-olive font-bold hover:underline">View All 12 Sports &rarr;</Link></li>
            </ul>
          </div>

          {/* Marketplace & Pre-Owned */}
          <div>
            <h4 className="font-bold text-sm text-dark uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs text-dark-muted font-medium">
              <li><Link href="/pre-owned" className="hover:text-olive">Pre-Owned Collection</Link></li>
              <li><Link href="/seller" className="hover:text-olive">Sell Your Equipment</Link></li>
              <li><Link href="/clubs" className="hover:text-olive">Sports Clubs Directory</Link></li>
              <li><Link href="/products?condition=BRAND_NEW" className="hover:text-olive">Brand New Catalog</Link></li>
              <li><Link href="/pre-owned#guide" className="hover:text-olive">Condition Rating Guide</Link></li>
              <li><Link href="/seller" className="hover:text-olive">Seller Protection Policy</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-sm text-dark uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-dark-muted font-medium">
              <li><Link href="/orders" className="hover:text-olive">Track Your Order</Link></li>
              <li><Link href="/profile" className="hover:text-olive">Account Settings</Link></li>
              <li><Link href="/cart" className="hover:text-olive">Cart & Checkout</Link></li>
              <li><Link href="/wishlist" className="hover:text-olive">Saved Wishlist</Link></li>
              <li><a href="mailto:support@sportcycle.com" className="hover:text-olive">support@sportcycle.com</a></li>
              <li><span className="text-dark-light">Operating across India</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Payment Badges */}
        <div className="mt-12 pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark-muted">
          <p>© 2026 SPORTCYCLE Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-dark">Secure Payments via</span>
            <span className="px-2.5 py-1 rounded bg-surface-white border border-surface-border font-bold text-blue-700">
              Razorpay
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-white border border-surface-border font-bold text-emerald-700">
              UPI / Cards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
