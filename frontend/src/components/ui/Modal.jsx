"use client";

import { useEffect } from 'react';
import { Button } from './Button';

export function Modal({ open, title, onClose, children, actions }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-600">Modal</p>
            <h3 className="font-heading text-xl font-semibold text-charcoal">{title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog">
            ✕
          </Button>
        </div>
        <div className="space-y-4 text-sm text-slate-700">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-3">{actions}</div>}
      </div>
    </div>
  );
}
