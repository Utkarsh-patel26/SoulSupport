"use client";

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-charcoal shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200',
        className
      )}
      {...props}
    />
  );
});
