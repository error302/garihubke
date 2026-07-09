'use client'

import { useAppStore } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import { VehicleCard } from './VehicleCard'
import { FilterBar } from './FilterBar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Search, Shield, Truck, Calculator, Award, ArrowRight, MapPin,
  Gauge, Fuel, Settings2, Star, BadgeCheck, Newspaper, TrendingUp, Heart, GitCompare, X,
  LayoutGrid, ChevronRight, ArrowUpRight,
} from 'lucide-react'
import { formatKES, formatKESFull, formatNumber, formatMileage } from '@/lib/format'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ============== HERO — editorial, cinematic ==============
export function HeroView() {
  const setView = useAppStore((s) => s.setView)
  const setFilters = useAppStore((s) => s.setFilters)
  const [q, setQ] = useState('')

  const { data: featured } = useQuery({
    queryKey: ['featured-vehicles'],
    queryFn: async () => {
      const r = await fetch('/api/vehicles?featured=1&limit=5')
      const d = await r.json()
      return d.vehicles as any[]
    },
    staleTime: 60 * 1000,
  })

  const startSearch = () => {
    setFilters({ q })
    setView('browse')
  }

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Background image — full bleed */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=2000&q=85"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </div>

        <div className="container-premium relative pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">Kenya · Est. 2024</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-medium tracking-[-0.03em] leading-[0.95] text-balance">
              The car you<br />
              <span className="italic font-light text-brand">deserve</span> is here.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl text-pretty font-light leading-relaxed">
              A curated marketplace for Kenya's finest vehicles. Verified dealers, refined search, M-Pesa finance in minutes.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-3xl"
          >
            <div className="bg-card/95 backdrop-blur border border-edge p-2 flex flex-col sm:flex-row gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startSearch()}
                  placeholder="Search by make, model or keyword…"
                  className="w-full h-12 pl-10 pr-3 bg-background border-0 text-sm focus:outline-none"
                />
              </div>
              <Button onClick={startSearch} className="h-12 px-7 bg-foreground hover:bg-foreground/90 text-background gap-2 rounded-none">
                <Search className="w-4 h-4" strokeWidth={1.5} /> Search
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Popular:</span>
              {['Land Cruiser', 'Prado', 'Hilux', 'RAV4', 'Range Rover'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setFilters({ q: t }); setView('browse') }}
                  className="text-foreground/80 hover:text-brand transition"
                >{t}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="border-y border-edge bg-card">
        <div className="container-premium py-8 grid grid-cols-2 lg:grid-cols-4 divide-x divide-edge">
          {[
            { value: '247', label: 'Vehicles in stock' },
            { value: '6', label: 'Verified dealers' },
            { value: '12K+', label: 'Active buyers' },
            { value: '4.7★', label: 'Average rating' },
          ].map((s) => (
            <div key={s.label} className="px-4 first:pl-0 last:pr-0 text-center sm:text-left">
              <p className="font-display text-3xl lg:text-4xl font-medium tracking-tight">{s.value}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED — editorial rail ============ */}
      <section className="container-premium py-12 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Handpicked · 01</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Featured vehicles</h2>
          </div>
          <Button variant="ghost" onClick={() => setView('browse')} className="text-brand hidden sm:inline-flex">
            View all <ArrowUpRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Editorial rail — 1 large + smaller cards */}
        {featured && featured.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Large hero card */}
            <div className="lg:col-span-7">
              <VehicleCard vehicle={featured[0]} variant="editorial" index={0} />
            </div>
            {/* Stacked smaller cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
              {featured.slice(1, 5).map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} variant="editorial" index={i + 1} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============ PERKS — editorial grid ============ */}
      <section className="bg-foreground text-background py-16 sm:py-24">
        <div className="container-premium">
          <div className="max-w-2xl mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-background/60 mb-2">Why GariHub · 02</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
              Buy with<br /><span className="italic font-light text-brand">confidence.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Money-back guarantee', desc: 'Not in love within 7 days? Return it, no questions asked. We mean it.' },
              { icon: BadgeCheck, title: 'Verified dealers', desc: 'Every dealer vetted in person. Every car inspected by our 200-point checklist.' },
              { icon: Calculator, title: 'M-Pesa finance', desc: 'Pre-qualify in 5 minutes. Drive home today. Powered by NCBA, KCB, Equity.' },
              { icon: Truck, title: 'Nationwide delivery', desc: 'Mombasa to Eldoret. Free on premium vehicles. White-glove service.' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group"
              >
                <div className="w-10 h-10 mb-5 flex items-center justify-center border border-background/20 group-hover:border-brand transition">
                  <v.icon className="w-5 h-5 text-brand" strokeWidth={1.5} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">0{i + 1}</p>
                <h3 className="font-display text-xl font-medium mb-2">{v.title}</h3>
                <p className="text-sm text-background/70 font-light leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BROWSE BY MAKE ============ */}
      <BrowseByMake />

      {/* ============ ARTICLES ============ */}
      <ArticlesTeaser />

      {/* ============ SELL CTA ============ */}
      <section className="container-premium py-16 sm:py-24">
        <div className="bg-card border border-edge p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">For sellers · 03</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.05]">
              Selling your car?<br /><span className="italic font-light text-brand">List in 2 minutes.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty font-light max-w-md">
              Reach 200,000+ serious buyers across Kenya. Free for individuals — premium tools for dealers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setView('sell')} className="h-12 px-7 bg-foreground hover:bg-foreground/90 text-background gap-2">
                List your car <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Button onClick={() => setView('browse')} variant="outline" className="h-12 px-7 border-edge gap-2">
                Browse inventory
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function BrowseByMake() {
  const setFilters = useAppStore((s) => s.setFilters)
  const setView = useAppStore((s) => s.setView)

  const { data } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => (await (await fetch('/api/filters')).json()) as { makes: string[] },
    staleTime: 5 * 60 * 1000,
  })

  const makes = data?.makes || []

  return (
    <section className="container-premium py-12 sm:py-20">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Browse · 04</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">By manufacturer</h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-px bg-edge border border-edge">
        {makes.map((m) => (
          <button
            key={m}
            onClick={() => { setFilters({ make: m }); setView('browse') }}
            className="group bg-card p-5 text-left hover:bg-muted/40 transition"
          >
            <p className="font-display text-lg font-medium tracking-tight">{m}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-brand transition">Browse →</p>
          </button>
        ))}
      </div>
    </section>
  )
}

