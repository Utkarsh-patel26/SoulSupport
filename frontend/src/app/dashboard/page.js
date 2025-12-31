"use client";

import { useAuth } from '@/hooks/useAuth';
import { useSessions } from '@/hooks/useSessions';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Link from 'next/link';
import { Calendar, MessageSquare, User, TrendingUp } from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  const { list: sessions } = useSessions();

  const sessionList = sessions.data?.data?.sessions || [];
  const upcomingSessions = sessionList.filter((s) => new Date(s.scheduledFor) > new Date()).length;
  const completedSessions = sessionList.filter((s) => s.status === 'completed').length;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-cyan-600 pb-14 pt-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold sm:text-5xl">Welcome back, {user?.fullName}!</h1>
          <p className="mt-3 text-white/80">Track your progress and manage your therapy journey</p>
        </div>
      </section>

      <section className="pb-16 pt-6">
        <div className="container mx-auto px-4">
          {/* Quick Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            {[{
              label: 'Upcoming',
              value: upcomingSessions,
              Icon: Calendar,
              color: 'from-teal-100 to-cyan-100',
              iconColor: 'text-teal-600',
            }, {
              label: 'Completed',
              value: completedSessions,
              Icon: TrendingUp,
              color: 'from-emerald-100 to-teal-100',
              iconColor: 'text-emerald-600',
            }, {
              label: 'Forum Posts',
              value: 8,
              Icon: MessageSquare,
              color: 'from-indigo-100 to-blue-100',
              iconColor: 'text-indigo-600',
            }, {
              label: 'Therapists',
              value: 2,
              Icon: User,
              color: 'from-amber-100 to-orange-100',
              iconColor: 'text-amber-600',
            }].map((item) => (
              <Card key={item.label} className="p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl bg-gradient-to-br ${item.color} p-3 dark:bg-white/5`}>
                    <item.Icon className={`h-6 w-6 ${item.iconColor} dark:text-white`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8 p-8 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/therapists">
                <Button variant="outline" className="w-full">
                  Find a Therapist
                </Button>
              </Link>
              <Link href="/forum">
                <Button variant="outline" className="w-full">
                  Visit Forum
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" className="w-full">
                  Browse Resources
                </Button>
              </Link>
            </div>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="p-8 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Sessions</h2>
              <Link href="/dashboard/sessions">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {sessions.isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="sm" />
              </div>
            ) : upcomingSessions === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-gray-600 dark:text-gray-400">No upcoming sessions</p>
                <Link href="/therapists">
                  <Button>Schedule a session</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {sessionList
                  .filter((s) => new Date(s.scheduledFor) > new Date())
                  .slice(0, 3)
                  .map((session) => (
                    <div key={session._id} className="flex items-center justify-between border-t border-gray-100 py-3 dark:border-gray-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Session with {session.therapistId?.user?.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.scheduledFor).toLocaleDateString()} at{' '}
                          {new Date(session.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
