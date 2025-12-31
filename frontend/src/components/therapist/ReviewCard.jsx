import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';

export function ReviewCard({ review }) {
  return (
    <Card className="space-y-2">
      <div className="flex items-center gap-3">
        <Avatar name={review.reviewer?.fullName || 'User'} size={40} />
        <div>
          <p className="text-sm font-semibold text-charcoal">{review.reviewer?.fullName || 'User'}</p>
          <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
        </div>
        <div className="ml-auto rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          {review.rating}/5
        </div>
      </div>
      <p className="text-sm text-slate-700">{review.reviewText}</p>
    </Card>
  );
}
