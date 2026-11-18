'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, Mail, User as UserIcon, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'SELLER'>('CUSTOMER');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName,
        email,
        phone,
        password,
        role,
      });
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-ivory/40 px-4 py-12">
      <div className="max-w-md w-full bg-surface-white rounded-3xl p-6 sm:p-10 border border-surface-border shadow-premium space-y-6">
        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-lime flex items-center justify-center font-black text-dark text-xl shadow-sm border border-lime-300">
              SC
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-dark">Join SportCycle</h1>
          <p className="text-xs text-dark-muted">Discover, buy, and sell verified sports equipment</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Account Type Selector */}
          <div>
            <label className="text-xs font-bold text-dark block mb-1.5">I want to:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  role === 'CUSTOMER' ? 'bg-olive text-surface-white shadow-sm' : 'border border-surface-border bg-ivory/20 text-dark'
                }`}
              >
                Shop Gear
              </button>
              <button
                type="button"
                onClick={() => setRole('SELLER')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  role === 'SELLER' ? 'bg-olive text-surface-white shadow-sm' : 'border border-surface-border bg-ivory/20 text-dark'
                }`}
              >
                Sell Equipment
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-dark block mb-1">Full Name *</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-dark-muted" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rohit Sharma"
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-ivory/20 focus:outline-none focus:border-olive"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-dark block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-dark-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@gmail.com"
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-ivory/20 focus:outline-none focus:border-olive"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-dark block mb-1">Mobile Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-dark-muted" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-ivory/20 focus:outline-none focus:border-olive"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-dark block mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-3.5 h-3.5 text-dark-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-surface-border bg-ivory/20 focus:outline-none focus:border-olive"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-dark block mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-3.5 h-3.5 text-dark-muted" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-surface-border bg-ivory/20 focus:outline-none focus:border-olive"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-lime hover:bg-lime-500 font-black text-xs text-dark shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create SportCycle Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-dark-muted pt-2">
          Already have an account?{' '}
          <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="font-bold text-olive hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[85vh] bg-ivory/40" />}>
      <RegisterContent />
    </React.Suspense>
  );
}
