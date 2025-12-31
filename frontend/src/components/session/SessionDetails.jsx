import { Card } from '@/components/ui/Card';
import { SessionStatusBadge } from './SessionStatusBadge';
import { formatDate, formatTime } from '@/lib/utils';

export function SessionDetails({ session }) {
  if (!session) return null;
  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-heading text-lg font-semibold text-charcoal">{session.therapist?.fullName || 'Therapist'}</p>
          <p className="text-sm text-slate-600">{session.user?.fullName || 'You'}</p>
        </div>
        <SessionStatusBadge status={session.status} />
      </div>
      <p className="text-sm text-slate-700">
        {formatDate(session.sessionDate)} at {formatTime(session.sessionDate)} · {session.durationMinutes} mins
      </p>
      {session.meetingLink && (
        <a className="text-sm font-semibold text-primary-700" href={session.meetingLink} target="_blank" rel="noreferrer">
          Join meeting
        </a>
      )}
      {session.notes && <p className="text-sm text-slate-600">{session.notes}</p>}
    </Card>
  );
}
