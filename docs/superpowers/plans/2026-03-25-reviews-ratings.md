# Phase 8: Reviews & Ratings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add seller and vehicle ratings to build trust in the GariHub marketplace.

**Architecture:** Add Review model to Prisma, create API routes for CRUD, build StarRating component, integrate into seller and vehicle pages.

**Tech Stack:** Next.js App Router, Prisma, TypeScript

---

## Task 1: Add Review Model to Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Review enum and model**

Add at end of schema.prisma:

```prisma
enum ReviewTargetType {
  SELLER
  VEHICLE
}

model Review {
  id          String         @id @default(cuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id])
  targetType  ReviewTargetType
  targetId    String
  rating      Int            // 1-5
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@unique([userId, targetType, targetId])
}
```

- [ ] **Step 2: Add reviews relation to User model**

Add to User model:
```prisma
reviews     Review[]
```

- [ ] **Step 3: Run Prisma migrate**

```bash
npx prisma migrate dev --name add_reviews
```

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Review model to Prisma schema"
```

---

## Task 2: Create Reviews API Routes

**Files:**
- Create: `app/api/reviews/route.ts`
- Create: `app/api/reviews/[id]/route.ts`

- [ ] **Step 1: Create GET/POST reviews route**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId');
  const vehicleId = searchParams.get('vehicleId');

  let targetType = null;
  let targetId = null;

  if (sellerId) {
    targetType = 'SELLER';
    targetId = sellerId;
  } else if (vehicleId) {
    targetType = 'VEHICLE';
    targetId = vehicleId;
  }

  if (!targetType || !targetId) {
    return NextResponse.json({ error: 'Missing sellerId or vehicleId' }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { targetType: targetType as any, targetId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, count: reviews.length });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { targetType, targetId, rating } = body;

  if (!targetType || !targetId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  // Check if user already reviewed
  const existing = await prisma.review.findUnique({
    where: {
      userId_targetType_targetId: {
        userId: session.user.id,
        targetType,
        targetId,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: 'Already reviewed' }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      targetType,
      targetId,
      rating,
    },
  });

  return NextResponse.json(review);
}
```

- [ ] **Step 2: Create DELETE review route**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (review.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.review.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/reviews/
git commit -m "feat: add reviews API routes"
```

---

## Task 3: Create StarRating Component

**Files:**
- Create: `components/reviews/StarRating.tsx`

- [ ] **Step 1: Create StarRating component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/reviews/StarRating.tsx
git commit -m "feat: add StarRating component"
```

---

## Task 4: Create Review Components

**Files:**
- Create: `components/reviews/SellerReviews.tsx`
- Create: `components/reviews/WriteReviewButton.tsx`

- [ ] **Step 1: Create SellerReviews component**

```tsx
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
```

- [ ] **Step 2: Create WriteReviewButton component**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/reviews/
git commit -m "feat: add review components"
```

---

## Task 5: Integrate Reviews into Seller Page

**Files:**
- Modify: `app/dealers/[id]/page.tsx`

- [ ] **Step 1: Add SellerReviews to dealer page**

Add import and component:
```tsx
import { SellerReviews } from '@/components/reviews/SellerReviews';

// In the page, add after seller info:
<SellerReviews sellerId={params.id} />
```

- [ ] **Step 2: Commit**

```bash
git add "app/dealers/[id]/page.tsx"
git commit -m "feat: integrate reviews into seller page"
```

---

## Task 6: Integrate Reviews into Vehicle Page

**Files:**
- Modify: `app/vehicles/[id]/page.tsx`

- [ ] **Step 1: Add vehicle reviews**

Add import:
```tsx
import { SellerReviews } from '@/components/reviews/SellerReviews';
```

Add vehicle reviews section (similar to SellerReviews but for vehicles):
- Create VehicleReviews component or reuse with prop
- Display in vehicle detail page

- [ ] **Step 2: Commit**

```bash
git add "app/vehicles/[id]/page.tsx"
git commit -m "feat: integrate reviews into vehicle page"
```

---

## Task 7: Add Reviews to User Dashboard

**Files:**
- Create: `app/dashboard/reviews/page.tsx`

- [ ] **Step 1: Create dashboard reviews page**

```tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StarRating } from '@/components/reviews/StarRating';
import Link from 'next/link';

export default async function MyReviewsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return <div>Please log in to view your reviews.</div>;
  }

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven't written any reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{review.targetType.toLowerCase()} Review</span>
                <StarRating rating={review.rating} readonly />
              </div>
              <p className="text-sm text-gray-500">
                Target: {review.targetId}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/reviews/page.tsx
git commit -m "feat: add reviews page to dashboard"
```

---

## Task 8: Build and Verify

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Commit all remaining changes**

```bash
git add .
git commit -m "feat: complete Phase 8 - Reviews & Ratings"
```

---

## Task 9: Push to GitHub

- [ ] **Step 1: Push to remote**

```bash
git push origin main
```
