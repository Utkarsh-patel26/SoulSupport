'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4 text-gray-900 dark:from-gray-950 dark:to-gray-900 dark:text-gray-50">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-2 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm ring-1 ring-white/60 dark:bg-white/10 dark:text-teal-100 dark:ring-white/10">
            <span className="text-base">🔐</span>
            <span>Secure Sign-In</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Welcome back to <span className="text-teal-600 dark:text-teal-400">SoulSupport</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Access your sessions, resources, and community in one place.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• Encrypted authentication for your privacy</li>
            <li>• Quick access to therapists and forums</li>
            <li>• Save progress across devices</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300">create a new account</Link>
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-teal-500 dark:focus:ring-teal-700/50"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-teal-500 dark:focus:ring-teal-700/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300">
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 dark:focus:ring-offset-gray-900"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
