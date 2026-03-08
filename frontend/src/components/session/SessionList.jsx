'use client';

import { EmptyState } from '@/components/common/EmptyState';
import { SessionCard } from './SessionCard';

export function SessionList({ sessions = [], onUpdate, onCancel }) {
  if (!sessions.length) {
    return <EmptyState title="No sessions scheduled yet." description="Book your first session to see it here." />;
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <SessionCard key={session._id} session={session} onUpdate={onUpdate} onCancel={onCancel} />
      ))}
    </div>
  );
}
