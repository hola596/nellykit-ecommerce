'use client';

import { useState } from 'react';
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
  const [deliveryMethod, setDeliveryMethod] = useState('Punto de encuentro / A coordinar');
  const [wholesaleConfirmed, setWholesaleConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!product) return null;

  const currentWholesale = product.wholesaleTiers ? product.wholesaleTiers[selectedTier] : null;

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
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-stone-900 dark:bg-onyx border border-stone-800 dark:border-graphite shadow-luxury overflow-hidden my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800/80 dark:border-graphite bg-stone-950/60 dark:bg-carbon/60">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-copper">
              <span>{mode === 'retail' ? 'Pedido Minorista' : 'Pedido Mayorista'}</span>
            </div>
            <h2 id="order-modal-title" className="font-serif text-lg font-bold text-white">
              Hacer Pedido por WhatsApp
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 dark:bg-graphite text-stone-400 hover:text-white flex items-center justify-center transition-all"
            aria-label="Cerrar formulario de pedido"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Product Summary Box */}
        <div className="p-4 bg-stone-950/40 dark:bg-carbon/40 border-b border-stone-800/60 dark:border-graphite flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-900 dark:bg-carbon border border-stone-800 flex-shrink-0">
            <Image
              src={product.images?.[0] || '/brand/NellyKit.png'}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-white truncate">{product.title}</h3>
            <span className="text-[10px] text-stone-400 font-mono block">
              Código: {product.code}
            </span>
            <div className="text-sm font-serif font-bold text-copper mt-0.5">
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-mist mb-1.5">
              Tu Nombre y Apellido *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Carolina Martínez"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 dark:bg-carbon border border-stone-800 dark:border-graphite focus:border-copper text-sm text-white placeholder-ash outline-none transition-colors"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-mist mb-1.5 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-copper" />
              <span>Medio de Pago Disponible *</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Transferencia Bancaria', 'Mercado Pago'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                    paymentMethod === method
                      ? 'border-copper bg-copper/10 text-white font-semibold'
                      : 'border-stone-800 dark:border-graphite bg-stone-950 dark:bg-carbon text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <span className="truncate">{method}</span>
                  {paymentMethod === method && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-copper flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-stone-400 dark:text-ash mt-1">
              (Seña 50% para iniciar confección, saldo restante antes de la entrega).
            </p>
          </div>

          {/* Delivery or Meeting Point */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-mist mb-1.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-copper" />
              <span>Forma de Retiro o Entrega *</span>
            </label>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 dark:bg-carbon border border-stone-800 dark:border-graphite focus:border-copper text-xs sm:text-sm text-white outline-none transition-colors"
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
            <div className="p-3 rounded-xl bg-brand-red/10 border border-brand-red/30 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Confirmación de Unidades Mayoristas
                  </h4>
                  <p className="text-[11px] text-stone-300">
                    Estás por encargar: <strong className="text-white">{currentWholesale?.label}</strong> del producto <strong className="text-white">{product.title}</strong>.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={wholesaleConfirmed}
                  onChange={(e) => setWholesaleConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-700 bg-carbon text-brand-red focus:ring-brand-red"
                />
                <span className="text-[11px] font-medium text-white">
                  ¿Confirmas que quieres encargar esta cantidad de unidades?
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-copper hover:bg-copper-dark text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-glow-copper flex items-center justify-center gap-2 active:scale-95"
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
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 dark:text-ash text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-copper" />
            <span>Mensaje 100% seguro directo al WhatsApp de NellyKit (+54 9 11 3431-0840)</span>
          </div>
        </form>
      </div>
    </div>
  );
}
