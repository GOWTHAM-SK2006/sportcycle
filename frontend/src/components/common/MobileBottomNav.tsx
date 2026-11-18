'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: 'Home', href: '/', icon: Home, active: pathname === '/' },
    { label: 'Shop', href: '/products', icon: Compass, active: pathname.startsWith('/products') },
    { label: 'Sell', href: '/seller', icon: PlusCircle, active: pathname.startsWith('/seller'), highlight: true },
    { label: 'Clubs', href: '/clubs', icon: ShieldCheck, active: pathname.startsWith('/clubs') },
    { label: 'Account', href: user ? '/profile' : '/auth/login', icon: User, active: pathname.startsWith('/profile') || pathname.startsWith('/auth') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-white/95 backdrop-blur-md border-t border-surface-border md:hidden safe-area-pb">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                item.active ? 'text-olive font-bold' : 'text-dark-muted hover:text-dark'
              }`}
            >
              {item.highlight ? (
                <div className="w-9 h-9 rounded-full bg-lime flex items-center justify-center text-dark shadow-sm -mt-3 border-2 border-surface-white">
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <Icon className={`w-5 h-5 ${item.active ? 'text-olive' : ''}`} />
              )}
              <span className={`text-[10px] mt-1 ${item.active ? 'font-bold text-olive' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

