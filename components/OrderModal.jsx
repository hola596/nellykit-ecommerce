'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Send,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  BRAND_INFO,
  formatPrice,
  buildWhatsAppRetailUrl,
  buildWhatsAppWholesaleUrl,
} from '../data/catalog';
import confetti from 'canvas-confetti';

export default function OrderModal({
  product,
  mode = 'retail',
  selectedTier = 'tier3',
  onClose,
  onToast,
}) {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [deliveryMethod, setDeliveryMethod] = useState('Coordinar punto de encuentro en común');
  const [wholesaleConfirmed, setWholesaleConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!product) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const currentWholesale = product.wholesaleTiers
    ? product.wholesaleTiers[selectedTier] || product.wholesaleTiers.tier3
    : null;

  const thumbSrc = product.images?.[0] || '/brand/NellyKit-logo-blanco.png';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    if (mode === 'wholesale' && !wholesaleConfirmed) {
      if (onToast) onToast('Por favor confirma la cantidad de unidades mayoristas');
      return;
    }

    setSubmitting(true);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {}

    let whatsappUrl = '';
    if (mode === 'retail') {
      whatsappUrl = buildWhatsAppRetailUrl({
        product,
        customerName,
        paymentMethod,
        deliveryMethod,
      });
    } else {
      whatsappUrl = buildWhatsAppWholesaleUrl({
        product,
        tierKey: selectedTier,
        customerName,
        paymentMethod,
        deliveryMethod,
      });
    }

    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setSubmitting(false);
      onClose();
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white dark:bg-onyx border border-stone-200 dark:border-graphite shadow-luxury overflow-hidden text-left max-h-[92dvh] flex flex-col animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Grab Handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-stone-50 dark:bg-carbon flex-shrink-0">
          <span className="w-10 h-1 rounded-full bg-stone-300 dark:bg-slate" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-graphite bg-stone-50 dark:bg-carbon/60 flex-shrink-0">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-copper-dark dark:text-copper">
              <span>{mode === 'retail' ? 'Pedido Minorista' : 'Pedido Mayorista'}</span>
            </div>
            <h2 id="order-modal-title" className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              Hacer Pedido por WhatsApp
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 dark:bg-graphite text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-all"
            aria-label="Cerrar formulario de pedido"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body + Sticky Submit */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Selected Product Summary Box */}
            <div className="p-4 bg-stone-50/70 dark:bg-carbon/40 border-b border-stone-200 dark:border-graphite flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-carbon border border-stone-200 dark:border-stone-800 flex-shrink-0">
                <Image
                  src={thumbSrc}
                  alt={product.title}
                  fill
                  sizes="56px"
                  className={
                    thumbSrc.startsWith('/brand/')
                      ? 'object-contain p-1.5 bg-stone-950'
                      : 'object-cover'
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-stone-900 dark:text-white truncate">{product.title}</h3>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono block">
                  Código: {product.code}
                </span>
                <div className="text-sm font-serif font-bold text-copper-dark dark:text-copper mt-0.5">
                  {mode === 'retail'
                    ? formatPrice(product.priceRetail)
                    : `${currentWholesale?.label} — ${
                        typeof currentWholesale?.total === 'number'
                          ? formatPrice(currentWholesale.total)
                          : currentWholesale?.total
                      }`}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* Customer Name (16px on mobile to prevent iOS auto-zoom) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1.5">
                  Tu Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carolina Martínez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-carbon border border-stone-200 dark:border-graphite focus:border-copper text-base sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-ash outline-none transition-colors"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-copper-dark dark:text-copper" />
                  <span>Medio de Pago Disponible *</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Transferencia Bancaria', 'Mercado Pago'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`min-h-[44px] p-2.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between active:scale-[0.98] ${
                        paymentMethod === method
                          ? 'border-copper bg-copper/10 text-stone-900 dark:text-white font-semibold'
                          : 'border-stone-200 dark:border-graphite bg-stone-50 dark:bg-carbon text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <span className="truncate">{method}</span>
                      {paymentMethod === method && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-copper-dark dark:text-copper flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-ash mt-1.5">
                  (Seña 50% para iniciar confección, saldo restante antes de la entrega).
                </p>
              </div>

              {/* Delivery or Meeting Point (16px on mobile) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-copper-dark dark:text-copper" />
                  <span>Forma de Retiro o Entrega *</span>
                </label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-carbon border border-stone-200 dark:border-graphite focus:border-copper text-base sm:text-sm text-stone-900 dark:text-white outline-none transition-colors"
                >
                  <option value="Coordinar punto de encuentro en común">
                    Coordinar punto de encuentro
                  </option>
                  <option value="Retiro en persona por el taller">
                    Retiro en persona por taller artesanal
                  </option>
                  <option value="Envío por mensajería / encomienda">
                    Envío por correo / mensajería a coordinar
                  </option>
                </select>
              </div>

              {/* WHOLESALE EXPLICIT CONFIRMATION REQUIREMENT */}
              {mode === 'wholesale' && (
                <div className="p-3.5 rounded-xl bg-brand-red/10 border border-brand-red/30 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                        Confirmación de Unidades Mayoristas
                      </h4>
                      <p className="text-[11px] text-stone-700 dark:text-stone-300">
                        Estás por encargar: <strong className="text-stone-900 dark:text-white">{currentWholesale?.label}</strong> del producto <strong className="text-stone-900 dark:text-white">{product.title}</strong>.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer min-h-[36px]">
                    <input
                      type="checkbox"
                      required
                      checked={wholesaleConfirmed}
                      onChange={(e) => setWholesaleConfirmed(e.target.checked)}
                      className="w-5 h-5 rounded border-stone-300 dark:border-stone-700 bg-white dark:bg-carbon text-brand-red focus:ring-brand-red flex-shrink-0"
                    />
                    <span className="text-xs font-medium text-stone-900 dark:text-white">
                      ¿Confirmas que quieres encargar esta cantidad de unidades?
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Submit CTA with Safe-Area */}
          <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-stone-50/95 dark:bg-onyx border-t border-stone-200 dark:border-graphite space-y-2 flex-shrink-0">
            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-copper hover:bg-copper-dark text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-glow-copper flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {submitting ? (
                <span>Abriendo WhatsApp...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirmar y hacer pedido</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 dark:text-ash text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-copper-dark dark:text-copper flex-shrink-0" />
              <span>Mensaje directo al WhatsApp de NellyKit (+54 9 11 3431-0840)</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