function ArticlesTeaser() {
  const setView = useAppStore((s) => s.setView)
  const { data } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => (await (await fetch('/api/articles')).json()).articles as any[],
    staleTime: 5 * 60 * 1000,
  })
  if (!data || data.length === 0) return null

  return (
    <section className="container-premium py-12 sm:py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Journal · 05</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Guides & insights</h2>
        </div>
        <Button variant="ghost" onClick={() => setView('articles')} className="text-brand hidden sm:inline-flex">
          All guides <ArrowUpRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {data.slice(0, 3).map((a, i) => (
          <button
            key={a.id}
            onClick={() => setView('articles')}
            className="group text-left"
          >
            <div className="aspect-[16/10] bg-muted overflow-hidden mb-4 relative">
              <img
                src={i === 0 ? 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80' :
                     i === 1 ? 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80' :
                               'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80'}
                alt=""
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-background/95 backdrop-blur text-foreground text-[9px] font-semibold tracking-wider uppercase px-2 py-1">{a.category}</span>
              </div>
            </div>
            <h3 className="font-display text-xl lg:text-2xl font-medium leading-tight line-clamp-2 group-hover:text-brand transition">{a.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-light">{a.excerpt}</p>
            <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">{a.author} · {a.readMins} min read</p>
          </button>
        ))}
      </div>
    </section>
  )
}

