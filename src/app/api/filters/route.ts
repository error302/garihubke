import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/filters — distinct facet values for the browse filter UI
export async function GET() {
  const vehicles = await db.vehicle.findMany({ where: { status: 'active' } })
  const uniq = (arr: string[]) => Array.from(new Set(arr)).sort()
  const makes = uniq(vehicles.map((v) => v.make))
  const models = uniq(vehicles.map((v) => v.model))
  const bodyTypes = uniq(vehicles.map((v) => v.bodyType))
  const fuelTypes = uniq(vehicles.map((v) => v.fuelType))
  const transmissions = uniq(vehicles.map((v) => v.transmission))
  const drivetrains = uniq(vehicles.map((v) => v.drivetrain))
  const conditions = uniq(vehicles.map((v) => v.condition))
  const cities = uniq(vehicles.map((v) => v.city).filter(Boolean) as string[])
  const years = vehicles.map((v) => v.year).sort((a, b) => b - a)
  const minYear = years.length ? years[years.length - 1] : 2010
  const maxYear = years.length ? years[0] : 2025
  const prices = vehicles.map((v) => v.price).sort((a, b) => a - b)
  const minPrice = prices.length ? prices[0] : 0
  const maxPrice = prices.length ? prices[prices.length - 1] : 20000000

  return NextResponse.json({
    makes, models, bodyTypes, fuelTypes, transmissions, drivetrains, conditions, cities,
    yearRange: { min: minYear, max: maxYear },
    priceRange: { min: minPrice, max: maxPrice },
  })
}
