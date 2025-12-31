import Link from 'next/link';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/sessions', label: 'Sessions' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function Sidebar({ active }) {
  return (
    <aside className="sticky top-24 h-fit rounded-xl border border-gray-100 bg-white p-4 shadow-soft">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">User</p>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-primary-700',
              active === link.href && 'bg-primary-50 text-primary-700'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
