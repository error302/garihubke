import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

  return NextResponse.json({ vehicle, similar })
}
