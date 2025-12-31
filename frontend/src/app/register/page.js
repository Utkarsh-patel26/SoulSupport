'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'user',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4 text-gray-900 dark:from-gray-950 dark:to-gray-900 dark:text-gray-50">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-2 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm ring-1 ring-white/60 dark:bg-white/10 dark:text-teal-100 dark:ring-white/10">
            <span className="text-base">🌱</span>
            <span>Start your journey</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Create your <span className="text-teal-600 dark:text-teal-400">SoulSupport</span> account
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Join our community, book therapists, and unlock resources curated by experts.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• Choose your role: seeker or therapist</li>
            <li>• Access forums, sessions, and tools</li>
            <li>• Secure data and privacy-first design</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300">
                Sign in
              </Link>
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-teal-500 dark:focus:ring-teal-700/50"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-teal-500 dark:focus:ring-teal-700/50"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-teal-500 dark:focus:ring-teal-700/50"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="userType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  I am a
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-teal-500 dark:focus:ring-teal-700/50"
                >
                  <option value="user">User (seeking therapy)</option>
                  <option value="therapist">Therapist (providing therapy)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio (optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-teal-500 dark:focus:ring-teal-700/50"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 dark:focus:ring-offset-gray-900"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
