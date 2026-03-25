import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Get all active ads
export async function GET() {
  // TODO: Fetch from database
  const ads = [
    {
      id: '1',
      position: 'HOMEPAGE_BANNER',
      imageUrl: 'https://picsum.photos/728/90',
      clickUrl: 'https://example.com',
      impressions: 1000,
      clicks: 50,
      isActive: true,
    },
  ];
  return NextResponse.json({ ads });
}

// Create new ad campaign
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { position, imageUrl, clickUrl, budget } = body;

  // TODO: Validate and save to database
  return NextResponse.json({ message: 'Ad created', id: 'new-ad-id' }, { status: 201 });
}

// Track ad click
export async function PUT(req: NextRequest) {
  const { adId } = await req.json();

  // TODO: Increment click count
  return NextResponse.json({ message: 'Click tracked' });
}