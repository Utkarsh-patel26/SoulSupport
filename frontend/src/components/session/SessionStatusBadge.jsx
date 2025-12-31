import { Badge } from '@/components/ui/Badge';

const toneMap = {
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  cancelled: 'danger',
};

export function SessionStatusBadge({ status }) {
  return <Badge tone={toneMap[status] || 'neutral'} className="capitalize">{status}</Badge>;
}
