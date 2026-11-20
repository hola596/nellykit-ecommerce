'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sun, Moon, MessageCircle } from 'lucide-react';
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
      setIsDark(saved !== 'light');
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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-obsidian/95 backdrop-blur-md border-b border-stone-200 dark:border-graphite safe-top transition-colors shadow-sm dark:shadow-none">
      <div className="max-w-4xl w-full mx-auto px-3 sm:px-6">
        {/* Top Row: Protagonist Logo + Desktop Switcher + Touch Actions */}
        <div className="h-16 sm:h-[76px] flex items-center justify-between gap-2">
          {/* Logo & Welcome Back button */}
          <button
            onClick={onOpenWelcome}
            className="flex items-center text-left group focus:outline-none active:scale-95 transition-transform"
            title="Volver a la pantalla de bienvenida"
            aria-label="Volver a la pantalla de bienvenida de NellyKit"
          >
            <div className="relative w-36 h-11 sm:w-44 sm:h-14">
              <Image
                src={BRAND_INFO.logoDark}
                alt={BRAND_INFO.name}
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left dark:block hidden drop-shadow-[0_2px_10px_rgba(204,145,102,0.22)]"
                priority
              />
              <Image
                src={BRAND_INFO.logoLight}
                alt={BRAND_INFO.name}
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left dark:hidden block"
                priority
              />
            </div>
          </button>

          {/* Desktop Mode Switcher */}
          <div className="hidden sm:flex items-center p-1 rounded-full bg-stone-100 dark:bg-carbon border border-stone-200 dark:border-graphite shadow-inner">
            <button
              onClick={() => onToggleMode('retail')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                mode === 'retail'
                  ? 'bg-copper text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              aria-pressed={mode === 'retail'}
            >
              Por Menor
            </button>
            <button
              onClick={() => onToggleMode('wholesale')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                mode === 'wholesale'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              aria-pressed={mode === 'wholesale'}
            >
              Por Mayor
            </button>
          </div>

          {/* Right Actions: Theme Toggle & WhatsApp (40x40 touch targets) */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-stone-100 dark:bg-carbon border border-stone-200 dark:border-graphite text-stone-700 dark:text-stone-300 hover:border-copper flex items-center justify-center transition-all active:scale-95"
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-copper-dark" />
              )}
            </button>

            <a
              href={`https://wa.me/${BRAND_INFO.whatsappNumberOnly}?text=${encodeURIComponent(
                '¡Hola Nelly! Estoy viendo tu tienda online y quería hacerte una consulta.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label="Contactar a Nelly por WhatsApp"
              title="Chat directo por WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-500/20" />
            </a>
          </div>
        </div>

        {/* Mobile-Only Full-Width Mode Segmented Bar */}
        <div className="sm:hidden pb-2.5">
          <div
            role="group"
            aria-label="Selector de modalidad de precios"
            className="grid grid-cols-2 p-1 rounded-xl bg-stone-100 dark:bg-carbon border border-stone-200 dark:border-graphite shadow-inner gap-1"
          >
            <button
              onClick={() => onToggleMode('retail')}
              className={`min-h-[40px] px-3 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                mode === 'retail'
                  ? 'bg-copper text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              aria-pressed={mode === 'retail'}
            >
              Por Menor
            </button>
            <button
              onClick={() => onToggleMode('wholesale')}
              className={`min-h-[40px] px-3 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                mode === 'wholesale'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              aria-pressed={mode === 'wholesale'}
            >
              <span>Por Mayor</span>
              <span
                className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-extrabold ${
                  mode === 'wholesale'
                    ? 'bg-white/20 text-white'
                    : 'bg-brand-red/15 text-brand-red'
                }`}
              >
                Desc.
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
