import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getConditionBadge(condition: string) {
  switch (condition) {
    case 'BRAND_NEW':
      return { label: 'Brand New', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'LIKE_NEW':
      return { label: 'Like New', bg: 'bg-lime-100 text-lime-900 border-lime-300' };
    case 'EXCELLENT':
      return { label: 'Excellent', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'GOOD':
      return { label: 'Good', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'FAIR':
      return { label: 'Fair', bg: 'bg-stone-100 text-stone-800 border-stone-200' };
    default:
      return { label: condition, bg: 'bg-surface-grey text-dark border-surface-border' };
  }
}

