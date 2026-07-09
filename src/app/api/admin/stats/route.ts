import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/stats — dashboard KPIs + chart data
export async function GET() {
  const totalVehicles = await db.vehicle.count({ where: { status: 'active' } })
  const totalDealers = await db.dealer.count()
  const totalLeads = await db.lead.count()
  const totalUsers = await db.user.count()
  const featuredVehicles = await db.vehicle.count({ where: { isFeatured: true } })
  const premiumVehicles = await db.vehicle.count({ where: { isPremium: true } })
  const totalReviews = await db.review.count()
  const avgRatingAgg = await db.review.aggregate({ _avg: { rating: true } })
  const avgRating = Number(avgRatingAgg._avg.rating?.toFixed(2)) || 0

  // Total inventory value
  const priceAgg = await db.vehicle.aggregate({ _sum: { price: true } })
  const inventoryValue = priceAgg._sum.price || 0

  // Total leads value (sum of lead.budget)
  const budgetAgg = await db.lead.aggregate({ _sum: { budget: true } })
  const pipelineValue = budgetAgg._sum.budget || 0

  // Leads by type
  const leadsByTypeRaw = await db.lead.groupBy({ by: ['type'], _count: { _all: true } })
  const leadsByType = leadsByTypeRaw.map((r) => ({ name: r.type, value: r._count._all }))

  // Leads by status
  const leadsByStatusRaw = await db.lead.groupBy({ by: ['status'], _count: { _all: true } })
  const leadsByStatus = leadsByStatusRaw.map((r) => ({ name: r.status, value: r._count._all }))

  // Top makes by inventory count
  const topMakesRaw = await db.vehicle.groupBy({ by: ['make'], _count: { _all: true }, orderBy: { _count: { make: 'desc' } }, take: 8 })
  const topMakes = topMakesRaw.map((r) => ({ name: r.make, value: r._count._all }))

  // Top body types
  const topBodyRaw = await db.vehicle.groupBy({ by: ['bodyType'], _count: { _all: true } })
  const topBody = topBodyRaw.map((r) => ({ name: r.bodyType, value: r._count._all }))

  // Top fuel types
  const topFuelRaw = await db.vehicle.groupBy({ by: ['fuelType'], _count: { _all: true } })
  const topFuel = topFuelRaw.map((r) => ({ name: r.fuelType, value: r._count._all }))

  // Recent 14-day leads trend
  const since = new Date()
  since.setDate(since.getDate() - 14)
  const recentLeads = await db.lead.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } })
  const byDay: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    byDay[key] = 0
  }
  for (const l of recentLeads) {
    const k = l.createdAt.toISOString().slice(0, 10)
    if (k in byDay) byDay[k]++
  }
  const leadsTrend = Object.entries(byDay).map(([date, count]) => ({ date, count }))

  // Top dealers by inventory
  const dealers = await db.dealer.findMany({ include: { _count: { select: { vehicles: true } } }, orderBy: { totalSales: 'desc' }, take: 6 })
  const topDealers = dealers.map((d) => ({ name: d.name, value: (d as any)._count.vehicles, sales: d.totalSales, rating: d.rating }))

  // Top viewed vehicles
  const topViewed = await db.vehicle.findMany({ orderBy: { viewsCount: 'desc' }, take: 6, include: { dealer: true } })

  return NextResponse.json({
    totals: {
      totalVehicles, totalDealers, totalLeads, totalUsers,
      featuredVehicles, premiumVehicles, totalReviews, avgRating,
      inventoryValue, pipelineValue,
    },
    charts: {
      leadsByType, leadsByStatus, topMakes, topBody, topFuel,
      leadsTrend, topDealers,
    },
    topViewed,
  })
}
