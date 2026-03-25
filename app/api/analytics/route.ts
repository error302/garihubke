import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all listings for user
  const listings = await db.listing.findMany({
    where: { userId: session.user.id },
  });

  // Calculate analytics (mock data for now)
  const totalViews = listings.reduce((sum: number, l: any) => sum + (l.views || 0), 0);
  const totalInquiries = Math.floor(totalViews * 0.05); // 5% conversion

  return NextResponse.json({
    totalViews,
    totalInquiries,
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