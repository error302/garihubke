'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { openWhatsApp } from '@/lib/whatsapp'

/**
 * Floating WhatsApp button — appears site-wide after the user scrolls 200px.
 * On mobile it sits above the bottom nav; on desktop it's bottom-right.
 * Clicking opens WhatsApp with a general inquiry prefilled message.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)
  const [showLabel, setShowLabel] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-expand label after 3s of visibility (desktop only)
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setShowLabel(true), 3000)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-30 bottom-20 lg:bottom-6 right-4 sm:right-6"
        >
          <button
            onClick={() => openWhatsApp({})}
            onMouseEnter={() => setShowLabel(true)}
            onMouseLeave={() => setShowLabel(false)}
            className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#1eb858] text-white rounded-full shadow-lg shadow-[#25D366]/30 transition-all"
            aria-label="Chat on WhatsApp"
          >
            {/* Pulse ring */}
            <span className="absolute right-0 top-0 w-12 h-12 rounded-full bg-[#25D366] animate-ping opacity-20" />

            <span className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-white" strokeWidth={1.5} />
            </span>

            <AnimatePresence>
              {showLabel && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden whitespace-nowrap pr-4 text-sm font-medium hidden lg:inline"
                >
                  Chat with us
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
