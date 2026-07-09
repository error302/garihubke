'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Heart, Search, Menu, Sun, Moon, Shield, LayoutGrid, Calculator, Store, Newspaper, GitCompare, Tag, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { ViewKey } from '@/lib/types'
import { useEffect, useState } from 'react'

const NAV_ITEMS: { key: ViewKey; label: string; icon: any }[] = [
  { key: 'browse', label: 'Browse', icon: Search },
  { key: 'compare', label: 'Compare', icon: GitCompare },
  { key: 'finance', label: 'Finance', icon: Calculator },
  { key: 'sell', label: 'Sell', icon: Tag },
  { key: 'dealers', label: 'Dealers', icon: Store },
  { key: 'articles', label: 'Journal', icon: Newspaper },
  { key: 'admin', label: 'Admin', icon: Shield },
]

export function Header() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const favorites = useAppStore((s) => s.favorites)
  const compareIds = useAppStore((s) => s.compareIds)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const menuOpen = useAppStore((s) => s.menuOpen)
  const setMenuOpen = useAppStore((s) => s.setMenuOpen)

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (v: ViewKey) => {
    setView(v)
    setMenuOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          scrolled ? 'glass border-b border-edge' : 'border-b border-transparent',
        )}
      >
        <div className="container-premium flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-sm bg-foreground text-background flex items-center justify-center font-display font-bold text-lg lg:text-xl">
                G
              </div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="font-display font-semibold text-lg lg:text-xl tracking-tight">GariHub</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">Kenya · Est. 2024</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-all',
                  view === item.key
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <item.icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label}
                {item.key === 'compare' && compareIds.length > 0 && (
                  <span className="ml-0.5 text-[10px] bg-brand text-brand-foreground rounded-full w-4 h-4 inline-flex items-center justify-center font-semibold">{compareIds.length}</span>
                )}
                {view === item.key && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand" />
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => go('favorites')}
              className="relative p-2 rounded-full hover:bg-muted transition group"
              aria-label="Favorites"
            >
              <Heart className={cn('w-5 h-5', favorites.length > 0 && 'fill-foreground text-foreground')} strokeWidth={1.5} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-brand-foreground text-[10px] font-semibold rounded-full w-4 h-4 inline-flex items-center justify-center">{favorites.length}</span>
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" strokeWidth={1.5} /> : <Sun className="w-5 h-5" strokeWidth={1.5} />}
            </button>

            {/* Mobile menu trigger */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-full hover:bg-muted transition" aria-label="Open menu">
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] sm:w-[400px] p-0 border-edge">
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-edge">
                  <SheetTitle className="font-display text-left text-2xl tracking-tight">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col py-2">
                  <button
                    onClick={() => go('home')}
                    className={cn(
                      'flex items-center justify-between px-6 py-4 hover:bg-muted transition text-left border-b border-edge/50',
                      view === 'home' && 'bg-muted',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <LayoutGrid className="w-5 h-5" strokeWidth={1.5} />
                      <span className="font-display text-lg">Home</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => go(item.key)}
                      className={cn(
                        'flex items-center justify-between px-6 py-4 hover:bg-muted transition text-left border-b border-edge/50',
                        view === item.key && 'bg-muted',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" strokeWidth={1.5} />
                        <span className="font-display text-lg">{item.label}</span>
                        {item.key === 'compare' && compareIds.length > 0 && (
                          <span className="text-[10px] bg-brand text-brand-foreground rounded-full w-5 h-5 inline-flex items-center justify-center font-semibold">{compareIds.length}</span>
                        )}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </nav>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="editorial-rule mb-4" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Nairobi · Kenya</p>
                  <p className="text-xs text-muted-foreground">Curated inventory · verified dealers · nationwide delivery.</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}

// Mobile bottom navigation — refined, minimal
export function MobileBottomNav() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const favorites = useAppStore((s) => s.favorites)
  const compareIds = useAppStore((s) => s.compareIds)

  const items: { key: ViewKey; label: string; icon: any; badge?: number }[] = [
    { key: 'home', label: 'Home', icon: LayoutGrid },
    { key: 'browse', label: 'Browse', icon: Search },
    { key: 'compare', label: 'Compare', icon: GitCompare, badge: compareIds.length },
    { key: 'favorites', label: 'Saved', icon: Heart, badge: favorites.length },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-edge pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 h-16">
        {items.map((it) => {
          const active = view === it.key
          return (
            <button
              key={it.key}
              onClick={() => setView(it.key)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <div className="relative">
                <it.icon
                  className={cn('w-5 h-5 transition', active && 'text-brand')}
                  strokeWidth={active ? 2 : 1.5}
                />
                {it.badge ? (
                  <span className="absolute -top-1.5 -right-2 bg-brand text-brand-foreground text-[9px] font-semibold rounded-full min-w-4 h-4 px-1 inline-flex items-center justify-center">{it.badge}</span>
                ) : null}
              </div>
              <span className={cn(active && 'font-semibold')}>{it.label}</span>
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand rounded-full" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
