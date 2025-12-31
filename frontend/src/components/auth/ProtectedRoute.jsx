"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function ProtectedRoute({ children, allowTherapistOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (allowTherapistOnly && user?.userType !== 'therapist') {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router, allowTherapistOnly, user]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Checking access..." />
      </div>
    );
  }

  return children;
}
