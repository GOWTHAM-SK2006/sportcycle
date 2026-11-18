import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function RatingStars({ rating, reviewCount, size = 'sm', showCount = true }: RatingStarsProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-gray-300'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs font-medium text-dark-muted">
          {rating.toFixed(1)} {reviewCount !== undefined && `(${reviewCount})`}
        </span>
      )}
    </div>
  );
}

