import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { computeDealRating, estimateMonthlyPayment, computeDaysOnMarket, getSpecialBadges } from '@/lib/market'

// GET /api/vehicles/[slug]
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = await db.vehicle.findUnique({
    where: { slug },
    include: { dealer: true, reviews: true },
  })
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Increment view
  await db.vehicle.update({ where: { id: vehicle.id }, data: { viewsCount: { increment: 1 } } })

  // Find similar: same make or bodyType, exclude self
  const similar = await db.vehicle.findMany({
    where: {
      id: { not: vehicle.id },
      status: 'active',
      OR: [{ make: vehicle.make }, { bodyType: vehicle.bodyType }],
    },
    take: 6,
    orderBy: { isFeatured: 'desc' },
    include: { dealer: true },
  })

  // Fetch all active vehicles for market analysis
  const allVehicles = await db.vehicle.findMany({ where: { status: 'active' } })

  // Enrich with deal rating + monthly payment
  const deal = computeDealRating(vehicle, allVehicles)
  const monthlyPayment = estimateMonthlyPayment(vehicle.price)
  const daysOnMarket = computeDaysOnMarket(vehicle.createdAt)
  const specialBadges = getSpecialBadges(vehicle)

  // Get comparables for market analysis chart
  const comparables = allVehicles.filter(
    (v) =>
      v.id !== vehicle.id &&
      v.make === vehicle.make &&
      (v.model === vehicle.model || v.bodyType === vehicle.bodyType) &&
      Math.abs(v.year - vehicle.year) <= 2,
  ).sort((a, b) => a.price - b.price).map((v) => ({
    id: v.id,
    title: v.title,
    year: v.year,
    price: v.price,
    mileage: v.mileage,
    slug: v.slug,
  }))

  return NextResponse.json({
    vehicle: {
      ...vehicle,
      deal,
      monthlyPayment,
      daysOnMarket,
      specialBadges,
    },
    similar,
    comparables,
  })
}
