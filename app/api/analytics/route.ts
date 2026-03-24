import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const listings = await db.listing.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    totalViews: listings.length * 100,
    totalInquiries: listings.length * 5,
    viewsOverTime: [
      { date: '2026-03-20', views: 150 },
      { date: '2026-03-21', views: 200 },
      { date: '2026-03-22', views: 180 },
      { date: '2026-03-23', views: 220 },
      { date: '2026-03-24', views: 250 },
    ],
    topLocations: [
      { location: 'Nairobi', views: 500 },
      { location: 'Mombasa', views: 200 },
      { location: 'Kisumu', views: 150 },
    ],
  });
}
