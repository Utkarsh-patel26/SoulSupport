'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSessions } from '@/hooks/useSessions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Link from 'next/link';
import { Calendar, MessageSquare, User, TrendingUp } from 'lucide-react';

export default function DashboardContent() {
  const { user } = useAuth();
  const { list: sessions } = useSessions();

  const sessionList = sessions.data?.data?.sessions || [];
  const upcomingSessions = sessionList.filter((s) => new Date(s.scheduledFor) > new Date()).length;
  const completedSessions = sessionList.filter((s) => s.status === 'completed').length;

  return (
    <div className="min-h-screen bg-white text-charcoal">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1F4E5F] to-[#2A6070] pb-14 pt-16 text-white">
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
              color: 'from-primary-soft to-soft-blue-50',
              iconColor: 'text-primary',
            }, {
              label: 'Completed',
              value: completedSessions,
              Icon: TrendingUp,
              color: 'from-sage-50 to-sage-100',
              iconColor: 'text-sage',
            }, {
              label: 'Forum Posts',
              value: 8,
              Icon: MessageSquare,
              color: 'from-soft-blue-50 to-lavender-50',
              iconColor: 'text-soft-blue',
            }, {
              label: 'Therapists',
              value: 2,
              Icon: User,
              color: 'from-coral-50 to-coral-100',
              iconColor: 'text-coral',
            }].map((item) => (
              <Card key={item.label} className="p-6 shadow-sm ring-1 ring-border">
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl bg-gradient-to-br ${item.color} p-3`}>
                    <item.Icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8 p-8 shadow-sm ring-1 ring-border">
            <h2 className="mb-6 text-2xl font-bold text-charcoal">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/therapists" prefetch={true}>
                <Button variant="outline" className="w-full">
                  Find a Therapist
                </Button>
              </Link>
              <Link href="/forum" prefetch={true}>
                <Button variant="outline" className="w-full">
                  Visit Forum
                </Button>
              </Link>
              <Link href="/resources" prefetch={true}>
                <Button variant="outline" className="w-full">
                  Browse Resources
                </Button>
              </Link>
            </div>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="p-8 shadow-sm ring-1 ring-border">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-charcoal">Upcoming Sessions</h2>
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
                <p className="mb-4 text-gray-600">No upcoming sessions</p>
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
                    <div key={session._id} className="flex items-center justify-between border-t border-gray-100 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          Session with {session.therapistId?.user?.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
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
