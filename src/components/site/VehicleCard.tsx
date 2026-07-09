'use client'

import { cn } from '@/lib/utils'
import { formatKES, formatKESFull, formatMileage, formatNumber } from '@/lib/format'
import { useAppStore } from '@/lib/store'
import type { VehicleWithDealer } from '@/lib/types'
import { Heart, Gauge, Fuel, Settings2, MapPin, BadgeCheck, Sparkles, Eye, ArrowRight, GitCompare } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface VehicleCardProps {
  vehicle: VehicleWithDealer
  variant?: 'default' | 'compact' | 'list'
  index?: number
}

export function VehicleCard({ vehicle, variant = 'default', index = 0 }: VehicleCardProps) {
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const openDetail = useAppStore((s) => s.openDetail)
  const compareIds = useAppStore((s) => s.compareIds)
  const toggleCompare = useAppStore((s) => s.toggleCompare)
  const setView = useAppStore((s) => s.setView)

  const isFav = favorites.includes(vehicle.id)
  const inCompare = compareIds.includes(vehicle.id)
  const images = JSON.parse(vehicle.images || '[]') as string[]
  const features = JSON.parse(vehicle.features || '[]') as string[]
  const primaryImg = images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80'

  if (variant === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4) }}
        className="group relative grid grid-cols-[120px_1fr] sm:grid-cols-[200px_1fr] gap-3 sm:gap-5 bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all cursor-pointer"
        onClick={() => openDetail(vehicle.slug)}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-muted">
          <img src={primaryImg} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          {vehicle.isFeatured && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-brand text-brand-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
        <div className="py-3 pr-3 sm:py-4 sm:pr-4 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{vehicle.year} · {vehicle.condition}</p>
              <h3 className="font-display text-base sm:text-lg font-semibold leading-tight truncate">{vehicle.title}</h3>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(vehicle.id) }}
              className="shrink-0 p-1.5 rounded-full hover:bg-muted transition"
              aria-label="Toggle favorite"
            >
              <Heart className={cn('w-4 h-4', isFav && 'fill-red-500 text-red-500')} />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Gauge className="w-3 h-3" />{formatMileage(vehicle.mileage)}</span>
            <span className="inline-flex items-center gap-1"><Fuel className="w-3 h-3" />{vehicle.fuelType}</span>
            <span className="inline-flex items-center gap-1"><Settings2 className="w-3 h-3" />{vehicle.transmission}</span>
            {vehicle.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{vehicle.city}</span>}
          </div>
          <p className="hidden sm:Block text-xs text-muted-foreground line-clamp-2 mt-2">{vehicle.description}</p>
          <div className="mt-auto flex items-end justify-between pt-2">
            <div>
              <p className="text-[11px] text-muted-foreground">Price</p>
              <p className="font-display font-bold text-lg sm:text-xl">{formatKES(vehicle.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              {vehicle.dealer?.isVerified && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-brand font-medium">
                  <BadgeCheck className="w-3 h-3" />{vehicle.dealer.name}
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); toggleCompare(vehicle.id) }}
                className={cn('p-1.5 rounded-full hover:bg-muted transition', inCompare && 'bg-brand/10 text-brand')}
                aria-label="Add to compare"
              >
                <GitCompare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all cursor-pointer"
        onClick={() => openDetail(vehicle.slug)}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img src={primaryImg} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(vehicle.id) }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-background transition"
            aria-label="Toggle favorite"
          >
            <Heart className={cn('w-3.5 h-3.5', isFav && 'fill-red-500 text-red-500')} />
          </button>
        </div>
        <div className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{vehicle.year}</p>
          <h3 className="font-display text-sm font-semibold truncate">{vehicle.title}</h3>
          <p className="font-display text-sm font-bold text-brand mt-1">{formatKES(vehicle.price)}</p>
        </div>
      </motion.article>
    )
  }

  // default — premium card
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:border-brand/30 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => openDetail(vehicle.slug)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={primaryImg}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {vehicle.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-brand text-brand-foreground text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          {vehicle.condition === 'New' && (
            <span className="inline-flex items-center gap-1 bg-foreground text-background text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {vehicle.isVerified && (
            <span className="inline-flex items-center gap-1 bg-background/90 backdrop-blur text-foreground text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
              <BadgeCheck className="w-3 h-3 text-brand" /> Verified
            </span>
          )}
        </div>
        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(vehicle.id) }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition shadow-sm"
          aria-label="Toggle favorite"
        >
          <Heart className={cn('w-4 h-4', isFav ? 'fill-red-500 text-red-500' : 'text-foreground')} />
        </button>
        {/* Compare */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleCompare(vehicle.id) }}
          className={cn(
            'absolute bottom-3 right-3 p-2 rounded-full backdrop-blur transition shadow-sm',
            inCompare ? 'bg-brand text-brand-foreground' : 'bg-background/80 hover:bg-background text-foreground',
          )}
          aria-label="Add to compare"
        >
          <GitCompare className="w-4 h-4" />
        </button>
        {/* Views */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-background/80 backdrop-blur text-foreground text-[10px] font-medium px-2 py-1 rounded-full shadow-sm">
          <Eye className="w-3 h-3" /> {formatNumber(vehicle.viewsCount)}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{vehicle.year} · {vehicle.condition}</p>
          {vehicle.city && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
              <MapPin className="w-3 h-3" />{vehicle.city}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold leading-tight mt-1 line-clamp-2">{vehicle.title}</h3>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" />{formatMileage(vehicle.mileage)}</span>
          <span className="inline-flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" />{vehicle.fuelType}</span>
          <span className="inline-flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" />{vehicle.transmission}</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 inline-flex items-center justify-center text-[10px] font-bold">{vehicle.drivetrain.slice(0,3)}</span>{vehicle.drivetrain}</span>
        </div>

        {features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {features.slice(0, 3).map((f) => (
              <span key={f} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{f}</span>
            ))}
            {features.length > 3 && (
              <span className="text-[10px] text-muted-foreground px-1 py-0.5">+{features.length - 3} more</span>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Price</p>
            <p className="font-display text-xl font-bold">{formatKES(vehicle.price)}</p>
            <p className="text-[10px] text-muted-foreground hidden sm:block">{formatKESFull(vehicle.price)}</p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            {vehicle.dealer?.isVerified && (
              <span className="inline-flex items-center gap-1 text-[10px] text-brand font-medium">
                <BadgeCheck className="w-3 h-3" /> {vehicle.dealer.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] text-foreground font-medium group-hover:text-brand transition">
              View details <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
