import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Get ads (public for serving, authenticated for user's own)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const position = searchParams.get('position');

  const where: any = { isActive: true };
  if (position) {
    where.position = position;
  }

  const ads = await db.adCampaign.findMany({
    where,
    orderBy: { startDate: 'desc' },
  });

  return NextResponse.json({ ads });
}

// Create new ad campaign
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { position, imageUrl, clickUrl, budget, startDate, endDate } = body;

  const ad = await db.adCampaign.create({
    data: {
      userId: session.user.id,
      position,
      imageUrl,
      clickUrl,
      budget: Number(budget),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return NextResponse.json({ ad }, { status: 201 });
}

// Track ad click
export async function PUT(req: NextRequest) {
  const { adId } = await req.json();

  await db.adCampaign.update({
    where: { id: adId },
    data: { clicks: { increment: 1 } },
  });

  return NextResponse.json({ success: true });
}
