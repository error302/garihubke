'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Heart, Search, Sparkles, Menu, Sun, Moon, Shield, LayoutGrid, Calculator, Store, Newspaper, GitCompare, Tag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useState } from 'react'
import type { ViewKey } from '@/lib/types'

const NAV_ITEMS: { key: ViewKey; label: string; icon: any }[] = [
  { key: 'browse', label: 'Browse', icon: Search },
  { key: 'compare', label: 'Compare', icon: GitCompare },
  { key: 'finance', label: 'Finance', icon: Calculator },
  { key: 'sell', label: 'Sell', icon: Tag },
  { key: 'dealers', label: 'Dealers', icon: Store },
  { key: 'articles', label: 'Guides', icon: Newspaper },
  { key: 'concierge', label: 'AI Concierge', icon: Sparkles },
  { key: 'admin', label: 'Admin', icon: Shield },
]

export function Header() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const favorites = useAppStore((s) => s.favorites)
  const compareIds = useAppStore((s) => s.compareIds)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const setChatOpen = useAppStore((s) => s.setChatOpen)
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (v: ViewKey) => {
    setView(v)
    setMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container-premium flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center font-display font-bold text-lg">G</div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="font-display font-bold text-lg tracking-tight">GariHub</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Kenya</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition',
                  view === item.key
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.key === 'compare' && compareIds.length > 0 && (
                  <span className="ml-1 text-[10px] bg-brand text-brand-foreground rounded-full w-4 h-4 inline-flex items-center justify-center">{compareIds.length}</span>
                )}
                {item.key === 'favorites' && favorites.length > 0 && (
                  <span className="ml-1 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 inline-flex items-center justify-center">{favorites.length}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => go('favorites')}
              className="relative p-2 rounded-lg hover:bg-muted transition"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 inline-flex items-center justify-center">{favorites.length}</span>
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Button
              size="sm"
              onClick={() => setChatOpen(true)}
              className="hidden sm:inline-flex bg-brand hover:bg-brand/90 text-brand-foreground gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Ask Gari
            </Button>
            {/* Mobile menu trigger */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
                <SheetHeader className="px-5 py-4 border-b border-border">
                  <SheetTitle className="font-display text-left">GariHub KE</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-3">
                  <button onClick={() => go('home')} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition text-left">
                    <LayoutGrid className="w-5 h-5" /> Home
                  </button>
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => go(item.key)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-lg transition text-left',
                        view === item.key ? 'bg-foreground text-background' : 'hover:bg-muted',
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                      {item.key === 'compare' && compareIds.length > 0 && (
                        <span className="ml-auto text-[10px] bg-brand text-brand-foreground rounded-full w-5 h-5 inline-flex items-center justify-center">{compareIds.length}</span>
                      )}
                    </button>
                  ))}
                </nav>
                <div className="px-5 py-4 border-t border-border mt-auto">
                  <Button className="w-full bg-brand hover:bg-brand/90 text-brand-foreground gap-1.5" onClick={() => { setChatOpen(true); setMenuOpen(false) }}>
                    <Sparkles className="w-4 h-4" /> Ask Gari AI
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}

// Mobile bottom navigation (visible only on small screens)
export function MobileBottomNav() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const setChatOpen = useAppStore((s) => s.setChatOpen)
  const favorites = useAppStore((s) => s.favorites)
  const compareIds = useAppStore((s) => s.compareIds)

  const items: { key: ViewKey | 'chat'; label: string; icon: any; badge?: number }[] = [
    { key: 'home', label: 'Home', icon: LayoutGrid },
    { key: 'browse', label: 'Browse', icon: Search },
    { key: 'chat', label: 'Ask Gari', icon: Sparkles },
    { key: 'compare', label: 'Compare', icon: GitCompare, badge: compareIds.length },
    { key: 'favorites', label: 'Saved', icon: Heart, badge: favorites.length },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16">
        {items.map((it) => {
          const active = it.key !== 'chat' && view === it.key
          return (
            <button
              key={it.key}
              onClick={() => it.key === 'chat' ? setChatOpen(true) : setView(it.key as ViewKey)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition',
                active ? 'text-brand' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <it.icon className={cn('w-5 h-5', it.key === 'chat' && 'text-brand')} />
              <span>{it.label}</span>
              {it.badge ? (
                <span className="absolute top-1 right-1/2 translate-x-3 -translate-y-1 bg-red-500 text-white text-[9px] font-semibold rounded-full min-w-4 h-4 px-1 inline-flex items-center justify-center">{it.badge}</span>
              ) : null}
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand rounded-full" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
