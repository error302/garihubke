'use client'

import { useAppStore } from '@/lib/store'
import { Header, MobileBottomNav } from '@/components/site/Header'
import { HeroView, BrowseView, FavoritesView, CompareView, SellView, FinanceView, DealersView, ArticlesView, RecentlyViewedTray } from '@/components/site/Views'
import { VehicleDetailDrawer } from '@/components/site/VehicleDetailDrawer'
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
        {view === 'admin' && <AdminView />}
      </main>

      <Footer />

      {/* Floating overlays */}
      <VehicleDetailDrawer />
      <CompareTray />
      <MobileBottomNav />
    </div>
  )
}

function Footer() {
  const setView = useAppStore((s) => s.setView)
  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="container-premium py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 bg-background text-foreground flex items-center justify-center font-display font-bold text-xl">G</div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand" />
              </div>
              <div className="leading-none">
                <p className="font-display font-medium text-xl">GariHub</p>
                <p className="text-[9px] uppercase tracking-[0.3em] text-background/50 mt-0.5">Kenya · Est. 2024</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-background/70 max-w-xs font-light leading-relaxed">
              A curated marketplace for Kenya's finest vehicles. Verified dealers, refined search, M-Pesa finance.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['M-Pesa', 'Stripe', 'Visa', 'Mastercard'].map((p) => (
                <span key={p} className="text-[10px] bg-background/10 px-2.5 py-1 uppercase tracking-wider">{p}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-medium text-sm mb-4">Browse</h4>
            <ul className="space-y-2.5 text-sm text-background/70 font-light">
              <li><button onClick={() => setView('browse')} className="hover:text-background">All vehicles</button></li>
              <li><button onClick={() => setView('dealers')} className="hover:text-background">Dealers</button></li>
              <li><button onClick={() => setView('articles')} className="hover:text-background">Journal</button></li>
              <li><button onClick={() => setView('finance')} className="hover:text-background">Finance</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-medium text-sm mb-4">Sell</h4>
            <ul className="space-y-2.5 text-sm text-background/70 font-light">
              <li><button onClick={() => setView('sell')} className="hover:text-background">List your car</button></li>
              <li><button onClick={() => setView('admin')} className="hover:text-background">Dealer portal</button></li>
              <li><a href="#" className="hover:text-background">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-medium text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-background/70 font-light">
              <li><button onClick={() => setView('admin')} className="hover:text-background">Admin</button></li>
              <li><a href="#" className="hover:text-background">About</a></li>
              <li><a href="#" className="hover:text-background">Contact</a></li>
              <li><a href="#" className="hover:text-background">Terms · Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-background/50">
          <p>© 2024 GariHub KE · Nairobi, Kenya</p>
          <p className="uppercase tracking-[0.2em]">Curated for Kenyan drivers</p>
        </div>
      </div>
    </footer>
  )
}
