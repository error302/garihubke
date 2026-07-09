'use client'

import { useAppStore } from '@/lib/store'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQuery } from '@tanstack/react-query'
import { formatKES, formatKESFull, formatMileage, formatNumber, formatRelativeTime, computeLoan, computeInsurance } from '@/lib/format'
import { VehicleCard } from './VehicleCard'
import {
  X, Heart, Share2, GitCompare, BadgeCheck, Sparkles, Phone, MessageCircle,
  Gauge, Fuel, Settings2, Calendar, MapPin, Cog, Users, DoorOpen, Zap, Shield,
  Palette, Thermometer, Eye, Calculator, Star, Send, Mail, CheckCircle2, ChevronLeft, ChevronRight, Award, TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function VehicleDetailDrawer() {
  const slug = useAppStore((s) => s.detailSlug)
  const closeDetail = useAppStore((s) => s.closeDetail)
  const openDetail = useAppStore((s) => s.openDetail)
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const compareIds = useAppStore((s) => s.compareIds)
  const toggleCompare = useAppStore((s) => s.toggleCompare)
  const setView = useAppStore((s) => s.setView)
  const [activeImg, setActiveImg] = useState(0)
  const [leadType, setLeadType] = useState<'inquiry' | 'test_drive' | 'offer' | 'finance' | 'trade_in'>('inquiry')
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['vehicle', slug],
    queryFn: async () => {
      if (!slug) return null
      const r = await fetch(`/api/vehicles/${slug}`)
      if (!r.ok) return null
      return (await r.json()) as { vehicle: any; similar: any[] }
    },
    enabled: !!slug,
  })

  if (!slug) return null
  const v = data?.vehicle
  const isFav = v ? favorites.includes(v.id) : false
  const inCompare = v ? compareIds.includes(v.id) : false
  const images: string[] = v ? JSON.parse(v.images || '[]') : []
  const features: string[] = v ? JSON.parse(v.features || '[]') : []
  const reviews: any[] = v?.reviews || []

  const handleLead = async () => {
    if (!v) return
    if (!leadForm.name || !leadForm.email) {
      toast.error('Please provide your name and email')
      return
    }
    setSubmitting(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: v.id,
          dealerId: v.dealerId,
          type: leadType,
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          message: leadForm.message || `${leadType.replace('_', ' ')} request for ${v.title}`,
          budget: v.price,
        }),
      })
      toast.success('Request sent! The dealer will be in touch shortly.')
      setLeadForm({ name: '', email: '', phone: '', message: '' })
    } catch (e) {
      toast.error('Could not submit — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={!!slug} onOpenChange={(o) => !o && closeDetail()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl p-0 overflow-hidden flex flex-col">
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
          </div>
        )}
        {v && (
          <>
            {/* Image gallery */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-muted shrink-0">
              <img src={images[activeImg] || images[0]} alt={v.title} className="w-full h-full object-cover" />
              {/* Top overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex flex-wrap gap-1.5">
                  {v.isFeatured && <Badge className="bg-brand text-brand-foreground gap-1"><Sparkles className="w-3 h-3" /> Featured</Badge>}
                  {v.isVerified && <Badge className="bg-background/90 text-foreground gap-1"><BadgeCheck className="w-3 h-3 text-brand" /> Verified</Badge>}
                  {v.condition === 'New' && <Badge className="bg-foreground text-background">New</Badge>}
                </div>
                <button onClick={closeDetail} className="p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Image nav */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background"
                  ><ChevronLeft className="w-5 h-5" /></button>
                  <button
                    onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background"
                  ><ChevronRight className="w-5 h-5" /></button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={cn('h-1.5 rounded-full transition-all', i === activeImg ? 'w-6 bg-foreground' : 'w-1.5 bg-foreground/40')}
                      />
                    ))}
                  </div>
                </>
              )}
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="absolute bottom-6 right-3 hidden sm:flex gap-1.5 max-w-[60%] overflow-x-auto no-scrollbar">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn('w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0', i === activeImg ? 'border-brand' : 'border-background/60')}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 premium-scroll">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Title + price */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{v.year} · {v.condition} · {v.city}, {v.region}</p>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">{v.title}</h2>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(v.viewsCount)} views</span>
                      <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(v.favoritesCount)} saved</span>
                      <span className="inline-flex items-center gap-1"><Send className="w-3 h-3" />{formatNumber(v.leadsCount)} inquiries</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-brand">{formatKES(v.price)}</p>
                    <p className="text-xs text-muted-foreground">{formatKESFull(v.price)}</p>
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleFavorite(v.id)}
                    variant={isFav ? 'default' : 'outline'}
                    className={cn('flex-1 h-11', isFav ? 'bg-red-500 hover:bg-red-600 text-white' : '')}
                  >
                    <Heart className={cn('w-4 h-4 mr-1.5', isFav && 'fill-white')} />{isFav ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    onClick={() => {
                      toggleCompare(v.id)
                      toast.success(inCompare ? 'Removed from compare' : 'Added to compare')
                    }}
                    variant={inCompare ? 'default' : 'outline'}
                    className={cn('flex-1 h-11', inCompare ? 'bg-brand text-brand-foreground' : '')}
                  >
                    <GitCompare className="w-4 h-4 mr-1.5" />{inCompare ? 'In Compare' : 'Compare'}
                  </Button>
                  <Button
                    onClick={() => { navigator.share?.({ title: v.title, url: window.location.href }).catch(() => toast('Link copied')) }}
                    variant="outline"
                    className="h-11 px-3"
                  ><Share2 className="w-4 h-4" /></Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto no-scrollbar h-auto p-1 bg-muted/60">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-background">Overview</TabsTrigger>
                    <TabsTrigger value="specs" className="data-[state=active]:bg-background">Specs</TabsTrigger>
                    <TabsTrigger value="features" className="data-[state=active]:bg-background">Features</TabsTrigger>
                    <TabsTrigger value="finance" className="data-[state=active]:bg-background">Finance</TabsTrigger>
                    <TabsTrigger value="dealer" className="data-[state=active]:bg-background">Dealer</TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-background">Reviews ({reviews.length})</TabsTrigger>
                    <TabsTrigger value="contact" className="data-[state=active]:bg-background">Contact</TabsTrigger>
                  </TabsList>

                  {/* Overview */}
                  <TabsContent value="overview" className="space-y-5 mt-4">
                    <p className="text-sm leading-relaxed text-foreground/90">{v.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: Calendar, label: 'Year', value: v.year },
                        { icon: Gauge, label: 'Mileage', value: formatMileage(v.mileage) },
                        { icon: Fuel, label: 'Fuel', value: v.fuelType },
                        { icon: Settings2, label: 'Trans.', value: v.transmission },
                        { icon: Cog, label: 'Drivetrain', value: v.drivetrain },
                        { icon: DoorOpen, label: 'Doors', value: v.doors },
                        { icon: Users, label: 'Seats', value: v.seats },
                        { icon: Zap, label: 'Power', value: v.horsepower ? `${v.horsepower} hp` : '—' },
                      ].map((s, i) => (
                        <div key={i} className="bg-card border border-border rounded-xl p-3">
                          <s.icon className="w-4 h-4 text-muted-foreground mb-1" />
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                          <p className="text-sm font-semibold">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Perks highlight */}
                    <div className="bg-gradient-to-br from-brand/5 to-accent/30 border border-brand/20 rounded-2xl p-4">
                      <h4 className="font-display font-semibold text-sm flex items-center gap-1.5"><Award className="w-4 h-4 text-brand" /> GariHub Perks included</h4>
                      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-foreground/80">
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-brand" /> 7-day money-back guarantee</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-brand" /> Free 200-point inspection</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-brand" /> M-Pesa finance in 5 minutes</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-brand" /> Home delivery nationwide</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-brand" /> Free first service</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-brand" /> 1-year roadside assistance</li>
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Specs */}
                  <TabsContent value="specs" className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        ['Make', v.make], ['Model', v.model], ['Variant', v.variant || '—'],
                        ['Body Type', v.bodyType], ['Year', v.year], ['Condition', v.condition],
                        ['Mileage', formatMileage(v.mileage)], ['Fuel Type', v.fuelType],
                        ['Transmission', v.transmission], ['Drivetrain', v.drivetrain],
                        ['Engine', v.engine || '—'], ['Displacement', v.displacement || '—'],
                        ['Horsepower', v.horsepower ? `${v.horsepower} hp` : '—'],
                        ['Torque', v.torque ? `${v.torque} Nm` : '—'],
                        ['Doors', v.doors], ['Seats', v.seats],
                        ['Exterior Color', v.exteriorColor || '—'], ['Interior Color', v.interiorColor || '—'],
                        ['VIN', v.vin || 'Available on request'], ['Location', v.location || '—'],
                      ].map(([k, val]) => (
                        <div key={k} className="flex items-center justify-between py-2.5 border-b border-border">
                          <span className="text-xs text-muted-foreground">{k}</span>
                          <span className="text-sm font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Features */}
                  <TabsContent value="features" className="mt-4">
                    {features.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No features listed.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {features.map((f) => (
                          <div key={f} className="flex items-center gap-2 py-2">
                            <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                            <span className="text-sm">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Finance */}
                  <TabsContent value="finance" className="mt-4 space-y-4">
                    <FinancePreview price={v.price} />
                  </TabsContent>

                  {/* Dealer */}
                  <TabsContent value="dealer" className="mt-4">
                    {v.dealer && (
                      <div className="bg-card border border-border rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-display font-bold shrink-0">
                            {v.dealer.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-display font-semibold truncate">{v.dealer.name}</h4>
                              {v.dealer.isVerified && <BadgeCheck className="w-4 h-4 text-brand" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{v.dealer.city}, {v.dealer.region} · Joined {formatRelativeTime(v.dealer.joinedAt)}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs">
                              <span className="inline-flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="font-semibold">{v.dealer.rating}</span>
                                <span className="text-muted-foreground">({formatNumber(v.dealer.reviewsCount)})</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <TrendingUp className="w-3 h-3" /> {formatNumber(v.dealer.totalSales)} sold
                              </span>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Shield className="w-3 h-3" /> {v.dealer.responseRate}% response
                              </span>
                            </div>
                            {v.dealer.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{v.dealer.description}</p>}
                            <Button size="sm" variant="outline" className="mt-3 h-8" onClick={() => setView('dealers')}>
                              View dealership
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Reviews */}
                  <TabsContent value="reviews" className="mt-4 space-y-3">
                    {reviews.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display font-semibold text-xs">{r.author.charAt(0)}</div>
                              <div>
                                <p className="text-sm font-medium">{r.author}</p>
                                <p className="text-[10px] text-muted-foreground">{formatRelativeTime(r.createdAt)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn('w-3.5 h-3.5', i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
                              ))}
                            </div>
                          </div>
                          {r.title && <p className="mt-2 text-sm font-semibold">{r.title}</p>}
                          <p className="mt-1 text-sm text-foreground/80">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  {/* Contact */}
                  <TabsContent value="contact" className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { k: 'inquiry', label: 'Inquiry', icon: MessageCircle },
                        { k: 'test_drive', label: 'Test Drive', icon: Calendar },
                        { k: 'offer', label: 'Make Offer', icon: TrendingUp },
                        { k: 'finance', label: 'Finance', icon: Calculator },
                        { k: 'trade_in', label: 'Trade-In', icon: Cog },
                      ].map((t) => (
                        <button
                          key={t.k}
                          onClick={() => setLeadType(t.k as any)}
                          className={cn(
                            'flex items-center gap-2 p-3 rounded-xl border text-sm transition',
                            leadType === t.k ? 'bg-foreground text-background border-foreground' : 'bg-card border-border hover:border-foreground/30',
                          )}
                        >
                          <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <input
                        placeholder="Your name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        placeholder="Phone (optional)"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <textarea
                        placeholder={`Tell us about your ${leadType.replace('_', ' ')}…`}
                        value={leadForm.message}
                        onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                        rows={3}
                        className="w-full p-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                      />
                      <Button onClick={handleLead} disabled={submitting} className="w-full h-11 bg-brand hover:bg-brand/90 text-brand-foreground">
                        {submitting ? 'Sending…' : `Send ${leadType.replace('_', ' ')} request`}
                      </Button>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" className="flex-1 h-10" onClick={() => toast('Connecting you to dealer…')}>
                          <Phone className="w-4 h-4 mr-1.5" /> Call
                        </Button>
                        <Button variant="outline" className="flex-1 h-10 bg-[#25D366] hover:bg-[#1eb858] text-white border-0" onClick={() => toast('Opening WhatsApp…')}>
                          <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Similar cars */}
                {data?.similar && data.similar.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-display text-lg font-semibold mb-3">You might also like</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {data.similar.slice(0, 6).map((s) => (
                        <VehicleCard key={s.id} vehicle={s} variant="compact" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

// Inline finance calculator preview component
function FinancePreview({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20)
  const [months, setMonths] = useState(60)
  const [rate, setRate] = useState(14) // Kenyan average

  const loan = computeLoan(price, downPct, rate, months)
  const ins = computeInsurance(price)

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div>
          <h4 className="font-display font-semibold text-sm flex items-center gap-1.5"><Calculator className="w-4 h-4" /> Loan calculator</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Estimate your monthly M-Pesa-backed car loan.</p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Down payment</span>
            <span className="font-semibold">{downPct}% · {formatKES(loan.down)}</span>
          </div>
          <input type="range" min={0} max={50} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Term</span>
            <span className="font-semibold">{months} months ({(months / 12).toFixed(1)} yrs)</span>
          </div>
          <input type="range" min={12} max={84} step={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Interest rate (APR)</span>
            <span className="font-semibold">{rate}%</span>
          </div>
          <input type="range" min={9} max={22} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </div>

        <div className="bg-brand/5 border border-brand/20 rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estimated monthly payment</p>
          <p className="font-display text-2xl font-bold text-brand">{formatKESFull(Math.round(loan.monthly))}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Total interest:</span> <span className="font-semibold">{formatKES(Math.round(loan.totalInterest))}</span></div>
            <div><span className="text-muted-foreground">Total payable:</span> <span className="font-semibold">{formatKES(Math.round(loan.total))}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4">
        <h4 className="font-display font-semibold text-sm flex items-center gap-1.5"><Shield className="w-4 h-4" /> Insurance estimate</h4>
        <p className="text-xs text-muted-foreground mt-0.5">Comprehensive cover, Kenyan average ~3.5% of value.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Annual premium</p>
            <p className="font-display font-bold">{formatKESFull(Math.round(ins.annual))}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly equivalent</p>
            <p className="font-display font-bold">{formatKESFull(Math.round(ins.monthly))}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
