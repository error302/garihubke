import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/vehicles — list with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const make = searchParams.get('make')
  const model = searchParams.get('model')
  const bodyType = searchParams.get('bodyType')
  const fuelType = searchParams.get('fuelType')
  const transmission = searchParams.get('transmission')
  const drivetrain = searchParams.get('drivetrain')
  const condition = searchParams.get('condition')
  const city = searchParams.get('city')
  const q = searchParams.get('q')?.toLowerCase()
  const minYear = searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined
  const maxYear = searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const minMileage = searchParams.get('minMileage') ? Number(searchParams.get('minMileage')) : undefined
  const maxMileage = searchParams.get('maxMileage') ? Number(searchParams.get('maxMileage')) : undefined
  const sort = searchParams.get('sort') || 'relevance'
  const featuredOnly = searchParams.get('featured') === '1'
  const premiumOnly = searchParams.get('premium') === '1'
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 100

  const where: any = { status: 'active' }
  if (make) where.make = make
  if (model) where.model = { contains: model }
  if (bodyType) where.bodyType = bodyType
  if (fuelType) where.fuelType = fuelType
  if (transmission) where.transmission = transmission
  if (drivetrain) where.drivetrain = drivetrain
  if (condition) where.condition = condition
  if (city) where.city = city
  if (featuredOnly) where.isFeatured = true
  if (premiumOnly) where.isPremium = true
  if (minYear || maxYear) where.year = { ...(minYear && { gte: minYear }), ...(maxYear && { lte: maxYear }) }
  if (minPrice || maxPrice) where.price = { ...(minPrice && { gte: minPrice }), ...(maxPrice && { lte: maxPrice }) }
  if (minMileage || maxMileage) where.mileage = { ...(minMileage && { gte: minMileage }), ...(maxMileage && { lte: maxMileage }) }
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { make: { contains: q } },
      { model: { contains: q } },
      { variant: { contains: q } },
    ]
  }

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price-asc') orderBy = { price: 'asc' }
  if (sort === 'price-desc') orderBy = { price: 'desc' }
  if (sort === 'year-desc') orderBy = { year: 'desc' }
  if (sort === 'year-asc') orderBy = { year: 'asc' }
  if (sort === 'mileage-asc') orderBy = { mileage: 'asc' }
  if (sort === 'popular') orderBy = { viewsCount: 'desc' }

  const vehicles = await db.vehicle.findMany({
    where,
    orderBy,
    take: limit,
    include: { dealer: true },
  })
  return NextResponse.json({ vehicles })
}
