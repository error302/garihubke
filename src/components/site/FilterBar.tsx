'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, SlidersHorizontal, X, RotateCcw, MapPin, Calendar, Fuel, Settings2, Car } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { formatKES } from '@/lib/format'
import type { Filters } from '@/lib/types'
import { cn } from '@/lib/utils'

export function FilterBar({ compact = false }: { compact?: boolean }) {
  const filters = useAppStore((s) => s.filters)
  const setFilters = useAppStore((s) => s.setFilters)
  const resetFilters = useAppStore((s) => s.resetFilters)

  const { data: facets } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const r = await fetch('/api/filters')
      return (await r.json()) as {
        makes: string[]; bodyTypes: string[]; fuelTypes: string[]; transmissions: string[];
        drivetrains: string[]; conditions: string[]; cities: string[];
        yearRange: { min: number; max: number }; priceRange: { min: number; max: number };
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const activeCount = Object.entries(filters).filter(([k, v]) => k !== 'sort' && v != null && v !== '').length

  return (
    <div className={cn('bg-card border border-border rounded-2xl', compact ? 'p-3' : 'p-4')}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search make, model, variant…"
            value={filters.q || ''}
            onChange={(e) => setFilters({ q: e.target.value })}
            className="pl-9 h-11 bg-background"
          />
        </div>

        {/* Make select */}
        <Select value={filters.make || '__all'} onValueChange={(v) => setFilters({ make: v === '__all' ? undefined : v })}>
          <SelectTrigger className="h-11 w-full sm:w-[150px] bg-background">
            <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /><SelectValue placeholder="Any make" /></span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Any make</SelectItem>
            {facets?.makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Body type */}
        <Select value={filters.bodyType || '__all'} onValueChange={(v) => setFilters({ bodyType: v === '__all' ? undefined : v })}>
          <SelectTrigger className="h-11 w-full sm:w-[140px] bg-background">
            <SelectValue placeholder="Body type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Any body</SelectItem>
            {facets?.bodyTypes.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={filters.sort || 'relevance'} onValueChange={(v) => setFilters({ sort: v })}>
          <SelectTrigger className="h-11 w-full sm:w-[150px] bg-background">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Recommended</SelectItem>
            <SelectItem value="price-asc">Price: Low → High</SelectItem>
            <SelectItem value="price-desc">Price: High → Low</SelectItem>
            <SelectItem value="year-desc">Newest year</SelectItem>
            <SelectItem value="mileage-asc">Lowest mileage</SelectItem>
            <SelectItem value="popular">Most viewed</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced filters popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-11 px-4 bg-background relative">
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="ml-1 bg-brand text-brand-foreground text-[10px] font-semibold rounded-full w-5 h-5 inline-flex items-center justify-center">{activeCount}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[340px] sm:w-[400px] p-0" align="end">
            <ScrollArea className="h-[480px]">
              <div className="p-4 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-base">Refine</h3>
                  <button onClick={resetFilters} className="text-xs text-brand inline-flex items-center gap-1 hover:underline">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* Price range */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Price range</Label>
                  <Slider
                    min={facets?.priceRange.min || 0}
                    max={facets?.priceRange.max || 25000000}
                    step={100000}
                    value={[filters.minPrice || facets?.priceRange.min || 0, filters.maxPrice || facets?.priceRange.max || 25000000]}
                    onValueChange={(v) => setFilters({ minPrice: v[0], maxPrice: v[1] })}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatKES(filters.minPrice || facets?.priceRange.min || 0)}</span>
                    <span>{formatKES(filters.maxPrice || facets?.priceRange.max || 25000000)}</span>
                  </div>
                </div>

                {/* Year range */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Year</Label>
                  <Slider
                    min={facets?.yearRange.min || 2010}
                    max={facets?.yearRange.max || 2025}
                    step={1}
                    value={[filters.minYear || facets?.yearRange.min || 2010, filters.maxYear || facets?.yearRange.max || 2025]}
                    onValueChange={(v) => setFilters({ minYear: v[0], maxYear: v[1] })}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{filters.minYear || facets?.yearRange.min || 2010}</span>
                    <span>{filters.maxYear || facets?.yearRange.max || 2025}</span>
                  </div>
                </div>

                {/* Fuel */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Fuel className="w-3 h-3" /> Fuel</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {facets?.fuelTypes.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilters({ fuelType: filters.fuelType === f ? undefined : f })}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-full border transition',
                          filters.fuelType === f ? 'bg-foreground text-background border-foreground' : 'bg-background border-border hover:border-foreground/30',
                        )}
                      >{f}</button>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Settings2 className="w-3 h-3" /> Transmission</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {facets?.transmissions.map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilters({ transmission: filters.transmission === t ? undefined : t })}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-full border transition',
                          filters.transmission === t ? 'bg-foreground text-background border-foreground' : 'bg-background border-border hover:border-foreground/30',
                        )}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                {/* Drivetrain */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Drivetrain</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {facets?.drivetrains.map((d) => (
                      <button
                        key={d}
                        onClick={() => setFilters({ drivetrain: filters.drivetrain === d ? undefined : d })}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-full border transition',
                          filters.drivetrain === d ? 'bg-foreground text-background border-foreground' : 'bg-background border-border hover:border-foreground/30',
                        )}
                      >{d}</button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Condition</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {facets?.conditions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setFilters({ condition: filters.condition === c ? undefined : c })}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-full border transition',
                          filters.condition === c ? 'bg-foreground text-background border-foreground' : 'bg-background border-border hover:border-foreground/30',
                        )}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {facets?.cities.map((c) => (
                      <button
                        key={c}
                        onClick={() => setFilters({ city: filters.city === c ? undefined : c })}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-full border transition',
                          filters.city === c ? 'bg-foreground text-background border-foreground' : 'bg-background border-border hover:border-foreground/30',
                        )}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <button
                    onClick={() => setFilters({ featured: !filters.featured })}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full border transition w-full text-left',
                      filters.featured ? 'bg-brand/10 text-brand border-brand' : 'bg-background border-border hover:border-foreground/30',
                    )}
                  >★ Featured only</button>
                  <button
                    onClick={() => setFilters({ premium: !filters.premium })}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full border transition w-full text-left',
                      filters.premium ? 'bg-brand/10 text-brand border-brand' : 'bg-background border-border hover:border-foreground/30',
                    )}
                  >◆ Premium only</button>
                </div>
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(filters).map(([k, v]) => {
            if (k === 'sort' || v == null || v === '' || (k === 'featured' && !v) || (k === 'premium' && !v)) return null
            if ((k === 'minPrice' || k === 'maxPrice' || k === 'minYear' || k === 'maxYear') && v) return null
            return (
              <button
                key={k}
                onClick={() => setFilters({ [k]: undefined } as any)}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/70"
              >
                <span className="capitalize">{k}:</span> <span className="font-medium">{String(v)}</span>
                <X className="w-3 h-3" />
              </button>
            )
          })}
          {(filters.featured || filters.premium) && (
            <button
              onClick={() => setFilters({ featured: false, premium: false })}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand hover:bg-brand/20"
            >
              {filters.featured ? 'Featured' : 'Premium'} <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
