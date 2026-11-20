'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Star, Share2, Play, Eye, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../data/catalog';

export default function ProductCard({
  product,
  mode = 'retail', // 'retail' | 'wholesale'
  onViewProduct,
  onOrderProduct,
  onShareProduct,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wholesaleTier, setWholesaleTier] = useState('tier3');
  const scrollContainerRef = useRef(null);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['/brand/NellyKit-logo-blanco.png'];
  const hasMultipleImages = images.length > 1;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== activeImageIndex && newIndex >= 0 && newIndex < images.length) {
        setActiveImageIndex(newIndex);
      }
    }
  };

  const scrollToImage = (index) => {
    if (!scrollContainerRef.current) return;
    const clamped = (index + images.length) % images.length;
    const clientWidth = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollTo({
      left: clamped * clientWidth,
      behavior: 'smooth',
    });
    setActiveImageIndex(clamped);
  };

  const retailDiscountPercent =
    product.priceRetailOriginal && product.priceRetail
      ? Math.round(((product.priceRetailOriginal - product.priceRetail) / product.priceRetailOriginal) * 100)
      : null;

  const currentWholesale = product.wholesaleTiers
    ? product.wholesaleTiers[wholesaleTier] || product.wholesaleTiers.tier3
    : null;

  const openDetail = () => onViewProduct(product, wholesaleTier);

  return (
    <article
      className="flex flex-col justify-between rounded-2xl bg-white dark:bg-onyx border border-stone-200 dark:border-graphite overflow-hidden shadow-luxury-light dark:shadow-sm hover:shadow-glow-copper transition-all duration-300 relative group"
      id={`prod-${product.code}`}
    >
      {/* Top Image & Swiper Area (Tappable to open details) */}
      <div
        onClick={openDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDetail();
          }
        }}
        aria-label={`Ver detalles de ${product.title}`}
        className="relative w-full aspect-square bg-stone-100 dark:bg-carbon overflow-hidden select-none cursor-pointer"
      >
        {/* Horizontal Swiper */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x-mandatory no-scrollbar"
        >
          {images.map((imgSrc, idx) => {
            const isBrandPlaceholder = imgSrc.startsWith('/brand/');
            return (
              <div
                key={idx}
                className="w-full h-full flex-shrink-0 snap-center relative bg-stone-900/5 dark:bg-carbon"
              >
                <Image
                  src={imgSrc}
                  alt={`${product.title} - Foto ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className={`${
                    isBrandPlaceholder ? 'object-contain p-6 bg-stone-950' : 'object-cover'
                  } transition-transform duration-500 group-hover:scale-105`}
                  priority={product.code === 'C1' || product.code === 'A1'}
                />
              </div>
            );
          })}
        </div>

        {/* Desktop Hover Prev/Next Arrows */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToImage(activeImageIndex - 1);
              }}
              className="hidden sm:flex opacity-0 group-hover:opacity-100 absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/55 hover:bg-black/80 text-white items-center justify-center transition-opacity"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToImage(activeImageIndex + 1);
              }}
              className="hidden sm:flex opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/55 hover:bg-black/80 text-white items-center justify-center transition-opacity"
              aria-label="Siguiente foto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top-Left Badge (Promo or Out of Stock only for cleaner photos) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {!product.stock ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase shadow-sm bg-rose-950/90 text-rose-300 border border-rose-500/40">
              AGOTADO
            </span>
          ) : product.badge ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-brand-red text-white shadow-glow-red">
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Floating Share Button (32x32 tap target) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShareProduct(product);
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label={`Compartir ${product.title}`}
          title="Compartir producto"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Video Available Badge */}
        {product.video && (
          <div className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
            <Play className="w-2.5 h-2.5 fill-white text-white" />
            <span>VIDEO</span>
          </div>
        )}

        {/* Brand Placeholder Badge */}
        {!product.video && images[activeImageIndex]?.startsWith('/brand/') && (
          <div className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-copper/30 text-copper text-[9px] font-semibold uppercase tracking-wide pointer-events-none">
            Foto próximamente
          </div>
        )}

        {/* Bottom-Center Swipe Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-black/45 backdrop-blur-sm px-1.5 py-1 rounded-full pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`rounded-full transition-all ${
                  activeImageIndex === idx
                    ? 'w-2.5 h-1.5 bg-copper'
                    : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom-Right Numeric Counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 right-2 z-10 hidden sm:flex items-center bg-black/55 backdrop-blur-sm px-1.5 py-0.5 rounded-full pointer-events-none">
            <span className="text-[9px] font-mono font-medium text-white/90">
              {activeImageIndex + 1}/{images.length}
            </span>
          </div>
        )}
      </div>

      {/* Product Content & Details */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Social Proof: Rating & Sold count */}
          <div className="flex items-center justify-between text-[11px] mb-1 gap-1">
            {product.rating && product.reviewsCount ? (
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-semibold">
                <Star className="w-3 h-3 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-stone-400 dark:text-ash text-[10px]">
                  ({product.reviewsCount})
                </span>
              </div>
            ) : (
              <div />
            )}

            {product.soldCount && product.soldCount > 0 ? (
              <span className="text-[10px] font-medium text-copper-dark dark:text-copper-light truncate">
                +{product.soldCount} vendidos
              </span>
            ) : null}
          </div>

          {/* Tappable Title */}
          <button
            type="button"
            onClick={openDetail}
            className="text-left w-full focus:outline-none group/title"
          >
            <h3 className="text-[13px] sm:text-sm font-semibold text-stone-900 dark:text-white line-clamp-2 leading-snug tracking-tight group-hover/title:text-copper-dark dark:group-hover/title:text-copper transition-colors">
              {product.title}
            </h3>
          </button>

          {/* Code + Inline Availability Indicator */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-stone-500 dark:text-ash font-mono">
              Cód: {product.code}
            </span>
            <span className="text-stone-300 dark:text-graphite">·</span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                product.stock
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.stock ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              {product.stock ? 'Disponible' : 'Agotado'}
            </span>
          </div>
        </div>

        {/* Pricing Area: Retail vs Wholesale */}
        <div className="pt-1.5 border-t border-stone-100 dark:border-graphite">
          {mode === 'retail' ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                {product.priceRetailOriginal && (
                  <span className="text-[11px] text-stone-400 dark:text-ash line-through font-mono">
                    {formatPrice(product.priceRetailOriginal)}
                  </span>
                )}
                {retailDiscountPercent && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                    {retailDiscountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="text-base sm:text-lg font-bold font-serif text-copper-dark dark:text-copper tracking-tight">
                {formatPrice(product.priceRetail)}
              </div>
              <span className="text-[10px] text-stone-500 dark:text-fog">
                Precio final por unidad
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`select-tier-${product.code}`}
                className="text-[10px] font-semibold text-stone-600 dark:text-mist uppercase tracking-wider"
              >
                Cantidad Mayorista:
              </label>
              <select
                id={`select-tier-${product.code}`}
                value={wholesaleTier}
                onChange={(e) => setWholesaleTier(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full min-h-[38px] text-[13px] font-medium py-1.5 px-2 rounded-lg bg-stone-50 dark:bg-carbon border border-stone-200 dark:border-graphite text-stone-900 dark:text-white focus:border-copper outline-none transition-colors"
              >
                <option value="tier3">3 unidades (Default)</option>
                <option value="tier10">10 unidades</option>
                <option value="souvenir20">Souvenir 20 unidades</option>
                <option value="souvenir30">Souvenir 30 unidades</option>
                <option value="souvenirPlus">Souvenir +30 (Cotizar)</option>
              </select>

              <div className="flex items-baseline justify-between pt-0.5 flex-wrap gap-1">
                <div className="text-sm sm:text-base font-bold font-serif text-copper-dark dark:text-copper">
                  {typeof currentWholesale?.total === 'number'
                    ? formatPrice(currentWholesale.total)
                    : currentWholesale?.total}
                </div>
                {typeof currentWholesale?.unitPrice === 'number' && (
                  <span className="text-[10px] font-mono text-stone-500 dark:text-ash">
                    ({formatPrice(currentWholesale.unitPrice)} c/u)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2 Action Buttons: + Ver & + Pedir (40px touch height) */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={openDetail}
            className="w-full min-h-[40px] py-2 px-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-carbon dark:hover:bg-slate border border-stone-200 dark:border-graphite text-stone-800 dark:text-stone-200 text-xs font-semibold transition-all flex items-center justify-center gap-1 active:scale-95"
            aria-label={`Ver detalles de ${product.title}`}
          >
            <Eye className="w-3.5 h-3.5 text-copper-dark dark:text-copper flex-shrink-0" />
            <span className="truncate">+ Ver</span>
          </button>

          <button
            type="button"
            onClick={() => onOrderProduct(product, wholesaleTier)}
            className="w-full min-h-[40px] py-2 px-1.5 rounded-xl bg-copper hover:bg-copper-dark text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 hover:shadow-glow-copper"
            aria-label={`Hacer pedido de ${product.title}`}
          >
            <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">+ Pedir</span>
          </button>
        </div>
      </div>
    </article>
  );
}
