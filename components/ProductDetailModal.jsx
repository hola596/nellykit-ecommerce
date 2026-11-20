'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Share2,
  Copy,
  Check,
  Star,
  Play,
  ShoppingCart,
  Sparkles,
  Ruler,
  ShieldCheck,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BRAND_INFO, formatPrice } from '../data/catalog';

const TIER_ORDER = ['tier3', 'tier10', 'souvenir20', 'souvenir30', 'souvenirPlus'];

export default function ProductDetailModal({
  product,
  mode = 'retail',
  selectedTier = 'tier3',
  onSelectTier,
  onClose,
  onOrderProduct,
  onToast,
}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeTier, setActiveTier] = useState(selectedTier || 'tier3');
  const [copied, setCopied] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    setActiveTier(selectedTier || 'tier3');
  }, [selectedTier]);

  useEffect(() => {
    setActiveMediaIndex(0);
    setIsVideoPlaying(false);
  }, [product?.code]);

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

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['/brand/NellyKit-logo-blanco.png'];
  const activeImage = images[activeMediaIndex] || images[0] || '/brand/NellyKit-logo-blanco.png';
  const isBrandPlaceholder = activeImage.startsWith('/brand/');
  const hasVideo = !!product.video;
  const currentWholesale = product.wholesaleTiers
    ? product.wholesaleTiers[activeTier] || product.wholesaleTiers.tier3
    : null;

  const handleTierChange = (tierKey) => {
    setActiveTier(tierKey);
    if (onSelectTier) onSelectTier(tierKey);
  };

  const stepImage = (delta) => {
    if (images.length <= 1) return;
    setIsVideoPlaying(false);
    setActiveMediaIndex((prev) => (prev + delta + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || images.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = touchStartX.current - endX;
    if (Math.abs(delta) > 40) {
      stepImage(delta > 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/#prod-${product.code}`
      : `https://nellykit-ecommerce.vercel.app/#prod-${product.code}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        if (onToast) onToast('¡Enlace copiado al portapapeles!');
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      if (onToast) onToast('Copia el enlace manualmente');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} - ${BRAND_INFO.name}`,
          text: `Mirá este producto artesanal de NellyKit: ${product.title}`,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-onyx border border-stone-200 dark:border-graphite shadow-luxury overflow-hidden text-left max-h-[92dvh] flex flex-col animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Grab Handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1.5 bg-stone-50 dark:bg-carbon flex-shrink-0">
          <span className="w-10 h-1 rounded-full bg-stone-300 dark:bg-slate" />
        </div>

        {/* Close Button (36x36) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md"
          aria-label="Cerrar detalles del producto"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Sheet Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Media Preview (Video or Image with Swipe & Chevrons) */}
          <div
            className="relative w-full aspect-square max-h-[46dvh] sm:max-h-none bg-stone-100 dark:bg-carbon"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {hasVideo && isVideoPlaying ? (
              <video
                src={product.video}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 500px"
                  className={isBrandPlaceholder ? 'object-contain p-10 bg-stone-950' : 'object-cover'}
                  priority
                />

                {isBrandPlaceholder && !isVideoPlaying && (
                  <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-copper/40 text-copper text-[10px] font-semibold uppercase tracking-wider">
                    Foto real próximamente
                  </div>
                )}

                {hasVideo && (
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-brand-red/90 hover:bg-brand-red text-white flex items-center justify-center shadow-glow-red transition-transform hover:scale-110 active:scale-95 z-10"
                    aria-label="Reproducir video artesanal"
                  >
                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                  </button>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepImage(-1)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepImage(1)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Badges on detail photo */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-tight uppercase shadow-sm ${
                  product.stock
                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-950/90 text-rose-300 border border-rose-500/30'
                }`}
              >
                {product.stock ? 'DISPONIBLE' : 'AGOTADO'}
              </span>
              {product.badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-brand-red text-white">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Selector */}
          {(images.length > 1 || hasVideo) && (
            <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar bg-stone-50 dark:bg-carbon/60 border-b border-stone-200 dark:border-graphite">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveMediaIndex(idx);
                    setIsVideoPlaying(false);
                  }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeMediaIndex === idx && !isVideoPlaying
                      ? 'border-copper scale-105'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Miniatura ${idx + 1}`} fill sizes="48px" className="object-cover" />
                </button>
              ))}

              {hasVideo && (
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                    isVideoPlaying
                      ? 'border-brand-red bg-brand-red/20 text-brand-red dark:text-white'
                      : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-carbon text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  aria-label="Ver video del producto"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          )}

          {/* Content Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Header & Title */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-copper-dark dark:text-copper font-semibold">
                  Código: {product.code}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                      ({product.reviewsCount} reseñas)
                    </span>
                  </div>
                )}
              </div>

              <h2
                id="product-detail-title"
                className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight"
              >
                {product.title}
              </h2>
            </div>

            {/* Pricing Highlight & Wholesale Tier Selector */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-carbon/70 border border-stone-200 dark:border-graphite space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-0.5">
                    {mode === 'retail' ? 'Precio Minorista' : 'Precio Mayorista Seleccionado'}
                  </span>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-copper-dark dark:text-copper">
                    {mode === 'retail'
                      ? formatPrice(product.priceRetail)
                      : typeof currentWholesale?.total === 'number'
                      ? formatPrice(currentWholesale.total)
                      : currentWholesale?.total}
                  </div>
                </div>

                <div className="text-right">
                  {mode === 'retail' ? (
                    product.priceRetailOriginal && (
                      <span className="text-xs text-stone-400 line-through font-mono block">
                        {formatPrice(product.priceRetailOriginal)}
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-stone-700 dark:text-stone-300 font-medium block">
                      {currentWholesale?.label}
                      {typeof currentWholesale?.unitPrice === 'number'
                        ? ` (${formatPrice(currentWholesale.unitPrice)} c/u)`
                        : ''}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3 h-3" />
                    Precio Final Confirmado
                  </span>
                </div>
              </div>

              {mode === 'wholesale' && product.wholesaleTiers && (
                <div className="pt-2 border-t border-stone-200 dark:border-graphite">
                  <label
                    htmlFor="modal-wholesale-tier"
                    className="block text-[10px] font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1.5"
                  >
                    Elegir cantidad mayorista:
                  </label>
                  <select
                    id="modal-wholesale-tier"
                    value={activeTier}
                    onChange={(e) => handleTierChange(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white dark:bg-onyx border border-stone-200 dark:border-graphite focus:border-copper text-base sm:text-sm font-medium text-stone-900 dark:text-white outline-none transition-colors"
                  >
                    {TIER_ORDER.filter((k) => product.wholesaleTiers[k]).map((key) => {
                      const t = product.wholesaleTiers[key];
                      const totalStr = typeof t.total === 'number' ? formatPrice(t.total) : t.total;
                      return (
                        <option key={key} value={key}>
                          {t.label} — {totalStr}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-mist mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-copper-dark dark:text-copper" />
                <span>Confección Artesanal</span>
              </h3>
              <p className="text-sm text-stone-700 dark:text-bone leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Dimensions & Elaboration */}
            {product.dimensions && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-carbon/50 border border-stone-200 dark:border-graphite flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-copper-dark dark:text-copper flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block uppercase">Medidas</span>
                    <span className="text-stone-900 dark:text-white font-medium block truncate">{product.dimensions}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-carbon/50 border border-stone-200 dark:border-graphite flex items-center gap-2">
                  <Layers className="w-4 h-4 text-copper-dark dark:text-copper flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block uppercase">Elaboración</span>
                    <span className="text-stone-900 dark:text-white font-medium block truncate">100% Hecho a mano</span>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Pills */}
            {Array.isArray(product.features) && product.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-copper/10 border border-copper/25 text-copper-dark dark:text-copper-light text-[11px] font-medium"
                  >
                    <Check className="w-3 h-3 flex-shrink-0" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            )}

            {/* SHARE BOX REQUIREMENT */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-carbon border border-dashed border-stone-300 dark:border-slate space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-copper-dark dark:text-copper" />
                  <span>Compartir este producto con otros contactos</span>
                </span>
                <button
                  onClick={handleNativeShare}
                  className="text-xs text-copper-dark dark:text-copper hover:underline font-semibold"
                >
                  Compartir
                </button>
              </div>

              <p className="text-[11px] text-stone-600 dark:text-fog">
                Pegá el siguiente enlace en WhatsApp, Instagram o tus redes para mostrar este producto:
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full text-xs font-mono px-2.5 py-2 rounded-lg bg-white dark:bg-onyx border border-stone-200 dark:border-graphite text-stone-700 dark:text-stone-300 outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-copper hover:bg-copper-dark text-white font-semibold text-xs flex items-center gap-1 transition-colors flex-shrink-0 active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Safe-Area Action Button Footer */}
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-stone-50/95 dark:bg-onyx border-t border-stone-200 dark:border-graphite flex-shrink-0">
          <button
            onClick={() => {
              onClose();
              onOrderProduct(product, activeTier);
            }}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-copper hover:bg-copper-dark text-white font-bold text-sm tracking-wide transition-all shadow-glow-copper flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>+ Hacer pedido por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
