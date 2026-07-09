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
  Eye, Calculator, Star, Send, Mail, CheckCircle2, ChevronLeft, ChevronRight, Award, TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function VehicleDetailDrawer() {
  const slug = useAppStore((s) => s.detailSlug)
  const closeDetail = useAppStore((s) => s.closeDetail)
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
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl p-0 overflow-hidden flex flex-col border-edge">
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-edge border-t-foreground animate-spin" />
          </div>
        )}
        {v && (
          <>
            {/* Gallery */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-muted shrink-0">
              <img src={images[activeImg] || images[0]} alt={v.title} className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex flex-wrap gap-1.5">
                  {v.isFeatured && <Badge className="bg-background/95 text-foreground gap-1 border-0"><Sparkles className="w-3 h-3" /> Featured</Badge>}
                  {v.isVerified && <Badge className="bg-background/95 text-foreground gap-1 border-0"><BadgeCheck className="w-3 h-3 text-brand" /> Verified</Badge>}
                  {v.condition === 'New' && <Badge className="bg-brand text-brand-foreground border-0">New</Badge>}
                </div>
                <button onClick={closeDetail} className="p-2 rounded-full bg-background/95 backdrop-blur hover:bg-background transition">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/95 backdrop-blur hover:bg-background transition"
                  ><ChevronLeft className="w-5 h-5" strokeWidth={1.5} /></button>
                  <button
                    onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/95 backdrop-blur hover:bg-background transition"
                  ><ChevronRight className="w-5 h-5" strokeWidth={1.5} /></button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={cn('h-1 rounded-full transition-all', i === activeImg ? 'w-6 bg-foreground' : 'w-1.5 bg-foreground/40')}
                      />
                    ))}
                  </div>
                  {/* Thumbnails */}
                  <div className="absolute bottom-6 right-3 hidden sm:flex gap-1.5 max-w-[60%] overflow-x-auto no-scrollbar">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={cn('w-12 h-12 overflow-hidden border-2 shrink-0', i === activeImg ? 'border-brand' : 'border-background/60')}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 premium-scroll">
              <div className="p-5 sm:p-8 space-y-6">
                {/* Title + price */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{v.year} · {v.condition} · {v.city}, {v.region}</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-medium leading-[1.1] mt-1.5 tracking-tight">{v.title}</h2>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" strokeWidth={1.5} />{formatNumber(v.viewsCount)} views</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" strokeWidth={1.5} />{formatNumber(v.favoritesCount)} saved</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span className="inline-flex items-center gap-1"><Send className="w-3 h-3" strokeWidth={1.5} />{formatNumber(v.leadsCount)} inquiries</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Price</p>
                    <p className="font-display text-2xl sm:text-3xl font-semibold text-brand">{formatKES(v.price)}</p>
                    <p className="text-xs text-muted-foreground font-mono">{formatKESFull(v.price)}</p>
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleFavorite(v.id)}
                    variant={isFav ? 'default' : 'outline'}
                    className={cn('flex-1 h-12', isFav ? 'bg-brand hover:bg-brand text-brand-foreground border-0' : 'border-edge')}
                  >
                    <Heart className={cn('w-4 h-4 mr-1.5', isFav && 'fill-white')} strokeWidth={1.5} />{isFav ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    onClick={() => {
                      toggleCompare(v.id)
                      toast.success(inCompare ? 'Removed from compare' : 'Added to compare')
                    }}
                    variant={inCompare ? 'default' : 'outline'}
                    className={cn('flex-1 h-12', inCompare ? 'bg-brand text-brand-foreground border-0' : 'border-edge')}
                  >
                    <GitCompare className="w-4 h-4 mr-1.5" strokeWidth={1.5} />{inCompare ? 'In Compare' : 'Compare'}
                  </Button>
                  <Button
                    onClick={() => { navigator.share?.({ title: v.title, url: window.location.href }).catch(() => toast('Link copied')) }}
                    variant="outline"
                    className="h-12 px-3 border-edge"
                  ><Share2 className="w-4 h-4" strokeWidth={1.5} /></Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto no-scrollbar h-auto p-1 bg-muted/60 rounded-sm">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-none text-xs">Overview</TabsTrigger>
                    <TabsTrigger value="specs" className="data-[state=active]:bg-background data-[state=active]:shadow-none text-xs">Specs</TabsTrigger>
                    <TabsTrigger value="features" className="data-[state=active]:bg-background data-[state=active]:shadow-none text-xs">Features</TabsTrigger>
                    <TabsTrigger value="finance" className="data-[state=active]:bg-background data-[state=active]:shadow-none text-xs">Finance</TabsTrigger>
                    <TabsTrigger value="dealer" className="data-[state=active]:bg-background data-[state=active]:shadow-none text-xs">Dealer</TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-background data-[state=active]:shadow-none text-xs">Reviews ({reviews.length})</TabsTrigger>
                    <TabsTrigger value="contact" className="data-[state=active]:bg-background data-[state=active]:shadow-none text-xs">Contact</TabsTrigger>
                  </TabsList>

                  {/* Overview */}
                  <TabsContent value="overview" className="space-y-5 mt-5">
                    <p className="text-base leading-relaxed text-foreground/90 font-light">{v.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                        <div key={i} className="bg-muted/40 border border-edge p-3">
                          <s.icon className="w-3.5 h-3.5 text-muted-foreground mb-1.5" strokeWidth={1.5} />
                          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
                          <p className="text-sm font-medium font-display">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Perks */}
                    <div className="bg-gradient-to-br from-brand/5 to-accent border border-brand/20 p-5">
                      <h4 className="font-display font-medium text-base flex items-center gap-1.5"><Award className="w-4 h-4 text-brand" strokeWidth={1.5} /> GariHub Perks included</h4>
                      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-foreground/80 font-light">
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand" strokeWidth={1.5} /> 7-day money-back guarantee</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand" strokeWidth={1.5} /> Free 200-point inspection</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand" strokeWidth={1.5} /> M-Pesa finance in 5 minutes</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand" strokeWidth={1.5} /> Home delivery nationwide</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand" strokeWidth={1.5} /> Free first service</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand" strokeWidth={1.5} /> 1-year roadside assistance</li>
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Specs */}
                  <TabsContent value="specs" className="mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
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
                        ['VIN', v.vin || 'On request'], ['Location', v.location || '—'],
                      ].map(([k, val]) => (
                        <div key={k} className="flex items-center justify-between py-3 border-b border-edge">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">{k}</span>
                          <span className="text-sm font-medium font-display">{val}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Features */}
                  <TabsContent value="features" className="mt-5">
                    {features.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No features listed.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
                        {features.map((f) => (
                          <div key={f} className="flex items-center gap-2.5 py-3 border-b border-edge">
                            <CheckCircle2 className="w-4 h-4 text-brand shrink-0" strokeWidth={1.5} />
                            <span className="text-sm font-light">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Finance */}
                  <TabsContent value="finance" className="mt-5 space-y-4">
                    <FinancePreview price={v.price} />
                  </TabsContent>

                  {/* Dealer */}
                  <TabsContent value="dealer" className="mt-5">
                    {v.dealer && (
                      <div className="bg-card border border-edge p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 bg-foreground text-background flex items-center justify-center font-display font-medium text-xl shrink-0">
                            {v.dealer.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-display font-medium text-lg truncate">{v.dealer.name}</h4>
                              {v.dealer.isVerified && <BadgeCheck className="w-4 h-4 text-brand" strokeWidth={1.5} />}
                            </div>
                            <p className="text-xs text-muted-foreground">{v.dealer.city}, {v.dealer.region} · Joined {formatRelativeTime(v.dealer.joinedAt)}</p>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs">
                              <span className="inline-flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span className="font-semibold font-display">{v.dealer.rating}</span>
                                <span className="text-muted-foreground">({formatNumber(v.dealer.reviewsCount)})</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <TrendingUp className="w-3 h-3" strokeWidth={1.5} /> {formatNumber(v.dealer.totalSales)} sold
                              </span>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Shield className="w-3 h-3" strokeWidth={1.5} /> {v.dealer.responseRate}% response
                              </span>
                            </div>
                            {v.dealer.description && <p className="mt-3 text-xs text-muted-foreground line-clamp-3 font-light">{v.dealer.description}</p>}
                            <Button size="sm" variant="outline" className="mt-4 h-8 border-edge" onClick={() => setView('dealers')}>
                              View dealership
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Reviews */}
                  <TabsContent value="reviews" className="mt-5 space-y-3">
                    {reviews.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="bg-card border border-edge p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-display font-medium text-sm">{r.author.charAt(0)}</div>
                              <div>
                                <p className="text-sm font-medium">{r.author}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{formatRelativeTime(r.createdAt)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn('w-3.5 h-3.5', i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30')} />
                              ))}
                            </div>
                          </div>
                          {r.title && <p className="mt-3 text-sm font-medium font-display">{r.title}</p>}
                          <p className="mt-1 text-sm text-foreground/80 font-light">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  {/* Contact */}
                  <TabsContent value="contact" className="mt-5 space-y-4">
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
                            'flex items-center gap-2 p-3 border text-sm transition',
                            leadType === t.k ? 'bg-foreground text-background border-foreground' : 'bg-card border-edge hover:border-foreground/30',
                          )}
                        >
                          <t.icon className="w-4 h-4" strokeWidth={1.5} /> {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <input
                        placeholder="Your name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full h-12 px-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        className="w-full h-12 px-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand"
                      />
                      <input
                        placeholder="Phone (optional)"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="w-full h-12 px-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand"
                      />
                      <textarea
                        placeholder={`Tell us about your ${leadType.replace('_', ' ')}…`}
                        value={leadForm.message}
                        onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                        rows={3}
                        className="w-full p-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand resize-none"
                      />
                      <Button onClick={handleLead} disabled={submitting} className="w-full h-12 bg-brand hover:bg-brand/90 text-brand-foreground">
                        {submitting ? 'Sending…' : `Send ${leadType.replace('_', ' ')} request`}
                      </Button>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" className="flex-1 h-11 border-edge" onClick={() => toast('Connecting you to dealer…')}>
                          <Phone className="w-4 h-4 mr-1.5" strokeWidth={1.5} /> Call
                        </Button>
                        <Button variant="outline" className="flex-1 h-11 bg-[#25D366] hover:bg-[#1eb858] text-white border-0" onClick={() => toast('Opening WhatsApp…')}>
                          <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Similar */}
                {data?.similar && data.similar.length > 0 && (
                  <div className="pt-6 border-t border-edge">
                    <h3 className="font-display text-xl font-medium mb-4">You might also like</h3>
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

function FinancePreview({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20)
  const [months, setMonths] = useState(60)
  const [rate, setRate] = useState(14)

  const loan = computeLoan(price, downPct, rate, months)
  const ins = computeInsurance(price)

  return (
    <div className="space-y-4">
      <div className="bg-card border border-edge p-5 space-y-5">
        <div>
          <h4 className="font-display font-medium text-base flex items-center gap-1.5"><Calculator className="w-4 h-4" strokeWidth={1.5} /> Loan calculator</h4>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">Estimate your monthly M-Pesa-backed car loan.</p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground uppercase tracking-wider">Down payment</span>
            <span className="font-semibold font-display">{downPct}% · {formatKES(loan.down)}</span>
          </div>
          <input type="range" min={0} max={50} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground uppercase tracking-wider">Term</span>
            <span className="font-semibold font-display">{months} months ({(months / 12).toFixed(1)} yrs)</span>
          </div>
          <input type="range" min={12} max={84} step={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground uppercase tracking-wider">Interest rate (APR)</span>
            <span className="font-semibold font-display">{rate}%</span>
          </div>
          <input type="range" min={9} max={22} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </div>

        <div className="bg-brand/5 border border-brand/20 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Estimated monthly payment</p>
          <p className="font-display text-3xl font-semibold text-brand mt-1">{formatKESFull(Math.round(loan.monthly))}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Total interest:</span> <span className="font-semibold font-display">{formatKES(Math.round(loan.totalInterest))}</span></div>
            <div><span className="text-muted-foreground">Total payable:</span> <span className="font-semibold font-display">{formatKES(Math.round(loan.total))}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-edge p-5">
        <h4 className="font-display font-medium text-base flex items-center gap-1.5"><Shield className="w-4 h-4" strokeWidth={1.5} /> Insurance estimate</h4>
        <p className="text-xs text-muted-foreground mt-0.5 font-light">Comprehensive cover, Kenyan average ~3.5% of value.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Annual premium</p>
            <p className="font-display font-semibold text-lg">{formatKESFull(Math.round(ins.annual))}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Monthly equivalent</p>
            <p className="font-display font-semibold text-lg">{formatKESFull(Math.round(ins.monthly))}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
