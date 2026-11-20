'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Users,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { BRAND_INFO, buildWhatsAppResellerLeadUrl } from '../data/catalog';
import confetti from 'canvas-confetti';

export default function WelcomeScreen({ onSelectMode }) {
  const [isDark, setIsDark] = useState(true);
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [resellerForm, setResellerForm] = useState({
    name: '',
    email: '',
    salesChannel: 'Local comercial',
    coverageZone: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nellykit-theme');
      setIsDark(saved !== 'light');
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!showResellerModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowResellerModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showResellerModal]);

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

  const handleResellerSubmit = (e) => {
    e.preventDefault();
    if (!resellerForm.name || !resellerForm.email || !resellerForm.coverageZone) return;

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {}

    const whatsappUrl = buildWhatsAppResellerLeadUrl(resellerForm);
    setFormSubmitted(true);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setShowResellerModal(false);
      setFormSubmitted(false);
    }, 1000);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#faf9f6] text-stone-900 dark:bg-obsidian dark:text-stone-100 transition-colors">
      <div className="min-h-[100dvh] flex flex-col justify-between px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] max-w-md mx-auto text-center animate-fade-in relative">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-red/10 dark:bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-copper/10 dark:bg-copper/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar with Theme Toggle */}
        <div className="relative z-10 flex items-center justify-end">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white dark:bg-carbon border border-stone-200 dark:border-graphite text-stone-700 dark:text-stone-300 hover:border-copper flex items-center justify-center shadow-sm transition-all active:scale-95"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-copper-dark" />
            )}
          </button>
        </div>

        {/* Header & Hero Logo */}
        <header className="relative z-10 pt-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-copper/10 border border-copper/30 text-copper-dark dark:text-copper text-xs font-semibold tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Taller Artesanal Oficial</span>
          </div>

          <div className="relative w-64 h-36 sm:w-80 sm:h-44 mx-auto mb-5 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full bg-copper/15 dark:bg-copper/20 blur-2xl pointer-events-none" />
            <Image
              src={BRAND_INFO.logoDark}
              alt={BRAND_INFO.name}
              fill
              sizes="(max-width: 640px) 256px, 320px"
              className="object-contain dark:block hidden drop-shadow-[0_8px_28px_rgba(204,145,102,0.28)]"
              priority
            />
            <Image
              src={BRAND_INFO.logoLight}
              alt={BRAND_INFO.name}
              fill
              sizes="(max-width: 640px) 256px, 320px"
              className="object-contain dark:hidden block drop-shadow-sm"
              priority
            />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-white mb-2.5">
            Artesanías con Amor
          </h1>
          <p className="text-sm text-stone-600 dark:text-fog leading-relaxed max-w-xs mx-auto">
            Confección 100% manual de portamaquillajes, bolsos diarios y portatazas. Piezas únicas pensadas para acompañarte todos los días.
          </p>
        </header>

        {/* Main Mode Selection */}
        <section className="relative z-10 my-6 space-y-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-copper-dark dark:text-copper">
            Elegí cómo querés navegar hoy
          </p>

          {/* Card: Por Menor */}
          <button
            onClick={() => onSelectMode('retail')}
            className="w-full min-h-[76px] text-left p-4 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-onyx dark:to-carbon border border-stone-200 dark:border-graphite hover:border-copper dark:hover:border-copper transition-all duration-200 shadow-luxury-light dark:shadow-lg hover:shadow-glow-copper active:scale-[0.98] group relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-copper/15 text-copper-dark dark:text-copper flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-stone-900 dark:text-white group-hover:text-copper-dark dark:group-hover:text-copper transition-colors">
                      Ver precios por menor
                    </h2>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-copper/15 text-copper-dark dark:text-copper">
                      Directo
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-fog mt-0.5">
                    Precios unitarios para vos o regalar
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-copper group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </button>

          {/* Card: Por Mayor */}
          <button
            onClick={() => onSelectMode('wholesale')}
            className="w-full min-h-[76px] text-left p-4 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-onyx dark:to-carbon border border-stone-200 dark:border-graphite hover:border-brand-red dark:hover:border-brand-red transition-all duration-200 shadow-luxury-light dark:shadow-lg hover:shadow-glow-red active:scale-[0.98] group relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-brand-red/15 text-brand-red flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-stone-900 dark:text-white group-hover:text-brand-red transition-colors">
                      Ver precios por mayor
                    </h2>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-red/15 text-brand-red">
                      Descuentos
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-fog mt-0.5">
                    Desde 3 unidades, souvenirs y eventos
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-brand-red group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </button>

          {/* Separate Button: Generar Ingresos / Reventa */}
          <div className="pt-1.5">
            <button
              onClick={() => setShowResellerModal(true)}
              className="w-full min-h-[48px] py-3.5 px-4 rounded-xl border border-dashed border-copper/60 hover:border-copper bg-copper/5 hover:bg-copper/10 text-copper-dark dark:text-copper font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] group shadow-sm"
            >
              <TrendingUp className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span>Generar ingresos, ver precios de reventa</span>
            </button>
          </div>
        </section>

        {/* Footer reassurance */}
        <footer className="relative z-10 pt-3 border-t border-stone-200 dark:border-graphite text-xs text-stone-500 dark:text-ash flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-copper flex-shrink-0" />
          <span>Atención directa por WhatsApp sin intermediarios</span>
        </footer>

        {/* MODAL: PRÓXIMAMENTE... Clasificador de Leads Reventa (Bottom Sheet on Mobile) */}
        {showResellerModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reseller-modal-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
            onClick={() => setShowResellerModal(false)}
          >
            <div
              className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl bg-white dark:bg-onyx border border-stone-200 dark:border-graphite text-left relative shadow-luxury max-h-[92dvh] flex flex-col animate-sheet-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Grab Handle */}
              <div className="sm:hidden flex justify-center pt-2.5 pb-1">
                <span className="w-10 h-1 rounded-full bg-stone-300 dark:bg-slate" />
              </div>

              <button
                onClick={() => setShowResellerModal(false)}
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-stone-100 dark:bg-carbon text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-red/15 text-brand-red text-[11px] font-bold tracking-wider uppercase mb-3">
                  <TrendingUp className="w-3 h-3" />
                  <span>PROXIMAMENTE...</span>
                </div>

                <h3
                  id="reseller-modal-title"
                  className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-2"
                >
                  Lista de Espera: Precios de Reventa
                </h3>
                <p className="text-xs text-stone-600 dark:text-fog leading-relaxed mb-4">
                  Inscribite para ser el primero en recibir el catálogo mayorista exclusivo con márgenes y beneficios de reventa directa.
                </p>

                <form onSubmit={handleResellerSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1">
                      Tu Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Lucía Gómez"
                      value={resellerForm.name}
                      onChange={(e) => setResellerForm({ ...resellerForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-carbon border border-stone-200 dark:border-graphite focus:border-copper text-base sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-ash outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tuemail@ejemplo.com"
                      value={resellerForm.email}
                      onChange={(e) => setResellerForm({ ...resellerForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-carbon border border-stone-200 dark:border-graphite focus:border-copper text-base sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-ash outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1">
                      ¿Cómo vendés normalmente?
                    </label>
                    <select
                      value={resellerForm.salesChannel}
                      onChange={(e) => setResellerForm({ ...resellerForm, salesChannel: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-carbon border border-stone-200 dark:border-graphite focus:border-copper text-base sm:text-sm text-stone-900 dark:text-white outline-none transition-colors"
                    >
                      <option value="Local comercial">Tengo un local comercial</option>
                      <option value="Redes sociales">Vendo por redes sociales (Instagram/Facebook)</option>
                      <option value="Showroom">Tengo un showroom / tienda en casa</option>
                      <option value="Venta directa">Venta directa independiente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1">
                      Zona de Cobertura / Localidad *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Córdoba Capital / Palermo, CABA"
                      value={resellerForm.coverageZone}
                      onChange={(e) => setResellerForm({ ...resellerForm, coverageZone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-carbon border border-stone-200 dark:border-graphite focus:border-copper text-base sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-ash outline-none transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formSubmitted}
                      className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-copper hover:bg-copper-dark text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-glow-copper active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {formSubmitted ? (
                        <span>Abriendo WhatsApp...</span>
                      ) : (
                        <span>Suscribirme a la lista de espera para revender los productos</span>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-stone-500 dark:text-ash text-center leading-tight">
                    Se enviará un resumen directo a nuestro WhatsApp para registrarte de forma prioritaria.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
