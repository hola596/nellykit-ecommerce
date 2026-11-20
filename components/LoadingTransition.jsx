'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BRAND_INFO } from '../data/catalog';

export default function LoadingTransition({ onComplete, selectedMode }) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 120);
    const timer2 = setTimeout(() => setProgress(85), 340);
    const timer3 = setTimeout(() => setProgress(100), 560);
    const timerDone = setTimeout(() => {
      if (onComplete) onComplete();
    }, 720);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerDone);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf9f6] text-stone-900 dark:bg-obsidian dark:text-white p-6 animate-fade-in">
      {/* Background radial glow */}
      <div className="absolute w-80 h-80 bg-copper/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
        {/* Protagonist Brand Logo */}
        <div className="relative w-64 h-36 mb-4 animate-scale-in flex items-center justify-center">
          <div className="absolute inset-4 rounded-full bg-copper/15 dark:bg-copper/20 blur-2xl pointer-events-none" />
          <Image
            src={BRAND_INFO.logoDark}
            alt={BRAND_INFO.name}
            fill
            sizes="256px"
            className="object-contain dark:block hidden drop-shadow-[0_8px_24px_rgba(204,145,102,0.28)]"
            priority
          />
          <Image
            src={BRAND_INFO.logoLight}
            alt={BRAND_INFO.name}
            fill
            sizes="256px"
            className="object-contain dark:hidden block drop-shadow-sm"
            priority
          />
        </div>

        {/* Welcome cartel badge */}
        <div className="px-4 py-1.5 rounded-full bg-brand-red/15 border border-brand-red/40 text-brand-red text-xs font-bold tracking-widest uppercase mb-4 shadow-glow-red animate-pulse">
          ¡Bienvenidos!
        </div>

        <p className="text-sm font-medium text-stone-700 dark:text-bone mb-6">
          {selectedMode === 'wholesale'
            ? 'Cargando catálogo con precios por mayor y souvenirs...'
            : 'Cargando catálogo artesanal con precios por menor...'}
        </p>

        {/* Loading progress bar */}
        <div className="w-56 h-1.5 rounded-full bg-stone-200 dark:bg-graphite overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-copper via-brand-red to-copper rounded-full transition-all duration-200 ease-out shadow-glow-copper"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] text-stone-500 dark:text-ash tracking-widest mt-2 uppercase font-mono">
          {progress}%
        </span>
      </div>
    </div>
  );
}
