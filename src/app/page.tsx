'use client'

import { useAppStore } from '@/lib/store'
import { Header, MobileBottomNav } from '@/components/site/Header'
import { HeroView, BrowseView, FavoritesView, CompareView, SellView, FinanceView, DealersView, ArticlesView, RecentlyViewedTray } from '@/components/site/Views'
import { VehicleDetailDrawer } from '@/components/site/VehicleDetailDrawer'
import { ConciergeWidget } from '@/components/site/ConciergeWidget'
import { CompareTray } from '@/components/site/CompareTray'
import { AdminView } from '@/components/site/AdminView'

export default function Home() {
  const view = useAppStore((s) => s.view)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-24 lg:pb-0">
        {view === 'home' && (
          <>
            <HeroView />
            <RecentlyViewedTray />
          </>
        )}
        {view === 'browse' && <BrowseView />}
        {view === 'favorites' && <FavoritesView />}
        {view === 'compare' && <CompareView />}
        {view === 'sell' && <SellView />}
        {view === 'finance' && <FinanceView />}
        {view === 'dealers' && <DealersView />}
        {view === 'articles' && <ArticlesView />}
        {view === 'concierge' && (
          <div className="container-premium py-12 text-center">
            <h1 className="font-display text-3xl font-bold">Gari AI Concierge</h1>
            <p className="text-muted-foreground mt-2">Tap the Ask Gari button to start chatting with your personal car expert.</p>
          </div>
        )}
        {view === 'admin' && <AdminView />}
      </main>

      {/* Footer (sticky bottom on short content, natural push on long) */}
      <Footer />

      {/* Floating overlays */}
      <VehicleDetailDrawer />
      <ConciergeWidget />
      <CompareTray />
      <MobileBottomNav />
    </div>
  )
}

function Footer() {
  const setView = useAppStore((s) => s.setView)
  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="container-premium py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-background text-foreground flex items-center justify-center font-display font-bold">G</div>
              <div className="leading-none">
                <p className="font-display font-bold text-lg">GariHub</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-background/60">Kenya</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-background/70 max-w-xs">
              Kenya's premium vehicle marketplace. Curated inventory, verified dealers, AI-powered buying.
            </p>
            <div className="mt-4 flex gap-2">
              {['M-Pesa', 'Stripe', 'Visa', 'Mastercard'].map((p) => (
                <span key={p} className="text-[10px] bg-background/10 px-2 py-1 rounded">{p}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-3">Browse</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><button onClick={() => setView('browse')} className="hover:text-background">All vehicles</button></li>
              <li><button onClick={() => setView('dealers')} className="hover:text-background">Dealers</button></li>
              <li><button onClick={() => setView('articles')} className="hover:text-background">Guides</button></li>
              <li><button onClick={() => setView('finance')} className="hover:text-background">Finance</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-3">Sell</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><button onClick={() => setView('sell')} className="hover:text-background">List your car</button></li>
              <li><button onClick={() => setView('concierge')} className="hover:text-background">AI valuation</button></li>
              <li><button onClick={() => setView('admin')} className="hover:text-background">Dealer portal</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><button onClick={() => setView('admin')} className="hover:text-background">Admin dashboard</button></li>
              <li><a href="#" className="hover:text-background">About us</a></li>
              <li><a href="#" className="hover:text-background">Contact</a></li>
              <li><a href="#" className="hover:text-background">Terms · Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-background/50">
          <p>© 2024 GariHub KE · Nairobi, Kenya · Built with care.</p>
          <p>Made for Kenyan drivers · Powered by AI</p>
        </div>
      </div>
    </footer>
  )
}
