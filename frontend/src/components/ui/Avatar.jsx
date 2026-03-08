import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getDefaultAvatarPath } from '@/lib/avatar';

export function Avatar({ src, name = '', className, size = 40 }) {
  const fallbackSrc = getDefaultAvatarPath(name);
  const resolvedSrc = src || fallbackSrc;

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary ring-2 ring-surface shadow-sm transition-transform hover:scale-105',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image src={resolvedSrc} alt={name || 'avatar'} width={size} height={size} className="object-cover h-full w-full" />
    </div>
  );
}
