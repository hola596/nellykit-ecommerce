'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BRAND_INFO } from '../data/catalog';

export default function LoadingTransition({ onComplete, selectedMode }) {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 180);
    const timer2 = setTimeout(() => setProgress(85), 450);
    const timer3 = setTimeout(() => setProgress(100), 750);
    const timerDone = setTimeout(() => {
      if (onComplete) onComplete();
    }, 950);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerDone);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian text-white p-6 animate-fade-in">
      {/* Background radial glow */}
      <div className="absolute w-72 h-72 bg-copper/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
        {/* Brand Logo */}
        <div className="relative w-44 h-16 mb-4 animate-scale-in">
          <Image
            src={BRAND_INFO.logoDark}
            alt={BRAND_INFO.name}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Welcome cartel badge */}
        <div className="px-4 py-1.5 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-bold tracking-widest uppercase mb-4 shadow-glow-red animate-pulse">
          ¡Bienvenidos!
        </div>

        <p className="text-sm font-medium text-bone mb-6">
          {selectedMode === 'wholesale'
            ? 'Cargando catálogo con precios por mayor y souvenirs...'
            : 'Cargando catálogo artesanal con precios por menor...'}
        </p>

        {/* Loading progress bar */}
        <div className="w-56 h-1.5 rounded-full bg-graphite overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-copper via-brand-red to-copper rounded-full transition-all duration-300 ease-out shadow-glow-copper"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] text-ash tracking-widest mt-2 uppercase">
          {progress}%
        </span>
      </div>
    </div>
  );
}
