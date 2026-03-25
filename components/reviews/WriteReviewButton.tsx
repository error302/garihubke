'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import { useSession } from 'next-auth/react';

interface WriteReviewButtonProps {
  targetType: 'seller' | 'vehicle';
  targetId: string;
  onSuccess?: () => void;
}

export function WriteReviewButton({ targetType, targetId, onSuccess }: WriteReviewButtonProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!session) return null;

  const handleSubmit = async () => {
    if (rating < 1) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: targetType.toUpperCase(),
          targetId,
          rating,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setIsOpen(false);
      setRating(0);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
      >
        Write Review
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Your Rating</label>
          <StarRating rating={rating} onChange={setRating} size="lg" />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
