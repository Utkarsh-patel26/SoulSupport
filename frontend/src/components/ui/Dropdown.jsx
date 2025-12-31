"use client";

import { cn } from '@/lib/utils';

export function Dropdown({ label, options = [], value, onChange, className }) {
  return (
    <label className={cn('flex flex-col gap-1 text-sm text-slate-700', className)}>
      {label && <span className="font-medium text-charcoal">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </label>
  );
}
