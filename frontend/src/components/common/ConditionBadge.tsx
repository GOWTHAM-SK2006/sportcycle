import React from 'react';
import { getConditionBadge } from '@/lib/utils';
import { CheckCircle2, Sparkles, Tag, ShieldCheck } from 'lucide-react';

interface ConditionBadgeProps {
  condition: string;
  isPreOwned?: boolean;
  isVerified?: boolean;
  className?: string;
}

export function ConditionBadge({ condition, isPreOwned, isVerified, className = '' }: ConditionBadgeProps) {
  const badge = getConditionBadge(condition);

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
        {condition === 'BRAND_NEW' ? <Sparkles className="w-3 h-3 text-emerald-600" /> : <Tag className="w-3 h-3 text-olive" />}
        {badge.label}
      </span>

      {isPreOwned && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
          Pre-Owned
        </span>
      )}

      {isVerified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200" title="Inspected and verified by SportCycle">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Verified
        </span>
      )}
    </div>
  );
}

