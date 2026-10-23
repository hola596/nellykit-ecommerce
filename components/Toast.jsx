'use client';

import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-stone-900/95 dark:bg-carbon/95 backdrop-blur-md border border-copper/50 text-white text-xs font-semibold shadow-luxury flex items-center gap-2 animate-fade-in"
    >
      <CheckCircle2 className="w-4 h-4 text-copper" />
      <span>{message}</span>
    </div>
  );
}
