"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/context/ThemeContext';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold text-teal-600 dark:text-teal-400">
            <span>🧠</span>
            <span>SoulSupport</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-gray-700 dark:text-gray-300 md:flex">
          <Link href="/resources" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Resources
          </Link>
          <Link href="/forum" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Forum
          </Link>
          <Link href="/therapists" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Therapists
          </Link>
          <Link href="/about" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="rounded-lg p-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            <span suppressHydrationWarning>
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </button>
          {isAuthenticated ? (
            <>
              <Link href={user?.userType === 'therapist' ? '/therapist-dashboard' : '/dashboard'}>
                <Avatar name={user?.fullName || user?.email || 'User'} size={36} />
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
