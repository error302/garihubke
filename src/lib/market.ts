// Market analysis helpers — inspired by CarGurus Deal Rating + TrueCar Price Curve

import type { Vehicle } from '@prisma/client'

export type DealRating = 'great' | 'good' | 'fair' | 'high'

export interface DealAnalysis {
  rating: DealRating
  label: string
  savings: number
  savingsPct: number
  marketAvg: number
  belowMarket: boolean
}

// Compute the market average price for a vehicle based on comparable listings.
// Comparables = same make + (same model OR same bodyType), within ±2 years.
export function computeMarketAverage(vehicle: Vehicle, allVehicles: Vehicle[]): number {
  const comparables = allVehicles.filter(
    (v) =>
      v.id !== vehicle.id &&
      v.status === 'active' &&
      v.make === vehicle.make &&
      (v.model === vehicle.model || v.bodyType === vehicle.bodyType) &&
      Math.abs(v.year - vehicle.year) <= 2,
  )
  if (comparables.length === 0) {
    // Fall back to same bodyType
    const byBody = allVehicles.filter((v) => v.id !== vehicle.id && v.status === 'active' && v.bodyType === vehicle.bodyType)
    if (byBody.length === 0) return vehicle.price
    return Math.round(byBody.reduce((s, v) => s + v.price, 0) / byBody.length)
  }
  return Math.round(comparables.reduce((s, v) => s + v.price, 0) / comparables.length)
}

export function computeDealRating(vehicle: Vehicle, allVehicles: Vehicle[]): DealAnalysis {
  const marketAvg = computeMarketAverage(vehicle, allVehicles)
  const diff = marketAvg - vehicle.price
  const savingsPct = marketAvg > 0 ? (diff / marketAvg) * 100 : 0

  let rating: DealRating = 'fair'
  let label = 'Fair price'

  if (savingsPct >= 8) {
    rating = 'great'
    label = 'Great price'
  } else if (savingsPct >= 3) {
    rating = 'good'
    label = 'Good price'
  } else if (savingsPct <= -8) {
    rating = 'high'
    label = 'Above market'
  }

  return {
    rating,
    label,
    savings: Math.max(0, diff),
    savingsPct: Math.round(savingsPct),
    marketAvg,
    belowMarket: diff > 0,
  }
}

// Default monthly payment estimate (10% down, 14% APR, 60 months)
export function estimateMonthlyPayment(price: number): number {
  const down = price * 0.1
  const principal = price - down
  const r = 0.14 / 12
  const months = 60
  const monthly = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  return Math.round(monthly)
}

// Days on market
export function computeDaysOnMarket(createdAt: Date): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
}

// Deal rating badge styles
export const DEAL_BADGE_STYLES: Record<DealRating, string> = {
  great: 'bg-emerald-600 text-white',
  good: 'bg-emerald-500/90 text-white',
  fair: 'bg-muted text-muted-foreground',
  high: 'bg-amber-500/90 text-white',
}

export const DEAL_DOT_STYLES: Record<DealRating, string> = {
  great: 'bg-emerald-500',
  good: 'bg-emerald-400',
  fair: 'bg-muted-foreground',
  high: 'bg-amber-500',
}

// Special badges — "New listing", "Price drop", "Low mileage", "Certified"
export function getSpecialBadges(vehicle: Vehicle): { label: string; style: string }[] {
  const badges: { label: string; style: string }[] = []
  const days = computeDaysOnMarket(vehicle.createdAt)
  if (days <= 7) badges.push({ label: 'New listing', style: 'bg-foreground text-background' })
  if (vehicle.mileage != null && vehicle.mileage < 15000 && vehicle.condition !== 'New') {
    badges.push({ label: 'Low mileage', style: 'bg-brand/15 text-brand' })
  }
  if (vehicle.condition === 'Certified Pre-Owned') {
    badges.push({ label: 'Certified', style: 'bg-brand text-brand-foreground' })
  }
  if (vehicle.isFeatured) {
    badges.push({ label: 'Featured', style: 'bg-brand text-brand-foreground' })
  }
  return badges
}
