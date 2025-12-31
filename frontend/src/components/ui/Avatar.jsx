import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Avatar({ src, name = '', className, size = 40 }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700 ring-2 ring-white shadow-soft',
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={name || 'avatar'} width={size} height={size} className="object-cover" />
      ) : (
        <span className="text-sm font-semibold">{initials || 'SS'}</span>
      )}
    </div>
  );
}
