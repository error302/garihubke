'use client';

import { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { WriteReviewButton } from './WriteReviewButton';

interface Review {
  id: string;
  rating: number;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface SellerReviewsProps {
  sellerId: string;
}

export function SellerReviews({ sellerId }: SellerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews?sellerId=${sellerId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setCount(data.count || 0);
      })
      .finally(() => setLoading(false));
  }, [sellerId]);

  if (loading) return <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Seller Reviews</h3>
        <WriteReviewButton targetType="seller" targetId={sellerId} onSuccess={() => window.location.reload()} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <StarRating rating={avgRating} readonly size="lg" />
        <span className="text-gray-600">({count} reviews)</span>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.slice(0, 5).map((review) => (
            <div key={review.id} className="border-b pb-3 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{review.user.name || 'Anonymous'}</span>
                <StarRating rating={review.rating} readonly size="sm" />
              </div>
              <p className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
