import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

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

  const reviews = await db.review.findMany({
    where: { targetType, targetId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, count: reviews.length });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { targetType, targetId, rating } = body;

  if (!targetType || !targetId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const existing = await db.review.findUnique({
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

  const review = await db.review.create({
    data: {
      userId: session.user.id,
      targetType,
      targetId,
      rating,
    },
  });

  return NextResponse.json(review);
}