// ============== BROWSE ==============
export function BrowseView() {
  const filters = useAppStore((s) => s.filters)
  const setFilters = useAppStore((s) => s.setFilters)
  const resetFilters = useAppStore((s) => s.resetFilters)

  const queryStr = new URLSearchParams(
    Object.entries(filters).reduce((acc, [k, v]) => {
      if (v != null && v !== '' && !(typeof v === 'boolean' && !v)) acc[k] = String(v)
      return acc
    }, {} as Record<string, string>),
  ).toString()

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', queryStr],
    queryFn: async () => {
      const r = await fetch(`/api/vehicles?${queryStr}`)
      const d = await r.json()
      return d.vehicles as any[]
    },
    staleTime: 30 * 1000,
  })

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="container-premium py-8 sm:py-12 space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Browse</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">All vehicles</h1>
        <p className="text-sm text-muted-foreground mt-2 font-light">
          {data ? `${data.length} ${data.length === 1 ? 'vehicle' : 'vehicles'} found` : 'Loading…'}
        </p>
      </div>
      <FilterBar />

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-px bg-edge border border-edge">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('px-4 py-2 text-xs font-medium transition flex items-center gap-1.5', viewMode === 'grid' ? 'bg-foreground text-background' : 'bg-card text-muted-foreground hover:text-foreground')}
          >
            <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.5} /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('px-4 py-2 text-xs font-medium transition flex items-center gap-1.5', viewMode === 'list' ? 'bg-foreground text-background' : 'bg-card text-muted-foreground hover:text-foreground')}
          >
            <span className="text-base leading-none">≡</span> List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-edge overflow-hidden">
              <div className="aspect-[4/3] shimmer" />
              <div className="p-5 space-y-2">
                <div className="h-3 w-1/3 shimmer" />
                <div className="h-5 w-2/3 shimmer" />
                <div className="h-3 w-full shimmer mt-3" />
                <div className="h-8 w-1/2 shimmer mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.length === 0 ? (
        <div className="text-center py-24 bg-card border border-edge">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
          <h3 className="font-display text-xl font-medium">No vehicles match</h3>
          <p className="text-sm text-muted-foreground mt-2 font-light">Try widening your price range or removing some filters.</p>
          <Button onClick={() => resetFilters()} variant="outline" className="mt-4 border-edge">Reset filters</Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {data?.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} variant="list" index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

// ============== FAVORITES ==============
export function FavoritesView() {
  const favorites = useAppStore((s) => s.favorites)
  const setView = useAppStore((s) => s.setView)

  const { data, isLoading } = useQuery({
    queryKey: ['favorites', favorites.join(',')],
    queryFn: async () => {
      if (favorites.length === 0) return []
      const r = await fetch('/api/vehicles?limit=200')
      const d = await r.json()
      return (d.vehicles as any[]).filter((v) => favorites.includes(v.id))
    },
    enabled: favorites.length > 0,
  })

  return (
    <div className="container-premium py-8 sm:py-12 space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Your collection</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Saved vehicles</h1>
        <p className="text-sm text-muted-foreground mt-2 font-light">{favorites.length} saved · synced across your devices</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-card border border-edge overflow-hidden"><div className="aspect-[4/3] shimmer" /><div className="p-5 h-32" /></div>)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-24 bg-card border border-edge">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
          <h3 className="font-display text-xl font-medium">No saved vehicles yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto font-light">Tap the heart on any vehicle to save it here. We'll alert you when prices drop.</p>
          <Button onClick={() => setView('browse')} className="mt-5 bg-foreground hover:bg-foreground/90 text-background">Browse vehicles</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {data?.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
        </div>
      )}
    </div>
  )
}

