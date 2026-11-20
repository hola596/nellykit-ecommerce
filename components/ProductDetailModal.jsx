'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { BRAND_INFO, formatPrice } from '../data/catalog';

export default function ProductDetailModal({
  product,
  mode = 'retail',
  selectedTier = 'tier3',
  onClose,
  onOrderProduct,
  onToast,
}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['/brand/NellyKit-logo-blanco.png'];
  const activeImage = images[activeMediaIndex] || images[0] || '/brand/NellyKit-logo-blanco.png';
  const isBrandPlaceholder = activeImage.startsWith('/brand/');
  const hasVideo = !!product.video;
  const currentWholesale = product.wholesaleTiers ? product.wholesaleTiers[selectedTier] : null;

  // Product share link
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-stone-900 dark:bg-onyx border border-stone-800 dark:border-graphite shadow-luxury overflow-hidden my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all"
          aria-label="Cerrar detalles del producto"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media Preview (Video or Image) */}
        <div className="relative w-full aspect-square bg-stone-950 dark:bg-carbon">
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
                className={isBrandPlaceholder ? 'object-contain p-10' : 'object-cover'}
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
            </div>
          )}

          {/* Badges on detail photo */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-tight uppercase shadow-sm ${
                product.stock
                  ? 'bg-emerald-950/85 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-950/85 text-rose-400 border border-rose-500/30'
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
        {images.length > 1 && (
          <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar bg-stone-950/40 dark:bg-carbon/40 border-b border-stone-800/60 dark:border-graphite">
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
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="Miniatura" fill className="object-cover" />
              </button>
            ))}

            {hasVideo && (
              <button
                onClick={() => setIsVideoPlaying(true)}
                className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                  isVideoPlaying
                    ? 'border-brand-red bg-brand-red/20 text-white'
                    : 'border-stone-700 bg-carbon text-stone-400 hover:text-white'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-copper font-medium">
                Código: {product.code}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400 text-[11px]">
                    ({product.reviewsCount} reseñas)
                  </span>
                </div>
              )}
            </div>

            <h2
              id="product-detail-title"
              className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {product.title}
            </h2>
          </div>

          {/* Pricing Highlight */}
          <div className="p-3.5 rounded-xl bg-stone-950/70 dark:bg-carbon/70 border border-stone-800 dark:border-graphite flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-0.5">
                {mode === 'retail' ? 'Precio Minorista' : 'Precio Mayorista Seleccionado'}
              </span>
              <div className="text-xl sm:text-2xl font-serif font-bold text-copper">
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
                <span className="text-xs text-stone-300 font-medium block">
                  {currentWholesale?.label}
                </span>
              )}
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3 h-3" />
                Precio Final Confirmado
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-mist mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-copper" />
              <span>Confección Artesanal</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 dark:text-bone leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Dimensions & Features */}
          {product.dimensions && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-950/50 dark:bg-carbon/50 border border-stone-800/60 dark:border-graphite flex items-center gap-2">
                <Ruler className="w-4 h-4 text-copper flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Medidas</span>
                  <span className="text-white font-medium">{product.dimensions}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-950/50 dark:bg-carbon/50 border border-stone-800/60 dark:border-graphite flex items-center gap-2">
                <Layers className="w-4 h-4 text-copper flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Elaboración</span>
                  <span className="text-white font-medium">100% Hecho a mano</span>
                </div>
              </div>
            </div>
          )}

          {/* SHARE BOX REQUIREMENT */}
          <div className="p-3.5 rounded-xl bg-stone-950/90 dark:bg-carbon border border-dashed border-stone-700 dark:border-slate space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-copper" />
                <span>Compartir este producto con otros contactos</span>
              </span>
              <button
                onClick={handleNativeShare}
                className="text-[11px] text-copper hover:underline font-medium"
              >
                Compartir
              </button>
            </div>

            <p className="text-[11px] text-stone-400 dark:text-fog">
              Pegá el siguiente enlace en WhatsApp, Instagram o tus redes para mostrar este producto:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg bg-stone-900 dark:bg-onyx border border-stone-800 dark:border-graphite text-stone-300 outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-copper hover:bg-copper-dark text-white font-semibold text-xs flex items-center gap-1 transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-4 bg-stone-950/90 dark:bg-onyx border-t border-stone-800/80 dark:border-graphite flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOrderProduct(product, selectedTier);
            }}
            className="w-full py-3 px-4 rounded-xl bg-copper hover:bg-copper-dark text-white font-bold text-sm tracking-wide transition-all shadow-glow-copper flex items-center justify-center gap-2 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>+ Hacer pedido por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
