'use client'

import { cn } from '@/lib/utils'
import { formatKES, formatKESFull, formatMileage, formatNumber } from '@/lib/format'
import { useAppStore } from '@/lib/store'
import type { VehicleWithDealer } from '@/lib/types'
import { Heart, Gauge, Fuel, Settings2, MapPin, BadgeCheck, Sparkles, Eye, ArrowUpRight, GitCompare, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { DEAL_BADGE_STYLES } from '@/lib/market'

interface VehicleCardProps {
  vehicle: VehicleWithDealer
  variant?: 'default' | 'compact' | 'list' | 'editorial'
  index?: number
}

export function VehicleCard({ vehicle, variant = 'default', index = 0 }: VehicleCardProps) {
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const openDetail = useAppStore((s) => s.openDetail)
  const compareIds = useAppStore((s) => s.compareIds)
  const toggleCompare = useAppStore((s) => s.toggleCompare)

  const isFav = favorites.includes(vehicle.id)
  const inCompare = compareIds.includes(vehicle.id)
  const images = JSON.parse(vehicle.images || '[]') as string[]
  const features = JSON.parse(vehicle.features || '[]') as string[]
  const primaryImg = images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80'

  // ============ EDITORIAL variant — used in hero rail ============
  if (variant === 'editorial') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
        className="group relative cursor-pointer"
        onClick={() => openDetail(vehicle.slug)}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm">
          <img
            src={primaryImg}
            alt={vehicle.title}
            className="w-full h-full object-cover img-zoom"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-90" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {vehicle.isFeatured && (
              <span className="inline-flex items-center gap-1 bg-background/95 backdrop-blur text-foreground text-[9px] font-semibold tracking-wider uppercase px-2 py-1">
                <Sparkles className="w-2.5 h-2.5" /> Featured
              </span>
            )}
            {vehicle.condition === 'New' && (
              <span className="inline-flex items-center bg-brand text-brand-foreground text-[9px] font-semibold tracking-wider uppercase px-2 py-1">
                New
              </span>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(vehicle.id) }}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/95 backdrop-blur hover:bg-background transition"
            aria-label="Toggle favorite"
          >
            <Heart className={cn('w-3.5 h-3.5', isFav && 'fill-brand text-brand')} strokeWidth={1.5} />
          </button>

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
            <p className="text-[9px] uppercase tracking-[0.25em] opacity-80 mb-1">{vehicle.make} · {vehicle.year}</p>
            <h3 className="font-display text-lg font-medium leading-tight">{vehicle.model} {vehicle.variant}</h3>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-[10px] opacity-70 uppercase tracking-wider">Price</p>
                <p className="font-display text-base font-semibold">{formatKES(vehicle.price)}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] opacity-80">
                <span>{formatMileage(vehicle.mileage)}</span>
                <span className="w-1 h-1 rounded-full bg-background/40" />
                <span>{vehicle.fuelType}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  // ============ COMPACT variant — for similar/recently viewed ============
  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-card border border-edge rounded-sm overflow-hidden hover:border-foreground/20 transition-all cursor-pointer"
        onClick={() => openDetail(vehicle.slug)}
      >
        <div className="relative aspect-[16/11] overflow-hidden bg-muted">
          <img src={primaryImg} alt={vehicle.title} className="w-full h-full object-cover img-zoom" loading="lazy" />
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(vehicle.id) }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 backdrop-blur hover:bg-background transition"
            aria-label="Toggle favorite"
          >
            <Heart className={cn('w-3.5 h-3.5', isFav && 'fill-brand text-brand')} strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-3">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{vehicle.year}</p>
          <h3 className="font-display text-sm font-medium truncate mt-0.5">{vehicle.title}</h3>
          <p className="font-display text-sm font-semibold text-brand mt-1">{formatKES(vehicle.price)}</p>
        </div>
      </motion.article>
    )
  }

  // ============ LIST variant ============
  if (variant === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4) }}
        className="group relative grid grid-cols-[110px_1fr] sm:grid-cols-[220px_1fr] gap-3 sm:gap-6 bg-card rounded-sm border border-edge overflow-hidden hover:border-foreground/20 transition-all cursor-pointer"
        onClick={() => openDetail(vehicle.slug)}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-muted">
          <img src={primaryImg} alt={vehicle.title} className="w-full h-full object-cover img-zoom" loading="lazy" />
          {vehicle.isFeatured && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-background/95 backdrop-blur text-foreground text-[9px] font-semibold uppercase tracking-wider px-2 py-1">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>
        <div className="py-3 pr-3 sm:py-4 sm:pr-5 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{vehicle.year} · {vehicle.condition}</p>
              <h3 className="font-display text-base sm:text-xl font-medium leading-tight truncate mt-1">{vehicle.title}</h3>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(vehicle.id) }}
              className="shrink-0 p-1.5 rounded-full hover:bg-muted transition"
              aria-label="Toggle favorite"
            >
              <Heart className={cn('w-4 h-4', isFav && 'fill-brand text-brand')} strokeWidth={1.5} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Gauge className="w-3 h-3" strokeWidth={1.5} />{formatMileage(vehicle.mileage)}</span>
            <span className="inline-flex items-center gap-1"><Fuel className="w-3 h-3" strokeWidth={1.5} />{vehicle.fuelType}</span>
            <span className="inline-flex items-center gap-1"><Settings2 className="w-3 h-3" strokeWidth={1.5} />{vehicle.transmission}</span>
            {vehicle.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.5} />{vehicle.city}</span>}
          </div>
          <p className="hidden sm:block text-xs text-muted-foreground line-clamp-2 mt-3 max-w-md">{vehicle.description}</p>
          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Price</p>
              <p className="font-display text-xl font-semibold">{formatKES(vehicle.price)}</p>
              <p className="text-[10px] text-muted-foreground hidden sm:block">{formatKESFull(vehicle.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              {vehicle.dealer?.isVerified && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-foreground font-medium">
                  <BadgeCheck className="w-3 h-3 text-brand" strokeWidth={1.5} />{vehicle.dealer.name}
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); toggleCompare(vehicle.id) }}
                className={cn('p-1.5 rounded-full hover:bg-muted transition', inCompare && 'bg-brand/10 text-brand')}
                aria-label="Add to compare"
              >
                <GitCompare className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  // ============ DEFAULT — editorial card for browse grid ============
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
      className="group relative bg-card rounded-sm border border-edge overflow-hidden hover:border-foreground/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 cursor-pointer flex flex-col"
      onClick={() => openDetail(vehicle.slug)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={primaryImg}
          alt={vehicle.title}
          className="w-full h-full object-cover img-zoom"
          loading="lazy"
        />
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {/* Deal rating badge — the hero feature */}
          {(vehicle as any).deal && (vehicle as any).deal.rating !== 'fair' && (
            <span className={cn('inline-flex items-center gap-1 text-[9px] font-semibold tracking-wider uppercase px-2 py-1', DEAL_BADGE_STYLES[(vehicle as any).deal.rating])}>
              {(vehicle as any).deal.rating === 'great' || (vehicle as any).deal.rating === 'good' ? <TrendingDown className="w-2.5 h-2.5" /> : null}
              {(vehicle as any).deal.label}
            </span>
          )}
          {vehicle.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-background/95 backdrop-blur text-foreground text-[9px] font-semibold tracking-wider uppercase px-2 py-1">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
          {vehicle.condition === 'New' && (
            <span className="inline-flex items-center bg-brand text-brand-foreground text-[9px] font-semibold tracking-wider uppercase px-2 py-1">
              New
            </span>
          )}
          {(vehicle as any).daysOnMarket <= 7 && (
            <span className="inline-flex items-center bg-foreground text-background text-[9px] font-semibold tracking-wider uppercase px-2 py-1">
              New listing
            </span>
          )}
          {vehicle.isVerified && (
            <span className="inline-flex items-center gap-1 bg-background/95 backdrop-blur text-foreground text-[9px] font-semibold tracking-wider uppercase px-2 py-1">
              <BadgeCheck className="w-2.5 h-2.5 text-brand" strokeWidth={2} /> Verified
            </span>
          )}
        </div>
        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(vehicle.id) }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/95 backdrop-blur hover:bg-background transition"
          aria-label="Toggle favorite"
        >
          <Heart className={cn('w-4 h-4', isFav ? 'fill-brand text-brand' : 'text-foreground')} strokeWidth={1.5} />
        </button>
        {/* Compare */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleCompare(vehicle.id) }}
          className={cn(
            'absolute bottom-3 right-3 p-2 rounded-full backdrop-blur transition',
            inCompare ? 'bg-brand text-brand-foreground' : 'bg-background/95 hover:bg-background text-foreground',
          )}
          aria-label="Add to compare"
        >
          <GitCompare className="w-4 h-4" strokeWidth={1.5} />
        </button>
        {/* Views */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-background/95 backdrop-blur text-foreground text-[10px] font-medium px-2 py-1">
          <Eye className="w-3 h-3" strokeWidth={1.5} /> {formatNumber(vehicle.viewsCount)}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{vehicle.year} · {vehicle.condition}</p>
          {vehicle.city && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="w-3 h-3" strokeWidth={1.5} />{vehicle.city}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg sm:text-xl font-medium leading-tight mt-1.5 line-clamp-2">{vehicle.title}</h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" strokeWidth={1.5} />{formatMileage(vehicle.mileage)}</span>
          <span className="inline-flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" strokeWidth={1.5} />{vehicle.fuelType}</span>
          <span className="inline-flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" strokeWidth={1.5} />{vehicle.transmission}</span>
        </div>

        {features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {features.slice(0, 2).map((f) => (
              <span key={f} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5">{f}</span>
            ))}
            {features.length > 2 && (
              <span className="text-[10px] text-muted-foreground px-1 py-0.5">+{features.length - 2} more</span>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-edge flex items-end justify-between">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">Price</p>
            <p className="font-display text-xl sm:text-2xl font-semibold">{formatKES(vehicle.price)}</p>
            {(vehicle as any).monthlyPayment && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                <span className="text-brand font-medium">{formatKES((vehicle as any).monthlyPayment)}/mo</span> est.
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {vehicle.dealer?.isVerified && (
              <span className="inline-flex items-center gap-1 text-[10px] text-foreground font-medium">
                <BadgeCheck className="w-3 h-3 text-brand" strokeWidth={2} /> {vehicle.dealer.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] text-foreground font-medium group-hover:text-brand transition">
              View <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
