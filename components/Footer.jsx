'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  CreditCard,
  FileText,
  AlertTriangle,
  Lock,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { BRAND_INFO } from '../data/catalog';

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sec) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  return (
    <footer className="w-full bg-stone-100 dark:bg-onyx border-t border-stone-200 dark:border-graphite text-stone-700 dark:text-stone-300 transition-colors pt-10 pb-[max(5rem,calc(env(safe-area-inset-bottom)+3.5rem))] px-4 sm:px-6">
      <div className="max-w-md mx-auto sm:max-w-2xl md:max-w-4xl space-y-8">
        {/* Protagonist Brand Identity Block */}
        <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white dark:bg-carbon/60 border border-stone-200 dark:border-graphite shadow-luxury-light dark:shadow-none relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-copper/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative w-56 h-32 sm:w-64 sm:h-36 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full bg-copper/15 dark:bg-copper/20 blur-2xl pointer-events-none" />
            <Image
              src={BRAND_INFO.logoDark}
              alt={BRAND_INFO.name}
              fill
              sizes="(max-width: 640px) 224px, 256px"
              className="object-contain dark:block hidden drop-shadow-[0_6px_18px_rgba(204,145,102,0.22)]"
            />
            <Image
              src={BRAND_INFO.logoLight}
              alt={BRAND_INFO.name}
              fill
              sizes="(max-width: 640px) 224px, 256px"
              className="object-contain dark:hidden block"
            />
          </div>
          <p className="relative z-10 text-xs sm:text-sm text-stone-600 dark:text-fog max-w-sm leading-relaxed">
            {BRAND_INFO.tagline}. Diseños únicos con confección manual, amor y precisión en cada costura.
          </p>
          <div className="relative z-10 flex items-center gap-2 text-xs font-medium text-copper-dark dark:text-copper">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Buenos Aires, Argentina</span>
          </div>
        </div>

        {/* Collapsible Accordions (48px min touch targets) */}
        <div className="space-y-3">
          {/* 1. Sobre Mí */}
          <div className="rounded-xl bg-white dark:bg-carbon border border-stone-200 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('about')}
              className="w-full min-h-[48px] p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-copper-dark dark:text-copper flex-shrink-0" />
                <span>Sobre Mí (Taller Artesanal NellyKit)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 flex-shrink-0 ${
                  openSection === 'about' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'about' && (
              <div className="px-3.5 pb-4 text-xs text-stone-700 dark:text-bone leading-relaxed border-t border-stone-100 dark:border-graphite/40 pt-3">
                <p>
                  ¡Hola! Soy Nelly. Cada uno de los portamaquillajes, bolsos diarios y portatazas que ves en esta tienda fue ideado y confeccionado por mí con dedicación artesanal. Elijo telas nobles, cierres resistentes y apliques que perduren en tu rutina diaria.
                </p>
                <p className="mt-2">
                  Trabajo de manera personalizada tanto para pedidos individuales como para lotes mayoristas y recuerdos/souvenirs para eventos especiales.
                </p>
              </div>
            )}
          </div>

          {/* 2. Medios de Pago */}
          <div className="rounded-xl bg-white dark:bg-carbon border border-stone-200 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('payments')}
              className="w-full min-h-[48px] p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-copper-dark dark:text-copper flex-shrink-0" />
                <span>Medios de Pago Disponibles</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 flex-shrink-0 ${
                  openSection === 'payments' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'payments' && (
              <div className="px-3.5 pb-4 text-xs text-stone-700 dark:text-bone leading-relaxed border-t border-stone-100 dark:border-graphite/40 pt-3 space-y-2">
                <p className="font-medium text-stone-900 dark:text-white">
                  Aceptamos exclusivamente:
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400">
                  <li><strong className="text-stone-900 dark:text-white">Transferencia Bancaria</strong> directa (CBU / CVU / Alias).</li>
                  <li><strong className="text-stone-900 dark:text-white">Mercado Pago</strong> (Dinero en cuenta, tarjetas o débito).</li>
                </ul>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Los datos de cuenta bancaria se envían únicamente por WhatsApp oficial al coordinar el pedido.
                </p>
              </div>
            )}
          </div>

          {/* 3. Términos del Servicio */}
          <div className="rounded-xl bg-white dark:bg-carbon border border-stone-200 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('terms')}
              className="w-full min-h-[48px] p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-copper-dark dark:text-copper flex-shrink-0" />
                <span>Términos del Servicio y Seña</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 flex-shrink-0 ${
                  openSection === 'terms' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'terms' && (
              <div className="px-3.5 pb-4 text-xs text-stone-700 dark:text-bone leading-relaxed border-t border-stone-100 dark:border-graphite/40 pt-3 space-y-2">
                <p>
                  Las compras se confirman <strong>explícitamente por WhatsApp</strong>. No te pediremos ningún pago sin antes confirmar disponibilidad y confirmar tiempos de entrega.
                </p>
                <p>
                  Se predispone un <strong>50% del pago como seña</strong> para iniciar la confección o reservar el producto, y el otro <strong>50% un día antes de la entrega o despacho</strong>.
                </p>
                <p className="text-brand-red font-medium">
                  Bajo ningún punto de vista podremos entregar productos si no está confirmado el 100% del pago del producto.
                </p>
                <p className="pt-1 text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800/60">
                  <strong>Acuerdo disponible:</strong> Abonar el 100% del pedido por adelantado, siempre y cuando se confirme antes la disponibilidad y el tiempo de entrega.
                </p>
              </div>
            )}
          </div>

          {/* 4. Políticas de Devolución */}
          <div className="rounded-xl bg-white dark:bg-carbon border border-stone-200 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('returns')}
              className="w-full min-h-[48px] p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>Políticas de Devolución y Calidad</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 flex-shrink-0 ${
                  openSection === 'returns' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'returns' && (
              <div className="px-3.5 pb-4 text-xs text-stone-700 dark:text-bone leading-relaxed border-t border-stone-100 dark:border-graphite/40 pt-3 space-y-2">
                <p>
                  Los productos son <strong>100% artesanales</strong>: son piezas únicas que se realizan con un estándar de calidad manual.
                </p>
                <p>
                  Si una pieza estuviese defectuosa <strong>NO se envía</strong>; por lo tanto, el producto <strong>no tiene devolución</strong> una vez entregado.
                </p>
                <p className="text-stone-600 dark:text-stone-400">
                  No existe garantía para este producto. No nos hacemos cargo de cualquier rotura o desgaste generado por mal uso. Los productos son de carácter artesanal y no tienen garantía.
                </p>
              </div>
            )}
          </div>

          {/* 5. Políticas de Privacidad */}
          <div className="rounded-xl bg-white dark:bg-carbon border border-stone-200 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('privacy')}
              className="w-full min-h-[48px] p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-copper-dark dark:text-copper flex-shrink-0" />
                <span>Políticas de Privacidad y Datos Seguros</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 flex-shrink-0 ${
                  openSection === 'privacy' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'privacy' && (
              <div className="px-3.5 pb-4 text-xs text-stone-700 dark:text-bone leading-relaxed border-t border-stone-100 dark:border-graphite/40 pt-3">
                <p>
                  Los datos proporcionados están seguros. Solo serán utilizados con el fin comercial explícitamente acordado en este medio (coordinación y entrega de pedidos). No serán divulgados, vendidos ni manipulados hacia ninguna otra entidad o tercero.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-copper/10 via-brand-red/10 to-copper/10 border border-copper/30 text-center space-y-2">
          <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            ¿Tenés dudas o consultas sobre un pedido especial?
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Coordinamos pedidos de souvenirs para cumpleaños de 15, bodas y regalos empresariales.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <a
              href={`https://wa.me/${BRAND_INFO.whatsappNumberOnly}?text=${encodeURIComponent(
                'Hola Nelly! Quería hacerte una consulta sobre un pedido especial.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear por WhatsApp ({BRAND_INFO.whatsapp})</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center text-[11px] text-stone-500 border-t border-stone-200 dark:border-stone-800/60 flex flex-col items-center gap-1">
          <p>© {new Date().getFullYear()} {BRAND_INFO.name}. Todos los derechos reservados.</p>
          <p className="text-[10px] text-stone-400 dark:text-stone-600">
            Desarrollado con arquitectura de alto rendimiento, ciberseguridad OWASP y optimización Mobile-First.
          </p>
        </div>
      </div>
    </footer>
  );
}
