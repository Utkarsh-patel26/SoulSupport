"use client";

import { useState } from 'react';
import { useTherapists } from '@/hooks/useTherapists';
import { TherapistFilter } from '@/components/therapist/TherapistFilter';
import { TherapistGrid } from '@/components/therapist/TherapistGrid';
import { BookingModal } from '@/components/therapist/BookingModal';
import { useSessionMutations } from '@/hooks/useSessions';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import toast from 'react-hot-toast';

const HERO_STATS = [
  { label: 'Licensed Therapists', value: '100+' },
  { label: 'Average Rating', value: '4.9★' },
  { label: 'Sessions Completed', value: '3L+' },
];

export default function TherapistsPage() {
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);
  const { list } = useTherapists(filters);
  const { createSession } = useSessionMutations();

  const therapists = list.data?.data?.therapists || list.data?.therapists || [];

  const keyword = (filters.q || '').toLowerCase().trim();
  const specialization = filters.specialization && filters.specialization !== 'all' ? filters.specialization : null;

  const filtered = therapists.filter((t) => {
    const name = (t.fullName || t.user?.fullName || '').toLowerCase();
    const bio = (t.bio || t.user?.bio || '').toLowerCase();
    const tags = (t.tags || t.specializations || []).map((x) => (x || '').toLowerCase());
    const matchesKeyword = !keyword || name.includes(keyword) || bio.includes(keyword) || tags.some((x) => x.includes(keyword));
    const matchesSpec = !specialization || tags.includes(specialization.toLowerCase());
    return matchesKeyword && matchesSpec;
  });

  const handleBook = async (payload) => {
    await createSession.mutateAsync(payload);
    toast.success('Session requested');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      {/* Hero */}
      <AnimatedSection className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 pb-16 pt-20 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm dark:bg-teal-900 dark:text-teal-100">
                <span className="text-base">🧑‍⚕️</span>
                <span>Therapist Network</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Find the right match <span className="text-teal-600 dark:text-teal-400">for you</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Filter by specialization, style, and experience. Book a secure session in minutes.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Filters & Results */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-8">
          <AnimatedSection className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
            <TherapistFilter onFilter={setFilters} />
          </AnimatedSection>

          {list.isLoading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <LoadingSpinner label="Loading therapists..." />
            </div>
          )}

          {list.error && <ErrorMessage message={String(list.error)} />}

          {!list.isLoading && filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">No therapists found</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Try adjusting your filters or check back later.</p>
            </div>
          )}

          {!list.isLoading && filtered.length > 0 && (
            <AnimatedSection className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
              <TherapistGrid therapists={filtered} onBook={setSelected} />
            </AnimatedSection>
          )}
        </div>
      </section>

      <BookingModal
        open={!!selected}
        therapist={selected}
        onClose={() => setSelected(null)}
        onBook={handleBook}
      />
    </div>
  );
}
