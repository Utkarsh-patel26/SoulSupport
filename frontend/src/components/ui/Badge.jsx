import { cn } from '@/lib/utils';

const tones = {
  neutral: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-primary-100 text-primary-700',
  warning: 'bg-amber-100 text-amber-700',
};

export function Badge({ tone = 'neutral', children, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', tones[tone], className)}>
      {children}
    </span>
  );
}
