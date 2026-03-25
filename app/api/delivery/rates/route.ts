import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const rates = await db.deliveryRate.findMany({
    where: { isActive: true },
    orderBy: { county: 'asc' },
  });
  return NextResponse.json(rates);
}
