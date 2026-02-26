"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" prefetch={true} className="flex items-center gap-2 font-heading text-2xl font-bold text-primary">
            <span>🧠</span>
            <span>SoulSupport</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-charcoal md:flex">
          <Link href="/resources" prefetch={true} className="hover:text-primary transition-colors">
            Resources
          </Link>
          <Link href="/forum" prefetch={true} className="hover:text-primary transition-colors">
            Forum
          </Link>
          <Link href="/therapists" prefetch={true} className="hover:text-primary transition-colors">
            Therapists
          </Link>
          <Link href="/about" prefetch={true} className="hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href={user?.userType === 'therapist' ? '/therapist-dashboard' : '/dashboard'} prefetch={true}>
                <Avatar name={user?.fullName || user?.email || 'User'} size={36} />
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" prefetch={true} className="text-sm font-semibold text-charcoal hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/register" prefetch={true}>
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
