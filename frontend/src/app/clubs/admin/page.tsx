'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, PlusCircle, CheckCircle2, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clubApi, catalogApi } from '@/lib/api';
import { Sport } from '@/types';

export default function ClubAdminPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [sports, setSports] = useState<Sport[]>([]);
  const [name, setName] = useState('');
  const [sportId, setSportId] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    catalogApi.getSports().then(setSports).catch(console.error);
  }, []);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login?redirect=/clubs/admin');
      return;
    }

    setSubmitting(true);
    try {
      const created = await clubApi.createClub({
        name,
        sportId: sportId ? Number(sportId) : null,
        location,
        city,
        state,
        description,
        logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=300',
        bannerUrl: bannerUrl.trim() || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200',
        contactEmail,
        contactPhone,
        membershipOpen: true,
      });

      alert('Sports Club created successfully!');
      router.push(`/clubs/${created.slug}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create club');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/clubs" className="text-xs font-bold text-dark-muted hover:text-dark flex items-center gap-1.5 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Clubs Directory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-dark">Register Sports Club / Academy</h1>
          <p className="text-xs text-dark-muted mt-0.5">List your club, manage memberships, and exchange gear with athletes</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleCreateClub} className="p-6 sm:p-8 rounded-3xl bg-surface-white border border-surface-border shadow-premium space-y-5">
          <div>
            <label className="text-xs font-bold text-dark block mb-1">Club / Academy Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bangalore Strikers Cricket Club"
              className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-dark block mb-1">Primary Sport</label>
              <select
                value={sportId}
                onChange={(e) => setSportId(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
              >
                <option value="">Select Sport</option>
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-dark block mb-1">Location Address *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ground name or stadium address"
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-dark block mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bengaluru"
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-dark block mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Karnataka"
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-dark block mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-dark block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-dark block mb-1">Club Logo Image URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-dark block mb-1">Club Banner Image URL</label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-dark block mb-1">Club Description & Facilities</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe coaching programs, tournament matches, academy facilities, practice nets, and membership details..."
              className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-lime hover:bg-lime-500 font-black text-sm text-dark shadow-sm transition-all"
          >
            {submitting ? 'Creating Sports Club Profile...' : 'Register & Launch Club Page'}
          </button>
        </form>
      </div>
    </div>
  );
}

