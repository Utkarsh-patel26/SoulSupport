"use client";

import { useSessions } from '@/hooks/useSessions';
import { SessionList } from '@/components/session/SessionList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export default function TherapistDashboardPage() {
  const { list } = useSessions({ role: 'therapist' });
  const sessions = list.data?.data?.sessions || list.data?.sessions || [];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-cyan-600 pb-12 pt-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">My Sessions</h1>
          <p className="mt-2 text-white/80">Review and manage your upcoming and past appointments.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 space-y-6">
          {list.isLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner label="Loading sessions..." />
            </div>
          )}
          {list.error && <ErrorMessage message={String(list.error)} />}
          {!list.isLoading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
              <SessionList sessions={sessions} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
