"use client";

import { useAuth } from '@/hooks/useAuth';
import { useSessions } from '@/hooks/useSessions';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import Link from 'next/link';
import api from '@/lib/api';

function TherapistDashboardContent() {
  const { user } = useAuth();
  const { list } = useSessions({ role: 'therapist' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    pending: 0,
    revenue: 0
  });

  const sessions = list.data?.data?.sessions || list.data?.sessions || [];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/therapists/profile');
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userType === 'therapist') {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (sessions.length > 0) {
      const now = new Date();
      const upcoming = sessions.filter(s => 
        s.status === 'confirmed' && new Date(s.scheduledFor) > now
      ).length;
      const completed = sessions.filter(s => s.status === 'completed').length;
      const pending = sessions.filter(s => s.status === 'pending').length;
      const revenue = completed * (profile?.hourlyRate || 0);

      setStats({ upcoming, completed, pending, revenue });
    }
  }, [sessions, profile]);

  if (loading || list.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Therapist Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user?.fullName}
              </p>
            </div>
            <Link 
              href="/therapist-dashboard/profile"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.upcoming}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  ${stats.revenue}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        {profile && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Specializations</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.specializations?.length > 0 ? (
                    profile.specializations.map((spec) => (
                      <span key={spec} className="px-2 py-1 bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 text-xs rounded">
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-500">Not set</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hourly Rate</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  ${profile.hourlyRate || 0}/hour
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                <div className="flex items-center mt-1">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white mr-2">
                    {profile.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    ({profile.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Sessions
            </h2>
          </div>
          <div className="p-6">
            {list.error && <ErrorMessage message={String(list.error)} />}
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No sessions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.slice(0, 10).map((session) => (
                  <div key={session._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {session.userId?.fullName || 'Unknown Client'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(session.scheduledFor).toLocaleDateString()} at{' '}
                        {new Date(session.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        session.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        session.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {session.status}
                      </span>
                      <Link 
                        href={`/therapist-dashboard/sessions/${session._id}`}
                        className="text-teal-600 hover:text-teal-700 dark:text-teal-400 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TherapistDashboardPage() {
  return (
    <ProtectedRoute requiredRole="therapist">
      <TherapistDashboardContent />
    </ProtectedRoute>
  );
}
