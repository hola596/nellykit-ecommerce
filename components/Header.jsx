'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sun, Moon, MessageCircle, RefreshCw } from 'lucide-react';
import { BRAND_INFO } from '../data/catalog';

export default function Header({
  mode = 'retail',
  onToggleMode,
  onOpenWelcome,
}) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nellykit-theme');
      if (saved === 'light') {
        setIsDark(false);
      } else {
        setIsDark(true);
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    try {
      if (nextDark) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('nellykit-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('nellykit-theme', 'light');
      }
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-stone-950/90 dark:bg-obsidian/90 backdrop-blur-md border-b border-stone-800/80 dark:border-graphite px-3 sm:px-6 flex items-center justify-between transition-colors">
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        {/* Logo & Welcome Back button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWelcome}
            className="flex items-center gap-2 text-left group focus:outline-none"
            title="Volver a la pantalla de bienvenida"
            aria-label="Volver a la pantalla de bienvenida de NellyKit"
          >
            <div className="relative w-28 h-9">
              <Image
                src={BRAND_INFO.logoDark}
                alt={BRAND_INFO.name}
                fill
                className="object-contain dark:block hidden"
                priority
              />
              <Image
                src={BRAND_INFO.logoLight}
                alt={BRAND_INFO.name}
                fill
                className="object-contain dark:hidden block"
                priority
              />
            </div>
          </button>
        </div>

        {/* Center Mode Switcher (Minorista vs Mayorista) */}
        <div className="flex items-center p-0.5 rounded-full bg-stone-900 dark:bg-carbon border border-stone-800 dark:border-graphite shadow-inner">
          <button
            onClick={() => onToggleMode('retail')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              mode === 'retail'
                ? 'bg-copper text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
            aria-pressed={mode === 'retail'}
          >
            Por Menor
          </button>
          <button
            onClick={() => onToggleMode('wholesale')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              mode === 'wholesale'
                ? 'bg-brand-red text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
            aria-pressed={mode === 'wholesale'}
          >
            Por Mayor
          </button>
        </div>

        {/* Right Actions: Theme Toggle & WhatsApp */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-stone-900 dark:bg-carbon border border-stone-800 dark:border-graphite text-stone-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-copper" />
            )}
          </button>

          {/* Quick WhatsApp Contact */}
          <a
            href={`https://wa.me/${BRAND_INFO.whatsappNumberOnly}?text=${encodeURIComponent(
              '¡Hola Nelly! Estoy viendo tu tienda online y quería hacerte una consulta.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center transition-all hover:scale-105"
            aria-label="Contactar a Nelly por WhatsApp"
            title="Chat directo por WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-400/20 text-emerald-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
