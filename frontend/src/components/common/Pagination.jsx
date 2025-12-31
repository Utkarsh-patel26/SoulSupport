import { Button } from '@/components/ui/Button';

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mt-6 flex items-center justify-between">
      <Button variant="secondary" size="sm" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" size="sm" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
