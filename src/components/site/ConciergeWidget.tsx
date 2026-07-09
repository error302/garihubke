'use client'

import { useAppStore } from '@/lib/store'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, X, Send, ArrowRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { VehicleCard } from './VehicleCard'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const SUGGESTIONS = [
  "I have KES 5M for a family SUV — what do you recommend?",
  "Best fuel-efficient car for Nairobi traffic?",
  "Show me a 4x4 pickup that can handle upcountry trips",
  "What's the most reliable used car under KES 3M?",
  "Compare Toyota Prado vs Land Cruiser",
]

export function ConciergeWidget() {
  const open = useAppStore((s) => s.chatOpen)
  const setOpen = useAppStore((s) => s.setChatOpen)
  const messages = useAppStore((s) => s.chatMessages)
  const addMessage = useAppStore((s) => s.addChatMessage)
  const openDetail = useAppStore((s) => s.openDetail)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setInput('')
    const userMsg = { role: 'user' as const, content: text }
    addMessage(userMsg)
    setLoading(true)
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await r.json()
      addMessage({ role: 'assistant', content: data.reply, recs: data.recommendations || [] })
    } catch (e) {
      toast.error('Could not reach Gari AI')
      addMessage({ role: 'assistant', content: 'Sorry, I had trouble reaching my brain. Please try again in a moment.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating launcher (desktop only — mobile uses bottom nav) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="hidden lg:flex fixed bottom-6 right-6 z-30 items-center gap-2 px-4 py-3 rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30 hover:scale-105 transition"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium text-sm">Ask Gari</span>
          </motion.button>
        )}
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md lg:max-w-lg p-0 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-br from-brand/10 to-accent/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand text-brand-foreground flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold leading-none">Gari AI</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Your car concierge · online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-background">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 premium-scroll">
            <div className="p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={m.role === 'user' ? 'max-w-[85%]' : 'max-w-[90%]'}>
                    <div
                      className={
                        m.role === 'user'
                          ? 'bg-foreground text-background rounded-2xl rounded-tr-md px-3.5 py-2.5 text-sm'
                          : 'bg-muted text-foreground rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm'
                      }
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    </div>
                    {m.recs && m.recs.length > 0 && <RecommendationCards slugs={m.recs} />}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="shrink-0 text-xs bg-card border border-border px-3 py-1.5 rounded-full hover:border-brand transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Ask about cars, financing, comparisons…"
                className="flex-1 h-11 px-3 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <Button onClick={() => send(input)} disabled={loading || !input.trim()} className="h-11 w-11 p-0 rounded-full bg-brand hover:bg-brand/90 text-brand-foreground">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function RecommendationCards({ slugs }: { slugs: string[] }) {
  const { data, isLoading } = useQuery({
    queryKey: ['recs', slugs.join(',')],
    queryFn: async () => {
      const results = await Promise.all(
        slugs.map(async (slug) => {
          const r = await fetch(`/api/vehicles/${slug}`)
          if (!r.ok) return null
          const d = await r.json()
          return d.vehicle
        }),
      )
      return results.filter(Boolean)
    },
    enabled: slugs.length > 0,
  })

  if (isLoading || !data || data.length === 0) return null
  return (
    <div className="mt-2 grid gap-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <ArrowRight className="w-3 h-3" /> Recommended for you
      </p>
      {data.map((v: any) => (
        <button
          key={v.id}
          onClick={() => useAppStore.getState().setChatOpen(false) || useAppStore.getState().openDetail(v.slug)}
          className="text-left bg-card border border-border rounded-xl p-2.5 hover:border-brand transition flex gap-2.5"
        >
          <img src={JSON.parse(v.images || '[]')[0]} alt={v.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{v.year} · {v.condition}</p>
            <p className="text-sm font-semibold truncate">{v.title}</p>
            <p className="text-sm font-bold text-brand mt-0.5">
              {v.price >= 1000000 ? `KES ${(v.price / 1000000).toFixed(1)}M` : `KES ${(v.price / 1000).toFixed(0)}K`}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
