'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Filters, ViewKey, ChatMessage } from './types'

interface AppState {
  // Navigation / view state
  view: ViewKey
  setView: (v: ViewKey) => void

  // Filters + sort for browse view
  filters: Filters
  setFilters: (f: Partial<Filters>) => void
  resetFilters: () => void

  // Vehicle detail drawer
  detailSlug: string | null
  openDetail: (slug: string) => void
  closeDetail: () => void

  // Compare tray (vehicle slugs)
  compareIds: string[]
  toggleCompare: (id: string) => void
  clearCompare: () => void

  // Favorites (vehicle ids) — persisted
  favorites: string[]
  toggleFavorite: (id: string) => void

  // Recently viewed (vehicle slugs) — persisted, max 12
  recentlyViewed: string[]
  pushRecent: (slug: string) => void

  // Chat
  chatOpen: boolean
  setChatOpen: (b: boolean) => void
  chatMessages: ChatMessage[]
  addChatMessage: (m: ChatMessage) => void
  resetChat: () => void

  // Admin drawer tab
  adminTab: string
  setAdminTab: (t: string) => void

  // Theme
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  toggleTheme: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: 'home',
      setView: (v) => {
        set({ view: v })
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
      },

      filters: { sort: 'relevance' },
      setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
      resetFilters: () => set({ filters: { sort: 'relevance' } }),

      detailSlug: null,
      openDetail: (slug) => {
        set({ detailSlug: slug })
        get().pushRecent(slug)
      },
      closeDetail: () => set({ detailSlug: null }),

      compareIds: [],
      toggleCompare: (id) => {
        const cur = get().compareIds
        if (cur.includes(id)) {
          set({ compareIds: cur.filter((x) => x !== id) })
        } else if (cur.length < 3) {
          set({ compareIds: [...cur, id] })
        }
      },
      clearCompare: () => set({ compareIds: [] }),

      favorites: [],
      toggleFavorite: (id) => {
        const cur = get().favorites
        if (cur.includes(id)) set({ favorites: cur.filter((x) => x !== id) })
        else set({ favorites: [...cur, id] })
      },

      recentlyViewed: [],
      pushRecent: (slug) => {
        const cur = get().recentlyViewed.filter((s) => s !== slug)
        set({ recentlyViewed: [slug, ...cur].slice(0, 12) })
      },

      chatOpen: false,
      setChatOpen: (b) => set({ chatOpen: b }),
      chatMessages: [
        { role: 'assistant', content: "Habari! I'm Gari, your AI car concierge. Tell me your budget, what you'll use the car for, and any must-haves — I'll match you with the perfect rides from our inventory." },
      ],
      addChatMessage: (m) => set({ chatMessages: [...get().chatMessages, m] }),
      resetChat: () => set({ chatMessages: [{ role: 'assistant', content: "Habari! I'm Gari, your AI car concierge. Tell me your budget, what you'll use the car for, and any must-haves — I'll match you with the perfect rides from our inventory." }] }),

      adminTab: 'overview',
      setAdminTab: (t) => set({ adminTab: t }),

      theme: 'light',
      setTheme: (t) => {
        set({ theme: t })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', t === 'dark')
        }
      },
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        get().setTheme(next)
      },
    }),
    {
      name: 'garihub-ke',
      partialize: (s) => ({
        favorites: s.favorites,
        recentlyViewed: s.recentlyViewed,
        theme: s.theme,
      }),
    },
  ),
)
