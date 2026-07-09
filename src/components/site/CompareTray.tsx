'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { X, GitCompare, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { formatKES } from '@/lib/format'
import { motion, AnimatePresence } from 'framer-motion'

export function CompareTray() {
  const compareIds = useAppStore((s) => s.compareIds)
  const setView = useAppStore((s) => s.setView)
  const toggleCompare = useAppStore((s) => s.toggleCompare)
  const detailSlug = useAppStore((s) => s.detailSlug)

  const { data } = useQuery({
    queryKey: ['compare-tray', compareIds.join(',')],
    queryFn: async () => {
      if (compareIds.length === 0) return []
      const r = await fetch('/api/vehicles?limit=200')
      const d = await r.json()
      return (d.vehicles as any[]).filter((v) => compareIds.includes(v.id))
    },
    enabled: compareIds.length > 0,
  })

  const show = compareIds.length > 0 && !detailSlug

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-1rem)] sm:w-auto max-w-3xl"
        >
          <div className="bg-card border border-border rounded-2xl shadow-xl shadow-black/10 p-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <GitCompare className="w-5 h-5 text-brand" />
              <span className="font-display font-semibold text-sm hidden sm:inline">Compare</span>
            </div>
            <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
              {data?.map((v) => {
                const imgs = JSON.parse(v.images || '[]') as string[]
                return (
                  <div key={v.id} className="shrink-0 relative">
                    <img src={imgs[0]} alt={v.title} className="w-12 h-12 rounded-lg object-cover" />
                    <button
                      onClick={() => toggleCompare(v.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-red-500"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                    <p className="text-[9px] text-center mt-0.5 max-w-[60px] truncate">{formatKES(v.price)}</p>
                  </div>
                )
              })}
              {compareIds.length < 3 && (
                <div className="w-12 h-12 shrink-0 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                  +
                </div>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => setView('compare')}
              className="bg-brand hover:bg-brand/90 text-brand-foreground shrink-0"
              disabled={compareIds.length < 2}
            >
              Compare <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
