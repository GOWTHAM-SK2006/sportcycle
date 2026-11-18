'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, Mail, Shield, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
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
          <h1 className="text-2xl sm:text-3xl font-black text-dark">Welcome Back</h1>
          <p className="text-xs text-dark-muted">Sign in to your SportCycle athlete account</p>
        </div>

        {/* Demo Accounts Quick-Fill Helper */}
        <div className="p-3.5 rounded-2xl bg-ivory border border-surface-border text-xs space-y-2">
          <p className="font-bold text-dark-muted uppercase tracking-wider text-[10px]">Quick Demo Logins (Pass: password123):</p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => fillQuickDemo('customer@sportcycle.com')}
              className="px-2 py-1.5 rounded-lg bg-surface-white border border-surface-border font-medium text-[11px] text-dark hover:bg-lime/30 text-left truncate"
            >
              🏃 Customer
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('seller@sportcycle.com')}
              className="px-2 py-1.5 rounded-lg bg-surface-white border border-surface-border font-medium text-[11px] text-dark hover:bg-lime/30 text-left truncate"
            >
              🏷️ Seller
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('club@sportcycle.com')}
              className="px-2 py-1.5 rounded-lg bg-surface-white border border-surface-border font-medium text-[11px] text-dark hover:bg-lime/30 text-left truncate"
            >
              🏟️ Club Admin
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin@sportcycle.com')}
              className="px-2 py-1.5 rounded-lg bg-surface-white border border-surface-border font-medium text-[11px] text-dark hover:bg-lime/30 text-left truncate"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-dark block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-dark-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@sportcycle.com"
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-ivory/20 focus:outline-none focus:border-olive"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-dark">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-dark-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-ivory/20 focus:outline-none focus:border-olive"
              />
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
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-dark-muted pt-2">
          Don&apos;t have an account?{' '}
          <Link href={`/auth/register?redirect=${encodeURIComponent(redirect)}`} className="font-bold text-olive hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[85vh] bg-ivory/40" />}>
      <LoginContent />
    </React.Suspense>
  );
}
