import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listings = await db.listing.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      category,
      make,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      description,
      sellerName,
      sellerPhone,
      sellerLocation,
      features,
      images,
    } = body;

    if (!title || !category || !make || !model || !year || !price || 
        !fuelType || !transmission || !description || 
        !sellerName || !sellerPhone || !sellerLocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const listing = await db.listing.create({
      data: {
        userId: session.user.id,
        title,
        category,
        make,
        model,
        year,
        price,
        mileage,
        fuelType,
        transmission,
        description,
        sellerName,
        sellerPhone,
        sellerLocation,
        features: features || '[]',
        images: images || '[]',
        status: 'pending',
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
