'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertTriangle,
  Lock,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { BRAND_INFO } from '../data/catalog';

export default function Footer({ onOpenContact }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sec) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  return (
    <footer className="w-full bg-stone-950 dark:bg-onyx border-t border-stone-800 dark:border-graphite text-stone-300 transition-colors pt-10 pb-20 px-4 sm:px-6">
      <div className="max-w-md mx-auto sm:max-w-2xl md:max-w-4xl space-y-8">
        {/* Brand identity block */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative w-36 h-12">
            <Image
              src={BRAND_INFO.logoDark}
              alt={BRAND_INFO.name}
              fill
              className="object-contain dark:block hidden"
            />
            <Image
              src={BRAND_INFO.logoLight}
              alt={BRAND_INFO.name}
              fill
              className="object-contain dark:hidden block"
            />
          </div>
          <p className="text-xs text-stone-400 dark:text-fog max-w-sm leading-relaxed">
            {BRAND_INFO.tagline}. Diseños únicos con confección manual, amor y precisión en cada costura.
          </p>
          <div className="flex items-center gap-2 text-xs text-copper">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Buenos Aires, Argentina</span>
          </div>
        </div>

        {/* Collapsible Accordions for Mobile / Clean layout */}
        <div className="space-y-3">
          {/* 1. Sobre Mí */}
          <div className="rounded-xl bg-stone-900/60 dark:bg-carbon border border-stone-800/80 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('about')}
              className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-white focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-copper" />
                <span>Sobre Mí (Taller Artesanal NellyKit)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                  openSection === 'about' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'about' && (
              <div className="px-3.5 pb-4 text-xs text-stone-300 dark:text-bone leading-relaxed border-t border-stone-800/40 dark:border-graphite/40 pt-3">
                <p>
                  ¡Hola! Soy Nelly. Cada uno de los portamaquillajes y bolsos diarios que ves en esta tienda fue ideado y confeccionado por mí con dedicación artesanal. Elijo telas nobles, cierres resistentes y apliques que perduren en tu rutina diaria.
                </p>
                <p className="mt-2">
                  Trabajo de manera personalizada tanto para pedidos individuales como para lotes mayoristas y recuerdos/souvenirs para eventos especiales.
                </p>
              </div>
            )}
          </div>

          {/* 2. Medios de Pago */}
          <div className="rounded-xl bg-stone-900/60 dark:bg-carbon border border-stone-800/80 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('payments')}
              className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-white focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-copper" />
                <span>Medios de Pago Disponibles</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                  openSection === 'payments' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'payments' && (
              <div className="px-3.5 pb-4 text-xs text-stone-300 dark:text-bone leading-relaxed border-t border-stone-800/40 dark:border-graphite/40 pt-3 space-y-2">
                <p className="font-medium text-white">
                  Aceptamos exclusivamente:
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-400">
                  <li><strong className="text-white">Transferencia Bancaria</strong> directa (CBU / CVU / Alias).</li>
                  <li><strong className="text-white">Mercado Pago</strong> (Dinero en cuenta, tarjetas o débito).</li>
                </ul>
                <p className="text-[11px] text-stone-400">
                  Los datos de cuenta bancaria se envían únicamente por WhatsApp oficial al coordinar el pedido.
                </p>
              </div>
            )}
          </div>

          {/* 3. Términos del Servicio */}
          <div className="rounded-xl bg-stone-900/60 dark:bg-carbon border border-stone-800/80 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('terms')}
              className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-white focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-copper" />
                <span>Términos del Servicio y Seña</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                  openSection === 'terms' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'terms' && (
              <div className="px-3.5 pb-4 text-xs text-stone-300 dark:text-bone leading-relaxed border-t border-stone-800/40 dark:border-graphite/40 pt-3 space-y-2">
                <p>
                  Las compras se confirman <strong>explícitamente por WhatsApp</strong>. No te pediremos ningún pago sin antes confirmar disponibilidad y confirmar tiempos de entrega.
                </p>
                <p>
                  Se predispone un <strong>50% del pago como seña</strong> para iniciar la confección o reservar el producto, y el otro <strong>50% un día antes de la entrega o despacho</strong>.
                </p>
                <p className="text-brand-red font-medium">
                  Bajo ningún punto de vista podremos entregar productos si no está confirmado el 100% del pago del producto.
                </p>
                <p className="pt-1 text-[11px] text-stone-400 border-t border-stone-800/60">
                  <strong>Acuerdo disponible:</strong> Abonar el 100% del pedido por adelantado, siempre y cuando se confirme antes la disponibilidad y el tiempo de entrega.
                </p>
              </div>
            )}
          </div>

          {/* 4. Políticas de Devolución */}
          <div className="rounded-xl bg-stone-900/60 dark:bg-carbon border border-stone-800/80 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('returns')}
              className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-white focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-brand-red" />
                <span>Políticas de Devolución y Calidad</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                  openSection === 'returns' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'returns' && (
              <div className="px-3.5 pb-4 text-xs text-stone-300 dark:text-bone leading-relaxed border-t border-stone-800/40 dark:border-graphite/40 pt-3 space-y-2">
                <p>
                  Los productos son <strong>100% artesanales</strong>: son piezas únicas que se realizan con un estándar de calidad manual.
                </p>
                <p>
                  Si una pieza estuviese defectuosa <strong>NO se envía</strong>; por lo tanto, el producto <strong>no tiene devolución</strong> una vez entregado.
                </p>
                <p className="text-stone-400">
                  No existe garantía para este producto. No nos hacemos cargo de cualquier rotura o desgaste generado por mal uso. Los productos son de carácter artesanal y no tienen garantía.
                </p>
              </div>
            )}
          </div>

          {/* 5. Políticas de Privacidad */}
          <div className="rounded-xl bg-stone-900/60 dark:bg-carbon border border-stone-800/80 dark:border-graphite overflow-hidden">
            <button
              onClick={() => toggleSection('privacy')}
              className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-white focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-copper" />
                <span>Políticas de Privacidad y Datos Seguros</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                  openSection === 'privacy' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'privacy' && (
              <div className="px-3.5 pb-4 text-xs text-stone-300 dark:text-bone leading-relaxed border-t border-stone-800/40 dark:border-graphite/40 pt-3">
                <p>
                  Los datos proporcionados están seguros. Solo serán utilizados con el fin comercial explícitamente acordado en este medio (coordinación y entrega de pedidos). No serán divulgados, vendidos ni manipulados hacia ninguna otra entidad o tercero.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-copper/10 via-brand-red/10 to-copper/10 border border-copper/30 text-center space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            ¿Tenés dudas o consultas sobre un pedido especial?
          </h4>
          <p className="text-xs text-stone-400">
            Coordinamos pedidos de souvenirs para cumpleaños de 15, bodas y regalos empresariales.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <a
              href={`https://wa.me/${BRAND_INFO.whatsappNumberOnly}?text=${encodeURIComponent(
                'Hola Nelly! Quería hacerte una consulta sobre un pedido especial.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chatear por WhatsApp ({BRAND_INFO.whatsapp})</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center text-[11px] text-stone-500 border-t border-stone-800/60 flex flex-col items-center gap-1">
          <p>© {new Date().getFullYear()} {BRAND_INFO.name}. Todos los derechos reservados.</p>
          <p className="text-[10px] text-stone-600">
            Desarrollado con arquitectura de alto rendimiento, ciberseguridad OWASP y optimización Mobile-First.
          </p>
        </div>
      </div>
    </footer>
  );
}