// ============== COMPARE ==============
export function CompareView() {
  const compareIds = useAppStore((s) => s.compareIds)
  const clearCompare = useAppStore((s) => s.clearCompare)
  const setView = useAppStore((s) => s.setView)
  const openDetail = useAppStore((s) => s.openDetail)

  const { data, isLoading } = useQuery({
    queryKey: ['compare', compareIds.join(',')],
    queryFn: async () => {
      if (compareIds.length === 0) return []
      const r = await fetch('/api/vehicles?limit=200')
      const d = await r.json()
      return (d.vehicles as any[]).filter((v) => compareIds.includes(v.id))
    },
    enabled: compareIds.length > 0,
  })

  const rows = [
    { k: 'price', label: 'Price', format: (v: any) => formatKESFull(v.price) },
    { k: 'year', label: 'Year', format: (v: any) => v.year },
    { k: 'mileage', label: 'Mileage', format: (v: any) => formatMileage(v.mileage) },
    { k: 'bodyType', label: 'Body', format: (v: any) => v.bodyType },
    { k: 'fuelType', label: 'Fuel', format: (v: any) => v.fuelType },
    { k: 'transmission', label: 'Transmission', format: (v: any) => v.transmission },
    { k: 'drivetrain', label: 'Drivetrain', format: (v: any) => v.drivetrain },
    { k: 'horsepower', label: 'Power', format: (v: any) => v.horsepower ? `${v.horsepower} hp` : '—' },
    { k: 'torque', label: 'Torque', format: (v: any) => v.torque ? `${v.torque} Nm` : '—' },
    { k: 'doors', label: 'Doors', format: (v: any) => v.doors },
    { k: 'seats', label: 'Seats', format: (v: any) => v.seats },
    { k: 'exteriorColor', label: 'Exterior', format: (v: any) => v.exteriorColor || '—' },
    { k: 'interiorColor', label: 'Interior', format: (v: any) => v.interiorColor || '—' },
    { k: 'city', label: 'Location', format: (v: any) => v.city || '—' },
    { k: 'condition', label: 'Condition', format: (v: any) => v.condition },
    { k: 'viewsCount', label: 'Views', format: (v: any) => formatNumber(v.viewsCount) },
    { k: 'favoritesCount', label: 'Saves', format: (v: any) => formatNumber(v.favoritesCount) },
  ]

  return (
    <div className="container-premium py-8 sm:py-12 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Side by side</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Compare</h1>
          <p className="text-sm text-muted-foreground mt-2 font-light">Up to 3 vehicles</p>
        </div>
        {compareIds.length > 0 && (
          <Button variant="outline" onClick={clearCompare} className="border-edge"><X className="w-4 h-4 mr-1" strokeWidth={1.5} /> Clear all</Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">Loading…</div>
      ) : compareIds.length === 0 ? (
        <div className="text-center py-24 bg-card border border-edge">
          <GitCompare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
          <h3 className="font-display text-xl font-medium">Nothing to compare yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto font-light">Tap the compare icon on any vehicle to add it here. Add 2 or 3 to see them side-by-side.</p>
          <Button onClick={() => setView('browse')} className="mt-5 bg-foreground hover:bg-foreground/90 text-background">Browse vehicles</Button>
        </div>
      ) : (
        <div className="overflow-x-auto premium-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium p-3 w-32">Specification</th>
                {data?.map((v) => {
                  const imgs = JSON.parse(v.images || '[]') as string[]
                  return (
                    <th key={v.id} className="p-3 align-top min-w-[220px]">
                      <button onClick={() => openDetail(v.slug)} className="block w-full text-left group">
                        <div className="aspect-[16/10] overflow-hidden bg-muted mb-3">
                          <img src={imgs[0]} alt={v.title} className="w-full h-full object-cover img-zoom" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{v.year} · {v.condition}</p>
                        <p className="font-display font-medium text-base line-clamp-2 mt-1 group-hover:text-brand transition">{v.title}</p>
                      </button>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.k} className={cn(ri % 2 === 0 ? 'bg-muted/30' : '')}>
                  <td className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium p-3">{row.label}</td>
                  {data?.map((v) => (
                    <td key={v.id} className="p-3 text-sm font-medium font-display">
                      {row.format(v)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-3" />
                {data?.map((v) => (
                  <td key={v.id} className="p-3">
                    <Button size="sm" variant="outline" onClick={() => openDetail(v.slug)} className="w-full border-edge">View details</Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============== SELL ==============
export function SellView() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    make: '', model: '', year: '', variant: '', bodyType: 'SUV', fuelType: 'Petrol',
    transmission: 'Automatic', mileage: '', price: '', exteriorColor: '', city: 'Nairobi',
    description: '', name: '', email: '', phone: '',
  })

  const submit = async () => {
    toast.success('Listing submitted! Our team will review and publish within 24 hours.')
    setStep(1)
    setForm({ make: '', model: '', year: '', variant: '', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', mileage: '', price: '', exteriorColor: '', city: 'Nairobi', description: '', name: '', email: '', phone: '' })
  }

  return (
    <div className="container-premium py-8 sm:py-12 space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">For sellers</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Sell your car</h1>
        <p className="text-sm text-muted-foreground mt-2 font-light">Free for individuals · reach 200,000+ buyers · sell in days, not weeks.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 text-xs">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center font-display font-medium', s === step ? 'bg-foreground text-background' : s < step ? 'bg-brand text-brand-foreground' : 'bg-muted text-muted-foreground')}>
              {s < step ? '✓' : s}
            </div>
            <span className={cn('hidden sm:inline', s === step ? 'font-medium' : 'text-muted-foreground')}>
              {s === 1 ? 'Vehicle details' : s === 2 ? 'Photos & price' : 'Your contact'}
            </span>
            {s < 3 && <div className="flex-1 h-px bg-edge" />}
          </div>
        ))}
      </div>

      <div className="bg-card border border-edge p-6 sm:p-8 space-y-5">
        {step === 1 && (
          <>
            <h2 className="font-display text-xl font-medium">Tell us about your car</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Make" value={form.make} onChange={(v) => setForm({ ...form, make: v })} placeholder="e.g. Toyota" />
              <Field label="Model" value={form.model} onChange={(v) => setForm({ ...form, model: v })} placeholder="e.g. Prado" />
              <Field label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2022" />
              <Field label="Variant" value={form.variant} onChange={(v) => setForm({ ...form, variant: v })} placeholder="TX-L (optional)" />
              <SelectField label="Body type" value={form.bodyType} onChange={(v) => setForm({ ...form, bodyType: v })} options={['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Pickup', 'Van', 'Wagon']} />
              <SelectField label="Fuel type" value={form.fuelType} onChange={(v) => setForm({ ...form, fuelType: v })} options={['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plugin Hybrid']} />
              <SelectField label="Transmission" value={form.transmission} onChange={(v) => setForm({ ...form, transmission: v })} options={['Automatic', 'Manual', 'CVT', 'DCT']} />
              <Field label="Mileage (km)" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: v })} placeholder="42000" />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!form.make || !form.model || !form.year} className="bg-foreground hover:bg-foreground/90 text-background">Continue</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-xl font-medium">Photos & pricing</h2>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-edge p-10 text-center hover:border-brand transition cursor-pointer">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-sm font-medium">Upload photos</p>
                <p className="text-xs text-muted-foreground mt-1 font-light">Up to 20 photos · first photo is the cover</p>
              </div>
              <Field label="Asking price (KES)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="5,400,000" />
              <Field label="Exterior color" value={form.exteriorColor} onChange={(v) => setForm({ ...form, exteriorColor: v })} placeholder="Pearl White" />
              <SelectField label="Location" value={form.city} onChange={(v) => setForm({ ...form, city: v })} options={['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Kiambu']} />
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Tell buyers about your car's history, condition, service record, and any standout features…"
                  className="mt-1.5 w-full p-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand resize-none font-light"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="border-edge">Back</Button>
              <Button onClick={() => setStep(3)} disabled={!form.price} className="bg-foreground hover:bg-foreground/90 text-background">Continue</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display text-xl font-medium">How can buyers reach you?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Jane Wanjiku" />
              <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="jane@example.com" />
              <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+254 7XX XXX XXX" />
            </div>
            <div className="bg-brand/5 border border-brand/20 p-4 text-xs text-foreground/80">
              <p className="font-medium flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand" strokeWidth={1.5} /> Your privacy is protected</p>
              <p className="mt-1 font-light">Your contact details are only shared with serious buyers who pass our verification check. We never sell your data.</p>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="border-edge">Back</Button>
              <Button onClick={submit} disabled={!form.name || !form.email} className="bg-brand hover:bg-brand/90 text-brand-foreground">Submit listing</Button>
            </div>
          </>
        )}
      </div>

      {/* Value props */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: TrendingUp, title: 'AI price guidance', desc: 'Get a fair-market valuation in seconds.' },
          { icon: Shield, title: 'Verified buyers', desc: 'We screen every enquiry before it reaches you.' },
          { icon: Award, title: 'Premium listings', desc: 'Boost visibility with sponsored placements.' },
        ].map((v) => (
          <div key={v.title} className="bg-card border border-edge p-5">
            <v.icon className="w-5 h-5 text-brand mb-3" strokeWidth={1.5} />
            <p className="font-display font-medium">{v.title}</p>
            <p className="text-xs text-muted-foreground mt-1 font-light">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full h-11 px-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 px-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ============== FINANCE ==============
export function FinanceView() {
  const [price, setPrice] = useState(5400000)
  const [downPct, setDownPct] = useState(20)
  const [months, setMonths] = useState(60)
  const [rate, setRate] = useState(14)

  const principal = price - (price * downPct) / 100
  const r = rate / 100 / 12
  const monthly = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  const total = monthly * months
  const totalInterest = total - principal
  const insurance = price * 0.035

  return (
    <div className="container-premium py-8 sm:py-12 space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Finance</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Calculator</h1>
        <p className="text-sm text-muted-foreground mt-2 font-light">Estimate your monthly payment · M-Pesa-backed · 9–22% APR</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-card border border-edge p-6 sm:p-8 space-y-7">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground uppercase tracking-[0.2em]">Vehicle price</span>
              <span className="font-display font-medium text-base">{formatKESFull(price)}</span>
            </div>
            <input type="range" min={500000} max={30000000} step={100000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground uppercase tracking-[0.2em]">Down payment</span>
              <span className="font-display font-medium text-base">{downPct}% · {formatKES((price * downPct) / 100)}</span>
            </div>
            <input type="range" min={0} max={60} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground uppercase tracking-[0.2em]">Loan term</span>
              <span className="font-display font-medium text-base">{months} months ({(months / 12).toFixed(1)} yrs)</span>
            </div>
            <input type="range" min={12} max={84} step={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground uppercase tracking-[0.2em]">Interest rate (APR)</span>
              <span className="font-display font-medium text-base">{rate}%</span>
            </div>
            <input type="range" min={9} max={22} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-foreground text-background p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grain opacity-20" />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.3em] text-background/60">Estimated monthly</p>
              <p className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium mt-2 tracking-tight">{formatKESFull(Math.round(monthly))}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">Loan amount</p>
                  <p className="font-display font-medium mt-0.5">{formatKESFull(Math.round(principal))}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">Total interest</p>
                  <p className="font-display font-medium mt-0.5">{formatKESFull(Math.round(totalInterest))}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">Total payable</p>
                  <p className="font-display font-medium mt-0.5">{formatKESFull(Math.round(total))}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">Down payment</p>
                  <p className="font-display font-medium mt-0.5">{formatKESFull(Math.round((price * downPct) / 100))}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-edge p-5">
            <h3 className="font-display font-medium flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand" strokeWidth={1.5} /> Insurance estimate</h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-light">Comprehensive cover · ~3.5% of vehicle value annually</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Annual</p>
                <p className="font-display font-medium text-lg">{formatKESFull(Math.round(insurance))}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Monthly</p>
                <p className="font-display font-medium text-lg">{formatKESFull(Math.round(insurance / 12))}</p>
              </div>
            </div>
          </div>

          <Button className="w-full h-12 bg-brand hover:bg-brand/90 text-brand-foreground">Pre-qualify in 5 minutes</Button>
        </div>
      </div>

      {/* Partner lenders */}
      <div className="bg-card border border-edge p-6">
        <h3 className="font-display font-medium text-lg">Our lending partners</h3>
        <p className="text-xs text-muted-foreground mt-1 font-light">Compare rates from Kenya's leading vehicle finance providers.</p>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'NCBA', rate: '13.5%', note: 'Quick approval' },
            { name: 'KCB', rate: '14.0%', note: 'Salary advance' },
            { name: 'Equity', rate: '13.0%', note: 'M-Pesa linked' },
            { name: 'Stanbic', rate: '12.5%', note: 'Premium clients' },
          ].map((l) => (
            <div key={l.name} className="border border-edge p-4 text-center">
              <p className="font-display font-medium text-lg">{l.name}</p>
              <p className="text-brand font-semibold text-sm mt-0.5">{l.rate}</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-light">{l.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============== DEALERS ==============
export function DealersView() {
  const { data, isLoading } = useQuery({
    queryKey: ['dealers'],
    queryFn: async () => (await (await fetch('/api/dealers')).json()).dealers as any[],
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="container-premium py-8 sm:py-12 space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Verified partners</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Dealers</h1>
        <p className="text-sm text-muted-foreground mt-2 font-light">Every dealer vetted · every car inspected · peace of mind guaranteed.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-card border border-edge h-56 shimmer" />)
        ) : data?.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="bg-card border border-edge p-6 hover:border-foreground/20 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-foreground text-background flex items-center justify-center font-display font-medium text-xl shrink-0">
                {d.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-medium text-lg truncate">{d.name}</h3>
                  {d.isVerified && <BadgeCheck className="w-4 h-4 text-brand shrink-0" strokeWidth={1.5} />}
                  {d.isPremium && <Award className="w-3.5 h-3.5 text-brand shrink-0" strokeWidth={1.5} />}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" strokeWidth={1.5} />{d.city}, {d.region}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="font-semibold font-display">{d.rating}</span>
                    <span className="text-muted-foreground">({formatNumber(d.reviewsCount)})</span>
                  </span>
                  <span className="text-muted-foreground">{d._count.vehicles} in stock</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-4 font-light">{d.description}</p>
            <div className="mt-4 pt-4 border-t border-edge flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{formatNumber(d.totalSales)} sold</span>
              <span className="text-brand font-medium inline-flex items-center gap-0.5">View inventory <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} /></span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============== ARTICLES ==============
export function ArticlesView() {
  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => (await (await fetch('/api/articles')).json()).articles as any[],
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="container-premium py-8 sm:py-12 space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Journal</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Guides & insights</h1>
        <p className="text-sm text-muted-foreground mt-2 font-light">Buy smarter · drive better · own with confidence.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-card border border-edge h-96 shimmer" />)
        ) : data?.map((a, i) => (
          <motion.article
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[16/10] bg-muted overflow-hidden mb-4 relative">
              <img
                src={i === 0 ? 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80' :
                     i === 1 ? 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80' :
                     i === 2 ? 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80' :
                               'https://images.unsplash.com/photo-1519440767-ec5d7d65d127?w=1200&q=80'}
                alt=""
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-background/95 backdrop-blur text-foreground text-[9px] font-semibold tracking-wider uppercase px-2 py-1">{a.category}</span>
              </div>
            </div>
            <h3 className="font-display text-xl lg:text-2xl font-medium leading-tight line-clamp-2 group-hover:text-brand transition">{a.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-light">{a.excerpt}</p>
            <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">{a.author} · {a.readMins} min read</p>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

// ============== RECENTLY VIEWED ==============
export function RecentlyViewedTray() {
  const slugs = useAppStore((s) => s.recentlyViewed)
  const openDetail = useAppStore((s) => s.openDetail)

  const { data } = useQuery({
    queryKey: ['recent', slugs.join(',')],
    queryFn: async () => {
      if (slugs.length === 0) return []
      const r = await fetch('/api/vehicles?limit=200')
      const d = await r.json()
      const map = new Map((d.vehicles as any[]).map((v) => [v.slug, v]))
      return slugs.map((s) => map.get(s)).filter(Boolean)
    },
    enabled: slugs.length > 0,
  })

  if (!data || data.length === 0) return null
  return (
    <section className="container-premium py-12 sm:py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Continue browsing</p>
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">Recently viewed</h2>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {data.slice(0, 8).map((v: any) => (
          <button
            key={v.id}
            onClick={() => openDetail(v.slug)}
            className="shrink-0 w-44 sm:w-52 text-left group"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted mb-2">
              <img src={JSON.parse(v.images || '[]')[0]} alt={v.title} className="w-full h-full object-cover img-zoom" />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1.5">{v.year}</p>
            <p className="text-sm font-medium font-display truncate">{v.title}</p>
            <p className="text-xs font-semibold text-brand mt-0.5">{formatKES(v.price)}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
