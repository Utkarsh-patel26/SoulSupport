"use client";

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-[240px,1fr]">
        <Sidebar />
        <div className="space-y-6">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
