'use client';

import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  readonly?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, readonly = false, onChange, size = 'md' }: StarRatingProps) {
  const sizes = { sm: 14, md: 20, lg: 28 };
  const iconSize = sizes[size];

  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          disabled={readonly}
          className={cn(
            'transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          )}
        >
          <Star
            size={iconSize}
            className={cn(
              value <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}
