'use client'

import { useAppStore } from '@/lib/store'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { ImageUploader, type UploadedImage } from '@/components/site/ImageUploader'
import {
  LayoutDashboard, Car, Users, Store, MessageSquare, BarChart3, Settings,
  TrendingUp, TrendingDown, Star, Eye, Heart, Send, Phone, Mail, MapPin,
  Shield, Sparkles, Award, Search, Filter, Download, MoreHorizontal,
  CircleDollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight, ChevronRight,
  AlertCircle, CheckCircle2, Clock, BadgeCheck, Plus, Pencil, Trash2, X,
  DollarSign, Camera, Loader2,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar,
} from 'recharts'
import { useState, useEffect } from 'react'
import { formatKES, formatKESFull, formatNumber, formatRelativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const NAV = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'inventory', label: 'Inventory', icon: Car },
  { key: 'add-listing', label: 'Add Listing', icon: Plus },
  { key: 'leads', label: 'Leads', icon: MessageSquare },
  { key: 'dealers', label: 'Dealers', icon: Store },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
]

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  qualified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  closed: 'bg-brand/15 text-brand',
  lost: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

const TYPE_LABELS: Record<string, string> = {
  inquiry: 'Inquiry',
  test_drive: 'Test Drive',
  offer: 'Offer',
  finance: 'Finance',
  trade_in: 'Trade-In',
}

