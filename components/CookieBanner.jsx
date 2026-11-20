'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('nellykit-cookies-consent');
      if (!consent) {
        const timer = setTimeout(() => setShow(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('nellykit-cookies-consent', 'accepted');
    } catch (e) {}
    setShow(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('nellykit-cookies-consent', 'essential-only');
    } catch (e) {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies y privacidad"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-3 sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-md z-50 p-4 rounded-2xl bg-white/95 dark:bg-onyx/95 backdrop-blur-md border border-stone-200 dark:border-graphite shadow-luxury-light dark:shadow-luxury text-left animate-fade-in"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-copper/15 text-copper-dark dark:text-copper flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>

        <div className="flex-1 text-xs">
          <h4 className="font-semibold text-stone-900 dark:text-white mb-1">
            Tu privacidad y seguridad
          </h4>
          <p className="text-stone-600 dark:text-fog leading-relaxed mb-3">
            Utilizamos tecnologías seguras para recordar tus preferencias de compra (modo mayorista/minorista y tema) y garantizar una navegación ágil y protegida.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-copper hover:bg-copper-dark text-white font-semibold text-xs tracking-wide transition-colors active:scale-95"
            >
              Aceptar todo
            </button>
            <button
              onClick={handleDecline}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-carbon hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs transition-colors active:scale-95"
            >
              Solo esenciales
            </button>
          </div>
        </div>

        <button
          onClick={handleDecline}
          className="text-stone-400 hover:text-stone-900 dark:hover:text-white p-1.5 rounded-lg"
          aria-label="Cerrar aviso de cookies"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
