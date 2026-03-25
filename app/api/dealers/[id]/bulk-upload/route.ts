import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateCSV } from '@/lib/csv-parser';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { csvContent } = await req.json();

  const { valid, errors, data } = validateCSV(csvContent);

  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const created: string[] = [];
  
  for (const row of data) {
    const listing = await db.listing.create({
      data: {
        userId: session.user.id,
        title: row.title,
        category: 'cars',
        make: row.make,
        model: row.model,
        year: Number(row.year),
        price: Number(row.price),
        mileage: Number(row.mileage),
        fuelType: row.fuelType,
        transmission: row.transmission,
        description: row.description,
        features: row.features,
        images: row.images,
        sellerName: row.sellerName,
        sellerPhone: row.sellerPhone,
        sellerLocation: row.sellerLocation,
        status: 'active',
      },
    });

    await db.dealerInventory.create({
      data: {
        dealerId: id,
        listingId: listing.id,
      },
    });

    created.push(listing.id);
  }

  return NextResponse.json({ created: created.length, listingIds: created });
}
