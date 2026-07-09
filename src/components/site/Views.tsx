'use client'

import { useAppStore } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import { VehicleCard } from './VehicleCard'
import { FilterBar } from './FilterBar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Search, Sparkles, Shield, Truck, Calculator, Award, ArrowRight, MapPin,
  Gauge, Fuel, Settings2, Star, BadgeCheck, Newspaper, TrendingUp, Heart, GitCompare, X,
  LayoutGrid, ChevronRight,
} from 'lucide-react'
import { formatKES, formatKESFull, formatNumber, formatMileage } from '@/lib/format'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ============== HERO ==============
export function HeroView() {
  const setView = useAppStore((s) => s.setView)
  const setFilters = useAppStore((s) => s.setFilters)
  const setChatOpen = useAppStore((s) => s.setChatOpen)
  const [q, setQ] = useState('')

  const { data: featured } = useQuery({
    queryKey: ['featured-vehicles'],
    queryFn: async () => {
      const r = await fetch('/api/vehicles?featured=1&limit=6')
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
      {/* Hero */}
      <section className="relative overflow-hidden hero-wash">
        <div className="absolute inset-0 bg-grain opacity-50" />
        <div className="container-premium relative py-12 sm:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-muted-foreground">Kenya's premium vehicle marketplace</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.05]">
              Find the car <span className="text-brand">you deserve.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl text-pretty">
              Curated inventory from verified dealers. AI-powered recommendations. M-Pesa finance in minutes. Drive home with confidence — guaranteed.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 max-w-3xl"
          >
            <div className="bg-card border border-border rounded-2xl p-2 shadow-xl shadow-black/5 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startSearch()}
                  placeholder="Search by make, model or keyword…"
                  className="w-full h-12 pl-11 pr-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <Button onClick={startSearch} className="h-12 px-6 bg-brand hover:bg-brand/90 text-brand-foreground gap-2">
                <Search className="w-4 h-4" /> Search
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="text-muted-foreground">Popular:</span>
              {['Land Cruiser', 'Prado', 'Hilux', 'RAV4', 'Range Rover'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setFilters({ q: t }); setView('browse') }}
                  className="hover:text-brand transition"
                >{t}</button>
              ))}
            </div>
          </motion.div>

          {/* Quick category tiles */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'SUVs', icon: '🚙', filter: { bodyType: 'SUV' } },
              { label: 'Sedans', icon: '🚗', filter: { bodyType: 'Sedan' } },
              { label: 'Pickups', icon: '🛻', filter: { bodyType: 'Pickup' } },
              { label: 'Electric', icon: '⚡', filter: { fuelType: 'Electric' } },
            ].map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setFilters(cat.filter); setView('browse') }}
                className="bg-card border border-border rounded-2xl p-4 text-left hover:border-brand transition hover:shadow-md group"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="font-display font-semibold">{cat.label}</div>
                <div className="text-xs text-muted-foreground inline-flex items-center gap-0.5 mt-1 group-hover:text-brand transition">
                  Browse <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container-premium py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Shield, title: '7-day money-back', desc: 'Not in love? Return it. No questions asked.' },
            { icon: BadgeCheck, title: 'Verified dealers', desc: 'Every dealer vetted. Every car inspected.' },
            { icon: Calculator, title: 'M-Pesa finance', desc: 'Pre-qualify in 5 minutes. Drive home today.' },
            { icon: Truck, title: 'Nationwide delivery', desc: 'Mombasa to Eldoret. Free on premium cars.' },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
                <v.icon className="w-5 h-5 text-brand" />
              </div>
              <h3 className="font-display font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="container-premium py-8 sm:py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Handpicked for you</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">Featured vehicles</h2>
          </div>
          <Button variant="ghost" onClick={() => setView('browse')} className="text-brand">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {featured?.slice(0, 6).map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      </section>

      {/* Browse by make */}
      <BrowseByMake />

      {/* Editorial */}
      <ArticlesTeaser />

      {/* CTA */}
      <section className="container-premium py-12">
        <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 sm:p-12">
          <div className="absolute inset-0 bg-grain opacity-20" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">Selling your car?</h2>
            <p className="mt-3 text-background/80 text-pretty">
              List in 2 minutes. Reach 200,000+ serious buyers across Kenya. Free for individuals — premium tools for dealers.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setView('sell')} className="bg-brand hover:bg-brand/90 text-brand-foreground h-12 px-6">
                List your car <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={() => setChatOpen(true)} variant="outline" className="h-12 px-6 border-background/30 text-background hover:bg-background/10">
                <Sparkles className="w-4 h-4 mr-2" /> Get AI valuation
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
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-lime-500', 'bg-rose-500']

  return (
    <section className="container-premium py-8 sm:py-12">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Browse by make</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {makes.map((m, i) => (
          <button
            key={m}
            onClick={() => { setFilters({ make: m }); setView('browse') }}
            className="group bg-card border border-border rounded-2xl p-4 hover:border-brand hover:shadow-md transition"
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white mb-2', colors[i % colors.length])}>
              {m.charAt(0)}
            </div>
            <p className="font-display font-semibold text-sm">{m}</p>
            <p className="text-[10px] text-muted-foreground group-hover:text-brand transition">Browse →</p>
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
    <section className="container-premium py-8 sm:py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Buyer resources</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">Guides & insights</h2>
        </div>
        <Button variant="ghost" onClick={() => setView('articles')} className="text-brand">
          All guides <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.slice(0, 3).map((a) => (
          <button
            key={a.id}
            onClick={() => setView('articles')}
            className="group text-left bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-brand/10 to-accent/40 flex items-center justify-center">
              <Newspaper className="w-12 h-12 text-brand/40 group-hover:scale-110 transition" />
            </div>
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-wider text-brand font-medium">{a.category}</p>
              <h3 className="font-display font-semibold mt-1 line-clamp-2 group-hover:text-brand transition">{a.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{a.excerpt}</p>
              <p className="text-[10px] text-muted-foreground mt-2">{a.author} · {a.readMins} min read</p>
            </div>
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
    <div className="container-premium py-6 sm:py-8 space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Browse vehicles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data ? `${data.length} vehicles found` : 'Loading…'}
        </p>
      </div>
      <FilterBar />

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5', viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground')}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5', viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground')}
          >
            <span className="text-base leading-none">≡</span> List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="aspect-[16/10] shimmer" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-1/3 shimmer rounded" />
                <div className="h-5 w-2/3 shimmer rounded" />
                <div className="h-3 w-full shimmer rounded" />
                <div className="h-8 w-1/2 shimmer rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-lg">No vehicles match your filters</h3>
          <p className="text-sm text-muted-foreground mt-1">Try widening your price range or removing some filters.</p>
          <Button onClick={() => setFilters({}) && useAppStore.getState().resetFilters()} variant="outline" className="mt-4">Reset filters</Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {data?.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
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
      // fetch all then filter; simple approach for prototype
      const r = await fetch('/api/vehicles?limit=200')
      const d = await r.json()
      return (d.vehicles as any[]).filter((v) => favorites.includes(v.id))
    },
    enabled: favorites.length > 0,
  })

  return (
    <div className="container-premium py-6 sm:py-8 space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" /> Saved vehicles
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{favorites.length} saved · synced across your devices</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden"><div className="aspect-[16/10] shimmer" /><div className="p-4 h-32" /></div>)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <Heart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-lg">No saved vehicles yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">Tap the heart on any vehicle to save it here. We'll alert you when prices drop.</p>
          <Button onClick={() => setView('browse')} className="mt-4 bg-brand hover:bg-brand/90 text-brand-foreground">Browse vehicles</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
    <div className="container-premium py-6 sm:py-8 space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-brand" /> Compare vehicles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Side-by-side · up to 3 vehicles</p>
        </div>
        {compareIds.length > 0 && (
          <Button variant="outline" onClick={clearCompare}><X className="w-4 h-4 mr-1" /> Clear all</Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-20">Loading…</div>
      ) : compareIds.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <GitCompare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-lg">Nothing to compare yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">Tap the compare icon on any vehicle to add it here. Add 2 or 3 to see them side-by-side.</p>
          <Button onClick={() => setView('browse')} className="mt-4 bg-brand hover:bg-brand/90 text-brand-foreground">Browse vehicles</Button>
        </div>
      ) : (
        <div className="overflow-x-auto premium-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-medium p-3 w-32">Specification</th>
                {data?.map((v) => {
                  const imgs = JSON.parse(v.images || '[]') as string[]
                  return (
                    <th key={v.id} className="p-3 align-top min-w-[200px]">
                      <button onClick={() => openDetail(v.slug)} className="block w-full text-left group">
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted mb-2">
                          <img src={imgs[0]} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{v.year} · {v.condition}</p>
                        <p className="font-display font-semibold text-sm line-clamp-2 group-hover:text-brand transition">{v.title}</p>
                      </button>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.k} className={cn(ri % 2 === 0 ? 'bg-muted/30' : '')}>
                  <td className="text-xs uppercase tracking-wider text-muted-foreground font-medium p-3">{row.label}</td>
                  {data?.map((v) => (
                    <td key={v.id} className="p-3 text-sm font-medium">
                      {row.format(v)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-3" />
                {data?.map((v) => (
                  <td key={v.id} className="p-3">
                    <Button size="sm" variant="outline" onClick={() => openDetail(v.slug)} className="w-full">View details</Button>
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
    <div className="container-premium py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Sell your car</h1>
        <p className="text-sm text-muted-foreground mt-1">Free for individuals · reach 200,000+ buyers · sell in days, not weeks.</p>
      </div>

      {/* Steps progress */}
      <div className="flex items-center gap-2 text-xs">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center font-semibold', s === step ? 'bg-foreground text-background' : s < step ? 'bg-brand text-brand-foreground' : 'bg-muted text-muted-foreground')}>
              {s < step ? '✓' : s}
            </div>
            <span className={cn('hidden sm:inline', s === step ? 'font-semibold' : 'text-muted-foreground')}>
              {s === 1 ? 'Vehicle details' : s === 2 ? 'Photos & price' : 'Your contact'}
            </span>
            {s < 3 && <div className="flex-1 h-0.5 bg-muted" />}
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
        {step === 1 && (
          <>
            <h2 className="font-display font-semibold text-lg">Tell us about your car</h2>
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
              <Button onClick={() => setStep(2)} disabled={!form.make || !form.model || !form.year} className="bg-brand hover:bg-brand/90 text-brand-foreground">Continue</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display font-semibold text-lg">Photos & pricing</h2>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-brand transition cursor-pointer">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-sm font-medium">Upload photos</p>
                <p className="text-xs text-muted-foreground mt-1">Up to 20 photos · first photo is the cover</p>
              </div>
              <Field label="Asking price (KES)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="5,400,000" />
              <Field label="Exterior color" value={form.exteriorColor} onChange={(v) => setForm({ ...form, exteriorColor: v })} placeholder="Pearl White" />
              <SelectField label="Location" value={form.city} onChange={(v) => setForm({ ...form, city: v })} options={['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Kiambu']} />
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Tell buyers about your car's history, condition, service record, and any standout features…"
                  className="mt-1 w-full p-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!form.price} className="bg-brand hover:bg-brand/90 text-brand-foreground">Continue</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display font-semibold text-lg">How can buyers reach you?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Jane Wanjiku" />
              <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="jane@example.com" />
              <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+254 7XX XXX XXX" />
            </div>
            <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 text-xs text-foreground/80">
              <p className="font-semibold flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand" /> Your privacy is protected</p>
              <p className="mt-1">Your contact details are only shared with serious buyers who pass our verification check. We never sell your data.</p>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
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
          <div key={v.title} className="bg-card border border-border rounded-xl p-4">
            <v.icon className="w-5 h-5 text-brand mb-2" />
            <p className="font-semibold text-sm">{v.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full h-11 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
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
    <div className="container-premium py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2"><Calculator className="w-6 h-6 text-brand" /> Finance calculator</h1>
        <p className="text-sm text-muted-foreground mt-1">Estimate your monthly payment · M-Pesa-backed · 9–22% APR</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Vehicle price</span>
              <span className="font-display font-bold">{formatKESFull(price)}</span>
            </div>
            <input type="range" min={500000} max={30000000} step={100000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Down payment</span>
              <span className="font-display font-bold">{downPct}% · {formatKES((price * downPct) / 100)}</span>
            </div>
            <input type="range" min={0} max={60} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Loan term</span>
              <span className="font-display font-bold">{months} months ({(months / 12).toFixed(1)} yrs)</span>
            </div>
            <input type="range" min={12} max={84} step={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Interest rate (APR)</span>
              <span className="font-display font-bold">{rate}%</span>
            </div>
            <input type="range" min={9} max={22} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-brand to-brand/80 text-brand-foreground rounded-2xl p-6 shadow-lg">
            <p className="text-xs uppercase tracking-wider opacity-80">Estimated monthly payment</p>
            <p className="font-display text-4xl sm:text-5xl font-bold mt-1">{formatKESFull(Math.round(monthly))}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm opacity-90">
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-70">Loan amount</p>
                <p className="font-semibold">{formatKESFull(Math.round(principal))}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-70">Total interest</p>
                <p className="font-semibold">{formatKESFull(Math.round(totalInterest))}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-70">Total payable</p>
                <p className="font-semibold">{formatKESFull(Math.round(total))}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-70">Down payment</p>
                <p className="font-semibold">{formatKESFull(Math.round((price * downPct) / 100))}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-display font-semibold text-sm flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand" /> Insurance estimate</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Comprehensive cover · ~3.5% of vehicle value annually</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Annual</p>
                <p className="font-display font-bold">{formatKESFull(Math.round(insurance))}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly</p>
                <p className="font-display font-bold">{formatKESFull(Math.round(insurance / 12))}</p>
              </div>
            </div>
          </div>

          <Button className="w-full h-12 bg-brand hover:bg-brand/90 text-brand-foreground">Pre-qualify in 5 minutes</Button>
        </div>
      </div>

      {/* Partner lenders */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display font-semibold">Our lending partners</h3>
        <p className="text-xs text-muted-foreground mt-1">Compare rates from Kenya's leading vehicle finance providers.</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'NCBA', rate: '13.5%', note: 'Quick approval' },
            { name: 'KCB', rate: '14.0%', note: 'Salary advance' },
            { name: 'Equity', rate: '13.0%', note: 'M-Pesa linked' },
            { name: 'Stanbic', rate: '12.5%', note: 'Premium clients' },
          ].map((l) => (
            <div key={l.name} className="border border-border rounded-xl p-3 text-center">
              <p className="font-display font-bold">{l.name}</p>
              <p className="text-brand font-semibold text-sm">{l.rate}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{l.note}</p>
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
    <div className="container-premium py-6 sm:py-8 space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Verified dealers</h1>
        <p className="text-sm text-muted-foreground mt-1">Every dealer vetted · every car inspected · peace of mind guaranteed.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-card border border-border rounded-2xl h-48 shimmer" />)
        ) : data?.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center font-display font-bold text-xl shrink-0">
                {d.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-semibold truncate">{d.name}</h3>
                  {d.isVerified && <BadgeCheck className="w-4 h-4 text-brand shrink-0" />}
                  {d.isPremium && <Award className="w-3.5 h-3.5 text-brand shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{d.city}, {d.region}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{d.rating}</span>
                    <span className="text-muted-foreground">({formatNumber(d.reviewsCount)})</span>
                  </span>
                  <span className="text-muted-foreground">{d._count.vehicles} in stock</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-3">{d.description}</p>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{formatNumber(d.totalSales)} sold</span>
              <span className="text-brand font-medium">View inventory →</span>
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
    <div className="container-premium py-6 sm:py-8 space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Guides & insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Buy smarter · drive better · own with confidence.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-card border border-border rounded-2xl h-80 shimmer" />)
        ) : data?.map((a, i) => (
          <motion.article
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-brand/10 to-accent/40 flex items-center justify-center">
              <Newspaper className="w-12 h-12 text-brand/40 group-hover:scale-110 transition" />
            </div>
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-wider text-brand font-medium">{a.category}</p>
              <h3 className="font-display font-semibold text-lg mt-1 line-clamp-2 group-hover:text-brand transition">{a.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{a.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{a.author}</span>
                <span className="text-muted-foreground">{a.readMins} min read</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

// ============== RECENTLY VIEWED TRAY ==============
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
    <section className="container-premium py-8">
      <h2 className="font-display text-lg font-semibold mb-3">Recently viewed</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {data.slice(0, 8).map((v: any) => (
          <button
            key={v.id}
            onClick={() => openDetail(v.slug)}
            className="shrink-0 w-40 sm:w-48 text-left group"
          >
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted">
              <img src={JSON.parse(v.images || '[]')[0]} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">{v.year}</p>
            <p className="text-sm font-semibold truncate">{v.title}</p>
            <p className="text-xs font-bold text-brand">{formatKES(v.price)}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
