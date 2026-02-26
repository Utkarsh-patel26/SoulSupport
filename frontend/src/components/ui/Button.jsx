"use client";

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  variants: {
    variant: {
      primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-md hover:shadow-lg transition-all',
      secondary: 'bg-gray-200 text-charcoal hover:bg-gray-300 focus:ring-gray-400 shadow-sm transition-all',
      outline: 'border-2 border-primary text-primary hover:bg-primary-soft focus:ring-primary',
      ghost: 'text-charcoal hover:bg-gray-100 transition-colors',
      danger: 'bg-coral text-white hover:bg-coral-600 focus:ring-coral shadow-md hover:shadow-lg transition-all',
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
