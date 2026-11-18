'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, ShieldCheck, MapPin, ArrowRight, PlusCircle, Search } from 'lucide-react';
import { clubApi } from '@/lib/api';
import { Club } from '@/types';

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    clubApi.getAll()
      .then(setClubs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredClubs = clubs.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    (c.sportName && c.sportName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      {/* Header */}
      <div className="bg-ivory/60 border-b border-surface-border py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime/40 border border-lime text-xs font-bold uppercase tracking-wider text-dark mb-2">
                <Users className="w-3.5 h-3.5 text-olive" />
                <span>Club Directory</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-dark tracking-tight">
                Sports Clubs & Academies
              </h1>
              <p className="text-sm sm:text-base text-dark-muted mt-2 max-w-xl">
                Discover verified cricket clubs, badminton academies, and football associations. Join as a trainee, access club gear exchange, and train with elite athletes.
              </p>
            </div>

            <Link
              href="/clubs/admin"
              className="px-6 py-3.5 rounded-2xl bg-olive text-surface-white font-bold text-xs hover:bg-olive/90 shadow-sm flex items-center gap-2 self-start"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register a Sports Club</span>
            </Link>
          </div>

          {/* Search Box */}
          <div className="mt-8 max-w-md relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by club name, city, or sport..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-surface-white text-xs font-medium focus:border-olive focus:outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-ivory animate-pulse" />
            ))}
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="py-16 text-center text-dark-muted">
            <p className="text-sm font-semibold">No clubs found matching &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="group flex flex-col bg-surface-white rounded-3xl border border-surface-border overflow-hidden hover:shadow-premium transition-all duration-300 hover:border-lime"
              >
                {/* Banner image */}
                <div className="relative h-36 w-full bg-ivory">
                  <Image
                    src={club.bannerUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'}
                    alt={club.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                  <div className="absolute -bottom-5 left-5 w-14 h-14 rounded-2xl overflow-hidden bg-surface-white border-2 border-surface-white shadow-md">
                    <Image
                      src={club.logoUrl || 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=200'}
                      alt={club.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-8 p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-olive font-bold uppercase tracking-wider mb-1">
                      <span>{club.sportName || 'Multi-Sport'}</span>
                      {club.isVerified && (
                        <span className="flex items-center gap-0.5 text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-black text-dark group-hover:text-olive transition-colors">
                      {club.name}
                    </h2>
                    <p className="text-xs text-dark-muted flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-olive flex-shrink-0" />
                      <span>{club.city}, {club.state}</span>
                    </p>
                    <p className="text-xs text-dark-muted mt-2 line-clamp-2">
                      {club.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-dark">
                      {club.memberCount} Members
                    </span>
                    <Link
                      href={`/clubs/${club.slug}`}
                      className="px-4 py-2 rounded-xl bg-lime font-bold text-xs text-dark hover:bg-lime-500 shadow-sm flex items-center gap-1"
                    >
                      <span>View Club Page</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

