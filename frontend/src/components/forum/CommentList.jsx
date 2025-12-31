import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export function CommentList({ comments = [], onDelete }) {
  if (!comments.length) return <p className="text-sm text-slate-500">No comments yet.</p>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={comment.author?.name || 'Anon'} src={comment.author?.avatarUrl} size={36} />
              <div>
                <p className="text-sm font-semibold text-charcoal">{comment.author?.name || 'Anonymous'}</p>
                <p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
            {onDelete && (
              <Button size="sm" variant="ghost" onClick={() => onDelete(comment._id)}>
                Delete
              </Button>
            )}
          </div>
          <p className="mt-2 text-slate-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
