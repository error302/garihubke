import type { Vehicle, Dealer, Lead, Review, Article } from '@prisma/client'

export type VehicleWithDealer = Vehicle & { dealer: Dealer | null }
export type VehicleWithDetails = Vehicle & {
  dealer: Dealer | null
  reviews: Review[]
}
export type DealerWithCounts = Dealer & { _count: { vehicles: number } }

export interface Filters {
  q?: string
  make?: string
  bodyType?: string
  fuelType?: string
  transmission?: string
  drivetrain?: string
  condition?: string
  city?: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  minMileage?: number
  maxMileage?: number
  sort?: string
  featured?: boolean
  premium?: boolean
}

export const EMPTY_FILTERS: Filters = { sort: 'relevance' }

export type ViewKey =
  | 'home'
  | 'browse'
  | 'favorites'
  | 'compare'
  | 'sell'
  | 'finance'
  | 'admin'
  | 'articles'
  | 'dealers'
