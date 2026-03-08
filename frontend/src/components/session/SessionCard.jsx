'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SessionStatusBadge } from './SessionStatusBadge';
import { formatDate, formatTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function SessionCard({ session, onUpdate, onCancel }) {
  const { user } = useAuth();
  const date = formatDate(session.sessionDate);
  const time = formatTime(session.sessionDate);
  const isTherapist = user?.userType === 'therapist';
  
  // Show therapist name for users, user name for therapists
  const displayName = user?.userType === 'therapist' 
    ? session.user?.name || 'User'
    : session.therapist?.name || 'Therapist';
  
  return (
    <Card className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-heading text-lg font-semibold text-charcoal">{displayName}</p>
        <p className="text-sm text-slate-600">
          {date} at {time} · {session.durationMinutes || 60} mins
        </p>
        <p className="text-xs text-slate-500">
          {session.meetingLink ? 'Meeting link available' : 'Meeting link to be shared'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <SessionStatusBadge status={session.status} />
        {session.status === 'confirmed' && (
          <Link href={`/session/${session._id}`}>
            <Button size="sm">Join Meeting</Button>
          </Link>
        )}
        {onUpdate && session.status === 'pending' && isTherapist && (
          <Button variant="secondary" size="sm" onClick={() => onUpdate(session._id)}>
            Confirm
          </Button>
        )}
        {onCancel && ['pending', 'confirmed'].includes(session.status) && (
          <Button variant="ghost" size="sm" onClick={() => onCancel(session._id)}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}
