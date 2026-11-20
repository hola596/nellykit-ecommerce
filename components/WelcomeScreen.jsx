'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, ShoppingBag, TrendingUp, Users, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { BRAND_INFO, buildWhatsAppResellerLeadUrl } from '../data/catalog';
import confetti from 'canvas-confetti';

export default function WelcomeScreen({ onSelectMode }) {
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [resellerForm, setResellerForm] = useState({
    name: '',
    email: '',
    salesChannel: 'Local comercial',
    coverageZone: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

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
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-8 max-w-md mx-auto text-center animate-fade-in relative">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-red/10 dark:bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-copper/10 dark:bg-copper/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Logo */}
      <header className="relative z-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper/10 border border-copper/30 text-copper text-xs font-medium tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Taller Artesanal Oficial</span>
        </div>

        <div className="relative w-48 h-20 mx-auto mb-4">
          <Image
            src={BRAND_INFO.logoDark}
            alt={BRAND_INFO.name}
            fill
            className="object-contain dark:block hidden priority"
            priority
          />
          <Image
            src={BRAND_INFO.logoLight}
            alt={BRAND_INFO.name}
            fill
            className="object-contain dark:hidden block priority"
            priority
          />
        </div>

        <h1 className="font-serif text-3xl font-bold tracking-tight text-white dark:text-white text-stone-900 mb-3">
          Artesanías con Amor
        </h1>
        <p className="text-sm text-stone-400 dark:text-fog leading-relaxed max-w-xs mx-auto">
          Confección 100% manual de portamaquillajes, bolsos diarios y portatazas. Piezas únicas pensadas para acompañarte todos los días.
        </p>
      </header>

      {/* Main Mode Selection */}
      <section className="relative z-10 my-8 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-copper">
          Elegí cómo querés navegar hoy
        </p>

        {/* Card: Por Menor */}
        <button
          onClick={() => onSelectMode('retail')}
          className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-stone-900/90 to-stone-900/60 dark:from-onyx dark:to-carbon border border-stone-800 dark:border-graphite hover:border-copper transition-all duration-300 shadow-lg hover:shadow-glow-copper group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-copper/15 text-copper flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white group-hover:text-copper transition-colors">
                    Ver precios por menor
                  </h2>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-copper/20 text-copper">
                    Directo
                  </span>
                </div>
                <p className="text-xs text-stone-400 dark:text-fog mt-0.5">
                  Precios unitarios para vos o regalar
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-copper group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        {/* Card: Por Mayor */}
        <button
          onClick={() => onSelectMode('wholesale')}
          className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-stone-900/90 to-stone-900/60 dark:from-onyx dark:to-carbon border border-stone-800 dark:border-graphite hover:border-brand-red transition-all duration-300 shadow-lg hover:shadow-glow-red group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-brand-red/15 text-brand-red flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white group-hover:text-brand-red transition-colors">
                    Ver precios por mayor
                  </h2>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-red/20 text-brand-red">
                    Descuentos
                  </span>
                </div>
                <p className="text-xs text-stone-400 dark:text-fog mt-0.5">
                  Desde 3 unidades, souvenirs y eventos
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        {/* Separate Button: Generar Ingresos / Reventa */}
        <div className="pt-2">
          <button
            onClick={() => setShowResellerModal(true)}
            className="w-full py-3.5 px-4 rounded-xl border border-dashed border-copper/60 hover:border-copper bg-copper/5 hover:bg-copper/10 text-copper font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 group shadow-sm"
          >
            <TrendingUp className="w-4 h-4 text-copper group-hover:scale-110 transition-transform" />
            <span>Generar ingresos, ver precios de reventa</span>
          </button>
        </div>
      </section>

      {/* Footer reassurance */}
      <footer className="relative z-10 pt-4 border-t border-stone-800/60 dark:border-graphite text-xs text-stone-400 dark:text-ash flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-copper" />
        <span>Atención directa por WhatsApp sin intermediarios</span>
      </footer>

      {/* MODAL: PRÓXIMAMENTE... Clasificador de Leads Reventa */}
      {showResellerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-onyx border border-graphite p-6 text-left relative shadow-luxury">
            <button
              onClick={() => setShowResellerModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-carbon text-stone-400 hover:text-white flex items-center justify-center text-sm"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-red/20 text-brand-red text-[11px] font-bold tracking-wider uppercase mb-3">
              <TrendingUp className="w-3 h-3" />
              <span>PROXIMAMENTE...</span>
            </div>

            <h3 className="font-serif text-xl font-bold text-white mb-2">
              Lista de Espera: Precios de Reventa
            </h3>
            <p className="text-xs text-fog leading-relaxed mb-4">
              Inscribite para ser el primero en recibir el catálogo mayorista exclusivo con márgenes y beneficios de reventa directa.
            </p>

            <form onSubmit={handleResellerSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mist mb-1">
                  Tu Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lucía Gómez"
                  value={resellerForm.name}
                  onChange={(e) => setResellerForm({ ...resellerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-carbon border border-graphite focus:border-copper text-sm text-white placeholder-ash outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mist mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="tuemail@ejemplo.com"
                  value={resellerForm.email}
                  onChange={(e) => setResellerForm({ ...resellerForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-carbon border border-graphite focus:border-copper text-sm text-white placeholder-ash outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mist mb-1">
                  ¿Cómo vendés normalmente?
                </label>
                <select
                  value={resellerForm.salesChannel}
                  onChange={(e) => setResellerForm({ ...resellerForm, salesChannel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-carbon border border-graphite focus:border-copper text-sm text-white outline-none transition-colors"
                >
                  <option value="Local comercial">Tengo un local comercial</option>
                  <option value="Redes sociales">Vendo por redes sociales (Instagram/Facebook)</option>
                  <option value="Showroom">Tengo un showroom / tienda en casa</option>
                  <option value="Venta directa">Venta directa independiente</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mist mb-1">
                  Zona de Cobertura / Localidad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Córdoba Capital / Palermo, CABA"
                  value={resellerForm.coverageZone}
                  onChange={(e) => setResellerForm({ ...resellerForm, coverageZone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-carbon border border-graphite focus:border-copper text-sm text-white placeholder-ash outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formSubmitted}
                  className="w-full py-3 px-4 rounded-xl bg-copper hover:bg-copper-dark text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-glow-copper flex items-center justify-center gap-2"
                >
                  {formSubmitted ? (
                    <span>Abriendo WhatsApp...</span>
                  ) : (
                    <span>Suscribirme a la lista de espera para revender los productos</span>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-ash text-center leading-tight">
                Se enviará un resumen directo a nuestro WhatsApp para registrarte de forma prioritaria.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
