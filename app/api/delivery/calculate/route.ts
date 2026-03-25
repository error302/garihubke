import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { COUNTY_COORDINATES, calculateDistance } from '@/lib/kenya-regions';

export async function POST(req: NextRequest) {
  const { fromCounty, toCounty } = await req.json();

  if (!fromCounty || !toCounty) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const fromCoords = COUNTY_COORDINATES[fromCounty];
  const toCoords = COUNTY_COORDINATES[toCounty];

  if (!fromCoords || !toCoords) {
    return NextResponse.json({ error: 'Invalid county' }, { status: 400 });
  }

  const distanceKm = Math.round(
    calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)
  );

  const toRate = await db.deliveryRate.findUnique({
    where: { county: toCounty },
  });

  const baseFee = toRate?.baseFee || 5000;
  const perKmFee = toRate?.perKmFee || 50;
  const distanceFee = distanceKm * perKmFee;
  const totalFee = baseFee + distanceFee;

  return NextResponse.json({
    fromCounty,
    toCounty,
    distanceKm,
    baseFee,
    perKmFee,
    distanceFee,
    totalFee,
  });
}
