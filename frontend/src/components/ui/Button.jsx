"use client";

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  variants: {
    variant: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg transition-all',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 shadow-sm transition-all',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-charcoal hover:bg-gray-100 transition-colors',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg transition-all',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    },
  },
  defaults: {
    variant: 'primary',
    size: 'md',
  },
};

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, children, disabled, ...props },
  ref
) {
  const variantClass = buttonVariants.variants.variant[variant];
  const sizeClass = buttonVariants.variants.size[size];

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClass,
        sizeClass,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});
