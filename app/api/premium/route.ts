import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Get premium listings for user
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const premiums = await db.premiumListing.findMany({
    where: { userId: session.user.id },
    include: { listing: true },
  });

  return NextResponse.json({ premiums });
}

// Purchase premium feature
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { listingId, feature } = await req.json();

  // Set expiration based on feature
  let expiresAt: Date;
  switch (feature) {
    case 'FEATURED':
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
      break;
    case 'PREMIUM_PLACEMENT':
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
      break;
    case 'VERIFIED':
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 month
      break;
    case 'EXTENDED_DURATION':
      expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      break;
    default:
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
  }

  const premium = await db.premiumListing.create({
    data: {
      userId: session.user.id,
      listingId,
      feature,
      expiresAt,
    },
  });

  return NextResponse.json({ premium }, { status: 201 });
}