export function AdminView() {
  const tab = useAppStore((s) => s.adminTab)
  const setTab = useAppStore((s) => s.setAdminTab)

  return (
    <div className="container-premium py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-card border border-edge rounded-sm p-3 lg:sticky lg:top-20">
            <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
              {NAV.map((n) => (
                <button
                  key={n.key}
                  onClick={() => setTab(n.key)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition shrink-0 lg:w-full lg:justify-start',
                    tab === n.key ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <n.icon className="w-4 h-4" />
                  <span>{n.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'inventory' && <InventoryTab />}
          {tab === 'add-listing' && <AddListingTab />}
          {tab === 'leads' && <LeadsTab />}
          {tab === 'dealers' && <DealersTab />}
          {tab === 'analytics' && <AnalyticsTab />}
          {tab === 'users' && <UsersTab />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

function OverviewTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await (await fetch('/api/admin/stats')).json()),
    staleTime: 30 * 1000,
  })

  if (isLoading) return <div className="text-center py-20 text-muted-foreground">Loading dashboard…</div>
  if (!data) return null

  const t = data.totals
  const c = data.charts

  const kpis = [
    { label: 'Inventory value', value: formatKESFull(t.inventoryValue), delta: '+8.2%', up: true, icon: CircleDollarSign },
    { label: 'Pipeline value', value: formatKESFull(t.pipelineValue), delta: '+12.4%', up: true, icon: TrendingUp },
    { label: 'Total vehicles', value: formatNumber(t.totalVehicles), delta: '+24 this week', up: true, icon: Car },
    { label: 'Active leads', value: formatNumber(t.totalLeads), delta: '+18 today', up: true, icon: MessageSquare },
    { label: 'Verified dealers', value: formatNumber(t.totalDealers), delta: '+2', up: true, icon: Store },
    { label: 'Registered users', value: formatNumber(t.totalUsers), delta: '+5.1%', up: true, icon: Users },
    { label: 'Avg rating', value: `${t.avgRating} ★`, delta: '+0.1', up: true, icon: Star },
    { label: 'Featured listings', value: formatNumber(t.featuredVehicles), delta: '0', up: true, icon: Sparkles },
  ]

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Admin</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-2 font-light">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-card border border-edge rounded-sm p-4">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 bg-brand/10 flex items-center justify-center">
                <k.icon className="w-4 h-4 text-brand" strokeWidth={1.5} />
              </div>
              <span className={cn('text-[10px] font-semibold inline-flex items-center gap-0.5', k.up ? 'text-brand' : 'text-red-500')}>
                {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {k.delta}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-3">{k.label}</p>
            <p className="font-display text-xl sm:text-2xl font-medium mt-0.5 tracking-tight">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads trend */}
        <div className="lg:col-span-2 bg-card border border-edge rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-medium text-base">Leads · last 14 days</h3>
              <p className="text-xs text-muted-foreground">Inquiry, test drive, finance & offer requests</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast('Exporting…')}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={c.leadsTrend}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--brand)" strokeWidth={2} fill="url(#leadGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead types */}
        <div className="bg-card border border-edge rounded-sm p-5">
          <h3 className="font-display font-medium text-base">Lead types</h3>
          <p className="text-xs text-muted-foreground">Distribution by intent</p>
          <div className="h-48 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={c.leadsByType} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {c.leadsByType.map((_: any, i: number) => (
                    <Cell key={i} fill={['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'][i % 5]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {c.leadsByType.map((l: any, i: number) => (
              <div key={l.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'][i % 5] }} />
                  {TYPE_LABELS[l.name] || l.name}
                </span>
                <span className="font-semibold">{l.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top makes + Lead status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-edge rounded-sm p-5">
          <h3 className="font-display font-medium text-base">Top makes</h3>
          <p className="text-xs text-muted-foreground">Inventory distribution by manufacturer</p>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={c.topMakes} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={70} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                  cursor={{ fill: 'var(--muted)' }}
                />
                <Bar dataKey="value" fill="var(--brand)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-edge rounded-sm p-5">
          <h3 className="font-display font-medium text-base">Lead status funnel</h3>
          <p className="text-xs text-muted-foreground">Conversion pipeline</p>
          <div className="mt-4 space-y-3">
            {c.leadsByStatus.map((s: any, i: number) => {
              const total = c.leadsByStatus.reduce((a: number, b: any) => a + b.value, 0)
              const pct = total ? (s.value / total) * 100 : 0
              const colors: Record<string, string> = {
                new: 'bg-blue-500', contacted: 'bg-amber-500', qualified: 'bg-emerald-500', closed: 'bg-brand', lost: 'bg-red-500',
              }
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium capitalize">{s.name}</span>
                    <span className="text-muted-foreground">{s.value} · {pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', colors[s.name] || 'bg-foreground')} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top viewed vehicles */}
      <div className="bg-card border border-edge rounded-sm p-5">
        <h3 className="font-display font-medium text-base mb-3">Top viewed vehicles</h3>
        <div className="space-y-2">
          {data.topViewed.map((v: any, i: number) => (
            <div key={v.id} className="flex items-center gap-3 p-2 hover:bg-muted/40 rounded-lg transition">
              <span className="font-display font-medium text-lg text-muted-foreground w-6">#{i + 1}</span>
              <img src={JSON.parse(v.images || '[]')[0]} alt={v.title} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{v.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(v.viewsCount)}</span>
                  <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(v.favoritesCount)}</span>
                  <span className="inline-flex items-center gap-1"><Send className="w-3 h-3" />{formatNumber(v.leadsCount)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{formatKES(v.price)}</p>
                <p className="text-[10px] text-muted-foreground">{v.dealer?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InventoryTab() {
  const [search, setSearch] = useState('')
  const setTab = useAppStore((s) => s.setAdminTab)
  const setEditingVehicleId = useAppStore((s) => s.setEditingVehicleId)
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => (await (await fetch('/api/vehicles?limit=200')).json()).vehicles as any[],
    staleTime: 30 * 1000,
  })

  const filtered = data?.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.make.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' })
      toast.success('Vehicle deleted')
      qc.invalidateQueries({ queryKey: ['admin-inventory'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
    } catch (e) {
      toast.error('Failed to delete')
    }
  }

  const toggleFeatured = async (v: any) => {
    await fetch(`/api/admin/vehicles/${v.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !v.isFeatured }),
    })
    toast.success(v.isFeatured ? 'Removed from featured' : 'Added to featured')
    qc.invalidateQueries({ queryKey: ['admin-inventory'] })
  }

  const toggleStatus = async (v: any) => {
    const next = v.status === 'active' ? 'sold' : 'active'
    await fetch(`/api/admin/vehicles/${v.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    toast.success(`Marked as ${next}`)
    qc.invalidateQueries({ queryKey: ['admin-inventory'] })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">{data?.length || 0} vehicles · {filtered?.length || 0} shown</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventory…" className="pl-9 h-10 w-56 bg-card" />
          </div>
          <Button variant="outline" className="h-10 border-edge"><Filter className="w-4 h-4 mr-1.5" /> Filter</Button>
          <Button
            onClick={() => { setEditingVehicleId(null); setTab('add-listing') }}
            className="h-10 bg-brand hover:bg-brand/90 text-brand-foreground"
          ><Plus className="w-4 h-4 mr-1.5" /> Add listing</Button>
        </div>
      </div>

      <div className="bg-card border border-edge rounded-sm overflow-hidden">
        <div className="overflow-x-auto premium-scroll">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">Vehicle</th>
                <th className="text-left p-3 font-medium">Photos</th>
                <th className="text-left p-3 font-medium">Dealer</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Views</th>
                <th className="text-left p-3 font-medium">Leads</th>
                <th className="text-left p-3 font-medium">Listed</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((v) => {
                const imgs = JSON.parse(v.images || '[]') as string[]
                return (
                  <tr key={v.id} className="border-t border-edge hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={imgs[0]} alt={v.title} className="w-12 h-10 rounded-sm object-cover" />
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px]">{v.title}</p>
                          <p className="text-xs text-muted-foreground">{v.year} · {v.bodyType} · {v.fuelType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          {imgs.slice(0, 4).map((img, i) => (
                            <img key={i} src={img} alt="" className="w-7 h-7 rounded-sm object-cover border border-card" />
                          ))}
                        </div>
                        {imgs.length > 4 && <span className="text-[10px] text-muted-foreground ml-1">+{imgs.length - 4}</span>}
                        {imgs.length === 0 && <span className="text-[10px] text-muted-foreground">No photos</span>}
                      </div>
                    </td>
                    <td className="p-3 text-xs">{v.dealer?.name || '—'}</td>
                    <td className="p-3">
                      <button onClick={() => toggleStatus(v)} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80">
                        <span className={cn('inline-flex items-center gap-1',
                          v.status === 'active' ? 'bg-brand/15 text-brand' :
                          v.status === 'sold' ? 'bg-foreground/10 text-foreground' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300')}>
                          {v.status === 'active' && <CheckCircle2 className="w-2.5 h-2.5" />}
                          {v.status === 'pending' && <Clock className="w-2.5 h-2.5" />}
                          {v.status === 'sold' && <span>✓</span>}
                          {v.status}
                        </span>
                      </button>
                      <button onClick={() => toggleFeatured(v)} className="ml-1 text-[10px] hover:opacity-70">
                        <span className={cn(v.isFeatured ? 'text-brand' : 'text-muted-foreground/40')}>★</span>
                      </button>
                    </td>
                    <td className="p-3 font-medium">{formatKES(v.price)}</td>
                    <td className="p-3 text-xs">{formatNumber(v.viewsCount)}</td>
                    <td className="p-3 text-xs">{formatNumber(v.leadsCount)}</td>
                    <td className="p-3 text-xs text-muted-foreground">{formatRelativeTime(v.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingVehicleId(v.id); setTab('add-listing') }}
                          className="p-1.5 hover:bg-muted rounded transition"
                          title="Edit"
                        ><Pencil className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                        <button
                          onClick={() => handleDelete(v.id, v.title)}
                          className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition"
                          title="Delete"
                        ><Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function LeadsTab() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'all' ? '/api/leads' : `/api/leads?status=${statusFilter}`
      return (await (await fetch(url)).json()).leads as any[]
    },
    staleTime: 30 * 1000,
  })

  const qc = useQueryClient()
  const updateStatus = async (id: string, status: string) => {
    toast.success(`Lead marked as ${status}`)
    qc.invalidateQueries({ queryKey: ['admin-leads'] })
    qc.invalidateQueries({ queryKey: ['admin-stats'] })
  }

  const statuses = ['all', 'new', 'contacted', 'qualified', 'closed', 'lost']

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">{data?.length || 0} leads · filter and manage</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'shrink-0 text-xs px-3 py-1.5 rounded-full border transition capitalize',
              statusFilter === s ? 'bg-foreground text-background border-foreground' : 'bg-card border-edge hover:border-foreground/30',
            )}
          >{s}</button>
        ))}
      </div>

      <div className="space-y-2">
        {data?.map((l) => (
          <div key={l.id} className="bg-card border border-edge rounded-sm p-4 hover:shadow-sm transition">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-display font-semibold text-sm shrink-0">
                {l.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(l.createdAt)} · {TYPE_LABELS[l.type] || l.type}</p>
                  </div>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', STATUS_COLORS[l.status])}>
                    {l.status}
                  </span>
                </div>
                {l.vehicle && (
                  <p className="text-sm mt-1.5">
                    <span className="text-muted-foreground">Vehicle: </span>
                    <span className="font-medium">{l.vehicle.title}</span>
                    <span className="text-muted-foreground"> · {formatKES(l.vehicle.price)}</span>
                  </p>
                )}
                <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{l.message}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1 hover:text-brand"><Mail className="w-3 h-3" />{l.email}</a>
                  {l.phone && <a href={`tel:${l.phone}`} className="inline-flex items-center gap-1 hover:text-brand"><Phone className="w-3 h-3" />{l.phone}</a>}
                  {l.budget && <span className="inline-flex items-center gap-1"><CircleDollarSign className="w-3 h-3" />Budget: {formatKES(l.budget)}</span>}
                </div>
                <div className="mt-3 flex gap-1.5 flex-wrap">
                  {l.status !== 'contacted' && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(l.id, 'contacted')}>Mark contacted</Button>
                  )}
                  {l.status !== 'qualified' && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(l.id, 'qualified')}>Qualify</Button>
                  )}
                  {l.status !== 'closed' && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(l.id, 'closed')}>Close</Button>
                  )}
                  {l.status !== 'lost' && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500" onClick={() => updateStatus(l.id, 'lost')}>Mark lost</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {data?.length === 0 && (
          <div className="text-center py-16 bg-card border border-edge rounded-sm">
            <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No leads in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DealersTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dealers'],
    queryFn: async () => (await (await fetch('/api/dealers')).json()).dealers as any[],
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Dealers</h1>
        <p className="text-sm text-muted-foreground mt-1">{data?.length || 0} dealers · manage verifications</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data?.map((d) => (
          <div key={d.id} className="bg-card border border-edge rounded-sm p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-sm bg-foreground text-background flex items-center justify-center font-display font-bold shrink-0">
                {d.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold truncate">{d.name}</p>
                  {d.isVerified && <BadgeCheck className="w-4 h-4 text-brand shrink-0" />}
                  {d.isPremium && <Award className="w-3.5 h-3.5 text-brand shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground">{d.city} · {d._count.vehicles} listings</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-center">
              <div><p className="font-semibold">{d.rating}★</p><p className="text-muted-foreground">{d.reviewsCount}</p></div>
              <div><p className="font-semibold">{d.totalSales}</p><p className="text-muted-foreground">sold</p></div>
              <div><p className="font-semibold">{d.responseRate}%</p><p className="text-muted-foreground">resp</p></div>
            </div>
            <div className="mt-3 flex gap-1.5">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">View</Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsTab() {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await (await fetch('/api/admin/stats')).json()),
    staleTime: 30 * 1000,
  })
  if (!data) return <div className="text-center py-20 text-muted-foreground">Loading…</div>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep dive into marketplace performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Body type distribution */}
        <div className="bg-card border border-edge rounded-sm p-5">
          <h3 className="font-display font-medium text-base">Body type mix</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.charts.topBody} dataKey="value" nameKey="name" outerRadius={90} label={(e: any) => `${e.name} ${e.value}`} labelLine={false}>
                  {data.charts.topBody.map((_: any, i: number) => (
                    <Cell key={i} fill={['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'][i % 5]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel type distribution */}
        <div className="bg-card border border-edge rounded-sm p-5">
          <h3 className="font-display font-medium text-base">Fuel type mix</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.topFuel}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="value" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top dealers */}
        <div className="bg-card border border-edge rounded-sm p-5 lg:col-span-2">
          <h3 className="font-display font-medium text-base">Top dealers by inventory</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.topDealers} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="value" fill="var(--brand)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function UsersTab() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage user accounts and roles</p>
      </div>
      <div className="bg-card border border-edge rounded-sm p-8 text-center text-sm text-muted-foreground">
        <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
        User management interface — wire to auth provider for production.
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Site configuration & integrations</p>
      </div>
      <div className="bg-card border border-edge rounded-sm p-5 space-y-4">
        <div>
          <h3 className="font-display font-semibold text-sm">Marketplace</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"><span>Default currency</span><span className="font-semibold">KES</span></div>
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"><span>Default region</span><span className="font-semibold">Kenya</span></div>
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"><span>Featured listing fee</span><span className="font-semibold">KES 5,000 / 30 days</span></div>
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"><span>Premium dealer tier</span><span className="font-semibold">KES 25,000 / mo</span></div>
          </div>
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm">Integrations</h3>
          <div className="mt-3 space-y-2 text-sm">
            {[
              { name: 'M-Pesa Daraja API', status: 'connected' },
              { name: 'Stripe', status: 'connected' },
              { name: 'Resend (Email)', status: 'connected' },
              { name: 'Twilio (SMS)', status: 'disconnected' },
              { name: 'Google Maps', status: 'connected' },
            ].map((i) => (
              <div key={i.name} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <span>{i.name}</span>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', i.status === 'connected' ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground')}>
                  {i.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============== ADD LISTING TAB ==============
function AddListingTab() {
  const editingVehicleId = useAppStore((s) => s.editingVehicleId)
  const setEditingVehicleId = useAppStore((s) => s.setEditingVehicleId)
  const setTab = useAppStore((s) => s.setAdminTab)
  const qc = useQueryClient()

  const [step, setStep] = useState(1)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    make: '', model: '', year: '2024', variant: '', bodyType: 'SUV', fuelType: 'Petrol',
    transmission: 'Automatic', drivetrain: 'FWD', condition: 'Used', mileage: '',
    price: '', exteriorColor: '', interiorColor: '', engine: '', displacement: '',
    horsepower: '', torque: '', doors: '4', seats: '5', description: '', city: 'Nairobi',
    region: 'Nairobi', features: '', isFeatured: false, isPremium: false, dealerId: '',
  })

  const { data: dealers } = useQuery({
    queryKey: ['dealers'],
    queryFn: async () => (await (await fetch('/api/dealers')).json()).dealers as any[],
    staleTime: 5 * 60 * 1000,
  })

  // Load existing vehicle if editing
  const { data: editingVehicle } = useQuery({
    queryKey: ['edit-vehicle', editingVehicleId],
    queryFn: async () => {
      if (!editingVehicleId) return null
      const r = await fetch('/api/vehicles?limit=200')
      const d = await r.json()
      return (d.vehicles as any[]).find((v) => v.id === editingVehicleId)
    },
    enabled: !!editingVehicleId,
  })

  // Populate form when editing
  useEffect(() => {
    if (editingVehicle) {
      const feats = JSON.parse(editingVehicle.features || '[]') as string[]
      setForm({
        make: editingVehicle.make || '',
        model: editingVehicle.model || '',
        year: String(editingVehicle.year || 2024),
        variant: editingVehicle.variant || '',
        bodyType: editingVehicle.bodyType || 'SUV',
        fuelType: editingVehicle.fuelType || 'Petrol',
        transmission: editingVehicle.transmission || 'Automatic',
        drivetrain: editingVehicle.drivetrain || 'FWD',
        condition: editingVehicle.condition || 'Used',
        mileage: editingVehicle.mileage ? String(editingVehicle.mileage) : '',
        price: String(editingVehicle.price || ''),
        exteriorColor: editingVehicle.exteriorColor || '',
        interiorColor: editingVehicle.interiorColor || '',
        engine: editingVehicle.engine || '',
        displacement: editingVehicle.displacement || '',
        horsepower: editingVehicle.horsepower ? String(editingVehicle.horsepower) : '',
        torque: editingVehicle.torque ? String(editingVehicle.torque) : '',
        doors: String(editingVehicle.doors || 4),
        seats: String(editingVehicle.seats || 5),
        description: editingVehicle.description || '',
        city: editingVehicle.city || 'Nairobi',
        region: editingVehicle.region || 'Nairobi',
        features: feats.join(', '),
        isFeatured: editingVehicle.isFeatured || false,
        isPremium: editingVehicle.isPremium || false,
        dealerId: editingVehicle.dealerId || '',
      })
    }
  }, [editingVehicle])

  const handleSubmit = async () => {
    if (!form.make || !form.model || !form.price) {
      toast.error('Make, model, and price are required')
      return
    }
    setSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)))
      images.forEach((img) => formData.append('images', img.file))

      const r = await fetch('/api/admin/vehicles', { method: 'POST', body: formData })
      if (!r.ok) {
        const err = await r.json()
        throw new Error(err.error || 'Failed to create listing')
      }
      const data = await r.json()
      toast.success(`Listing created with ${data.imageCount} photo${data.imageCount !== 1 ? 's' : ''}!`)

      // Reset
      setForm({
        make: '', model: '', year: '2024', variant: '', bodyType: 'SUV', fuelType: 'Petrol',
        transmission: 'Automatic', drivetrain: 'FWD', condition: 'Used', mileage: '',
        price: '', exteriorColor: '', interiorColor: '', engine: '', displacement: '',
        horsepower: '', torque: '', doors: '4', seats: '5', description: '', city: 'Nairobi',
        region: 'Nairobi', features: '', isFeatured: false, isPremium: false, dealerId: '',
      })
      setImages([])
      setStep(1)
      setEditingVehicleId(null)
      qc.invalidateQueries({ queryKey: ['admin-inventory'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setTab('inventory')
    } catch (e: any) {
      toast.error(e.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{editingVehicleId ? 'Edit listing' : 'Create listing'}</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
            {editingVehicleId ? 'Edit vehicle' : 'New listing'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-light">
            {editingVehicleId ? 'Update the vehicle details and photos.' : 'Add a vehicle to your inventory with multiple photos.'}
          </p>
        </div>
        {editingVehicleId && (
          <Button variant="outline" onClick={() => { setEditingVehicleId(null); setTab('inventory') }} className="border-edge">
            <X className="w-4 h-4 mr-1" /> Cancel edit
          </Button>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { n: 1, label: 'Photos' },
          { n: 2, label: 'Details' },
          { n: 3, label: 'Pricing' },
          { n: 4, label: 'Review' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center font-display font-medium text-xs', step === s.n ? 'bg-foreground text-background' : step > s.n ? 'bg-brand text-brand-foreground' : 'bg-muted text-muted-foreground')}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span className={cn('hidden sm:inline text-xs', step === s.n ? 'font-medium' : 'text-muted-foreground')}>{s.label}</span>
            {i < 3 && <div className="flex-1 h-px bg-edge" />}
          </div>
        ))}
      </div>

      {/* Step 1: Photos */}
      {step === 1 && (
        <div className="bg-card border border-edge p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="font-display text-xl font-medium flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand" strokeWidth={1.5} /> Vehicle photos
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-light">
              Upload up to 20 photos. The first photo will be the cover image shown in search results.
              We accept JPG, PNG, and WebP — images are automatically resized and optimized.
            </p>
          </div>

          {editingVehicleId && editingVehicle && !images.length && (
            <div className="bg-brand/5 border border-brand/20 p-4 text-xs">
              <p className="font-medium mb-2">Current photos ({JSON.parse(editingVehicle.images || '[]').length}):</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {(JSON.parse(editingVehicle.images || '[]') as string[]).map((img, i) => (
                  <div key={i} className="aspect-square border border-edge overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-muted-foreground">Upload new photos below to replace the existing ones.</p>
            </div>
          )}

          <ImageUploader images={images} onChange={setImages} max={20} />

          <div className="flex justify-between pt-4 border-t border-edge">
            <Button variant="outline" onClick={() => { setEditingVehicleId(null); setTab('inventory') }} className="border-edge">Cancel</Button>
            <Button onClick={() => setStep(2)} className="bg-foreground hover:bg-foreground/90 text-background">
              Continue to details →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="bg-card border border-edge p-6 sm:p-8 space-y-5">
          <h2 className="font-display text-xl font-medium">Vehicle details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Make *" value={form.make} onChange={(v) => setForm({ ...form, make: v })} placeholder="Toyota" />
            <FormField label="Model *" value={form.model} onChange={(v) => setForm({ ...form, model: v })} placeholder="Land Cruiser" />
            <FormField label="Year *" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2024" />
            <FormField label="Variant" value={form.variant} onChange={(v) => setForm({ ...form, variant: v })} placeholder="ZX" />
            <FormSelect label="Body type" value={form.bodyType} onChange={(v) => setForm({ ...form, bodyType: v })} options={['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Pickup', 'Van', 'Wagon', 'Convertible']} />
            <FormSelect label="Fuel type" value={form.fuelType} onChange={(v) => setForm({ ...form, fuelType: v })} options={['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plugin Hybrid']} />
            <FormSelect label="Transmission" value={form.transmission} onChange={(v) => setForm({ ...form, transmission: v })} options={['Automatic', 'Manual', 'CVT', 'DCT']} />
            <FormSelect label="Drivetrain" value={form.drivetrain} onChange={(v) => setForm({ ...form, drivetrain: v })} options={['AWD', 'FWD', 'RWD', '4WD']} />
            <FormSelect label="Condition" value={form.condition} onChange={(v) => setForm({ ...form, condition: v })} options={['New', 'Used', 'Certified Pre-Owned']} />
            <FormField label="Mileage (km)" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: v })} placeholder="0 for new" />
            <FormField label="Engine" value={form.engine} onChange={(v) => setForm({ ...form, engine: v })} placeholder="3.3L V6 Twin Turbo" />
            <FormField label="Displacement" value={form.displacement} onChange={(v) => setForm({ ...form, displacement: v })} placeholder="3.3L" />
            <FormField label="Horsepower" value={form.horsepower} onChange={(v) => setForm({ ...form, horsepower: v })} placeholder="309" />
            <FormField label="Torque (Nm)" value={form.torque} onChange={(v) => setForm({ ...form, torque: v })} placeholder="700" />
            <FormField label="Doors" value={form.doors} onChange={(v) => setForm({ ...form, doors: v })} placeholder="4" />
            <FormField label="Seats" value={form.seats} onChange={(v) => setForm({ ...form, seats: v })} placeholder="5" />
            <FormField label="Exterior color" value={form.exteriorColor} onChange={(v) => setForm({ ...form, exteriorColor: v })} placeholder="Pearl White" />
            <FormField label="Interior color" value={form.interiorColor} onChange={(v) => setForm({ ...form, interiorColor: v })} placeholder="Black" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Write a compelling description. Mention service history, standout features, and condition…"
              className="mt-1.5 w-full p-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand resize-none font-light"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Features (comma-separated)</label>
            <input
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="4WD, Panoramic Sunroof, Leather Seats, Apple CarPlay, 360 Camera"
              className="mt-1.5 w-full h-11 px-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand"
            />
            <p className="text-xs text-muted-foreground mt-1 font-light">Separate each feature with a comma.</p>
          </div>

          <FormSelect label="Dealer (optional)" value={form.dealerId} onChange={(v) => setForm({ ...form, dealerId: v })} options={['', ...(dealers?.map((d) => d.id) || [])]} optionLabels={['No dealer', ...(dealers?.map((d) => d.name) || [])]} />

          <div className="flex justify-between pt-4 border-t border-edge">
            <Button variant="outline" onClick={() => setStep(1)} className="border-edge">← Back to photos</Button>
            <Button onClick={() => setStep(3)} disabled={!form.make || !form.model} className="bg-foreground hover:bg-foreground/90 text-background">Continue to pricing →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <div className="bg-card border border-edge p-6 sm:p-8 space-y-5">
          <h2 className="font-display text-xl font-medium">Pricing & location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Price (KES) *" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="14500000" />
            <FormSelect label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v, region: v === 'Mombasa' || v === 'Kisumu' ? (v === 'Mombasa' ? 'Coast' : 'Nyanza') : v === 'Nakuru' || v === 'Eldoret' ? 'Rift Valley' : v === 'Thika' || v === 'Kiambu' ? 'Central' : 'Nairobi' })} options={['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Kiambu']} />
          </div>

          {/* Listing options */}
          <div className="space-y-3 pt-4 border-t border-edge">
            <h3 className="font-display font-medium text-sm">Listing options</h3>
            <label className="flex items-center gap-3 p-3 border border-edge cursor-pointer hover:bg-muted/30 transition">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-brand" />
              <div className="flex-1">
                <p className="text-sm font-medium flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-brand" /> Featured listing</p>
                <p className="text-xs text-muted-foreground font-light">Appears at the top of search results and the homepage. KES 5,000 / 30 days.</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-edge cursor-pointer hover:bg-muted/30 transition">
              <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm({ ...form, isPremium: e.target.checked })} className="w-4 h-4 accent-brand" />
              <div className="flex-1">
                <p className="text-sm font-medium flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-brand" /> Premium listing</p>
                <p className="text-xs text-muted-foreground font-light">Includes 360° tour, priority placement, and "Deal Rating" analysis. KES 12,000 / 30 days.</p>
              </div>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-edge">
            <Button variant="outline" onClick={() => setStep(2)} className="border-edge">← Back to details</Button>
            <Button onClick={() => setStep(4)} disabled={!form.price} className="bg-foreground hover:bg-foreground/90 text-background">Review listing →</Button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-card border border-edge p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-xl font-medium">Review & publish</h2>

            {/* Photo preview */}
            {images.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{images.length} photo{images.length !== 1 ? 's' : ''} ready</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {images.map((img, i) => (
                    <div key={img.id} className={cn('aspect-square overflow-hidden border', i === 0 ? 'border-brand border-2' : 'border-edge')}>
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-edge">
              <SummaryItem label="Vehicle" value={`${form.year} ${form.make} ${form.model} ${form.variant}`.trim()} />
              <SummaryItem label="Price" value={`KES ${Number(form.price || 0).toLocaleString()}`} />
              <SummaryItem label="Condition" value={form.condition} />
              <SummaryItem label="Mileage" value={form.mileage ? `${Number(form.mileage).toLocaleString()} km` : 'Brand new'} />
              <SummaryItem label="Body type" value={form.bodyType} />
              <SummaryItem label="Fuel" value={form.fuelType} />
              <SummaryItem label="Transmission" value={form.transmission} />
              <SummaryItem label="Drivetrain" value={form.drivetrain} />
              <SummaryItem label="Location" value={`${form.city}, ${form.region}`} />
              <SummaryItem label="Featured" value={form.isFeatured ? 'Yes' : 'No'} />
              <SummaryItem label="Premium" value={form.isPremium ? 'Yes' : 'No'} />
              <SummaryItem label="Photos" value={String(images.length || (editingVehicle ? JSON.parse(editingVehicle.images || '[]').length : 0))} />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)} className="border-edge">← Back to pricing</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-brand hover:bg-brand/90 text-brand-foreground min-w-[200px]">
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> {editingVehicleId ? 'Update listing' : 'Publish listing'}</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
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

function FormSelect({ label, value, onChange, options, optionLabels }: { label: string; value: string; onChange: (v: string) => void; options: string[]; optionLabels?: string[] }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 px-3 bg-background border border-edge text-sm focus:outline-none focus:border-brand"
      >
        {options.map((o, i) => <option key={o + i} value={o}>{optionLabels ? optionLabels[i] : o}</option>)}
      </select>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium font-display mt-0.5">{value}</p>
    </div>
  )
}
