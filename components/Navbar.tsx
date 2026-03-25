'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import NotificationBell from './notifications/NotificationBell';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/vehicles/map', label: 'Map' },
  { href: '/sell', label: 'Sell' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch('/api/favorites');
          const data = await res.json();
          setFavoritesCount(data.length || 0);
        } catch (err) { /* ignore */ }
      } else {
        const local = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavoritesCount(local.length);
      }
    };
    const fetchUnread = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch('/api/messages?unread=true');
          const data = await res.json();
          setUnreadCount(data.length || 0);
        } catch (err) { /* ignore */ }
      }
    };
    fetchFavorites();
    fetchUnread();
  }, [session]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">GariHub</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-gray-700 hover:text-primary-600 transition-colors',
                  pathname === link.href && 'text-primary-600 font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {status === 'loading' ? (
              <span className="text-gray-400">Loading...</span>
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard/messages" className="relative text-gray-700 hover:text-primary-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/dashboard/favorites" className="relative text-gray-700 hover:text-primary-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
                <NotificationBell />
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {session && (
              <Link href="/dashboard" className="mr-4 text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'text-gray-700 hover:text-primary-600 transition-colors px-2 py-1',
                    pathname === link.href && 'text-primary-600 font-medium'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              {session ? (
                <>
                  <Link
                    href="/dashboard/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-2 py-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Favorites ({favoritesCount})
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 transition-colors px-2 py-1"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700 transition-colors px-2 py-1"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary-600 font-medium px-2 py-1"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
