import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/common/Header';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'SportCycle – Multi-Sport E-Commerce Marketplace | Gear. Play. Repeat.',
  description: 'Discover premium brand-new and certified pre-owned sports equipment across 12 sports. Certified verification, sports clubs marketplace, and zero buyer fees.',
  keywords: 'sports equipment, cricket bats, football cleats, badminton rackets, tennis gear, pre-owned sports gear, sports club marketplace, India',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#B8D94B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface-white text-dark">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

