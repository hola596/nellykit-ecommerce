'use client';

import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 max-w-[90vw] px-4 py-2.5 rounded-full bg-white/95 dark:bg-carbon/95 backdrop-blur-md border border-copper/50 text-stone-900 dark:text-white text-xs font-semibold shadow-luxury-light dark:shadow-luxury flex items-center gap-2 animate-fade-in"
    >
      <CheckCircle2 className="w-4 h-4 text-copper flex-shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
}
