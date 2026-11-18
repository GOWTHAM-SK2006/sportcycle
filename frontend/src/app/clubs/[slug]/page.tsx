'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  UserPlus,
  CheckCircle2,
  ArrowLeft,
  PackageOpen
} from 'lucide-react';
import { clubApi } from '@/lib/api';
import { Club, ProductSummary } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';
import { useAuth } from '@/context/AuthContext';

export default function ClubDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Join modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinNotes, setJoinNotes] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([
      clubApi.getBySlug(String(slug)),
      clubApi.getClubProducts(String(slug)),
    ])
      .then(([clubData, prodData]) => {
        setClub(clubData);
        setProducts(prodData || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!club) return;
    setRequesting(true);

    try {
      await clubApi.requestMembership(club.id, joinNotes);
      setJoinSuccess(true);
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess(false);
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Membership request failed');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 rounded-3xl bg-ivory" />
        <div className="h-40 rounded-3xl bg-ivory" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-dark">Club Not Found</h2>
        <Link href="/clubs" className="text-olive underline mt-2 block font-semibold">
          Return to Club Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      {/* Club Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-ivory border-b border-surface-border">
        <Image
          src={club.bannerUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600'}
          alt={club.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />

        <div className="absolute top-4 left-4">
          <Link
            href="/clubs"
            className="px-3.5 py-1.5 rounded-full bg-surface-white/90 backdrop-blur-md text-xs font-bold text-dark hover:bg-surface-white shadow-sm flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Clubs Directory</span>
          </Link>
        </div>
      </div>

      {/* Club Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 mb-12">
        <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-ivory border-4 border-surface-white shadow-lg flex-shrink-0">
              <Image
                src={club.logoUrl || 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=400'}
                alt={club.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-olive">{club.sportName}</span>
                {club.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Academy
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-dark">{club.name}</h1>
              <p className="text-xs text-dark-muted flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-olive" />
                <span>{club.location}, {club.city}, {club.state}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex-1 md:flex-initial px-6 py-3.5 rounded-2xl bg-lime font-black text-xs text-dark hover:bg-lime-500 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Request to Join</span>
            </button>
          </div>
        </div>

        {/* Club Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 p-6 rounded-3xl bg-ivory/40 border border-surface-border space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-dark">About the Academy & Club</h2>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              {club.description}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-ivory/40 border border-surface-border space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-dark">Contact Information</h3>
            <p className="flex items-center gap-2 text-dark">
              <Mail className="w-4 h-4 text-olive" />
              <span>{club.contactEmail || 'contact@academy.com'}</span>
            </p>
            <p className="flex items-center gap-2 text-dark">
              <Phone className="w-4 h-4 text-olive" />
              <span>{club.contactPhone || '+91 9876543212'}</span>
            </p>
            <p className="text-dark-muted pt-2 border-t border-surface-border">
              {club.memberCount} Active Players & Coaches enrolled
            </p>
          </div>
        </div>

        {/* CLUB GEAR MARKETPLACE */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-dark">Equipment Listed by {club.name}</h2>
              <p className="text-xs text-dark-muted mt-0.5">Certified team gear, spare bats, and academy surplus</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center bg-ivory/40 rounded-3xl border border-surface-border p-8">
              <PackageOpen className="w-10 h-10 text-olive mx-auto mb-2 opacity-60" />
              <h3 className="font-bold text-dark">No equipment currently listed</h3>
              <p className="text-xs text-dark-muted mt-1">This club currently has no active gear listings on SportCycle.</p>
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

      {/* JOIN REQUEST MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-surface-border shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-olive font-black text-lg">
              <UserPlus className="w-5 h-5" />
              <span>Request Academy Membership</span>
            </div>
            <p className="text-xs text-dark-muted">
              Submit your request to join {club.name}. The club administrator will review your playing profile and contact you directly.
            </p>

            <form onSubmit={handleJoinRequest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Playing Experience / Notes</label>
                <textarea
                  required
                  rows={3}
                  value={joinNotes}
                  onChange={(e) => setJoinNotes(e.target.value)}
                  placeholder="e.g. Right-hand top order batsman with 4 years division league experience..."
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/30"
                />
              </div>

              {joinSuccess && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  Membership request submitted successfully!
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-3 rounded-xl border border-surface-border font-bold text-xs text-dark hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requesting || joinSuccess}
                  className="flex-1 py-3 rounded-xl bg-lime hover:bg-lime-500 font-bold text-xs text-dark shadow-sm"
                >
                  {requesting ? 'Submitting...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

