'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Star, Share2, Play, Eye, ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../data/catalog';

export default function ProductCard({
  product,
  mode = 'retail', // 'retail' | 'wholesale'
  onViewProduct,
  onOrderProduct,
  onShareProduct,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wholesaleTier, setWholesaleTier] = useState('tier3'); // Default 3 unidades
  const scrollContainerRef = useRef(null);

  const images = product.images && product.images.length > 0 ? product.images : ['/brand/NellyKit.png'];
  const hasMultipleImages = images.length > 1;

  // Handle horizontal swipe inside the card
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
    const clientWidth = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth',
    });
    setActiveImageIndex(index);
  };

  // Pricing calculations
  const retailDiscountPercent =
    product.priceRetailOriginal && product.priceRetail
      ? Math.round(((product.priceRetailOriginal - product.priceRetail) / product.priceRetailOriginal) * 100)
      : null;

  const currentWholesale = product.wholesaleTiers
    ? product.wholesaleTiers[wholesaleTier] || product.wholesaleTiers.tier3
    : null;

  return (
    <article
      className="flex flex-col justify-between rounded-2xl bg-stone-900/90 dark:bg-onyx border border-stone-800/80 dark:border-graphite overflow-hidden shadow-sm hover:shadow-glow-copper transition-all duration-300 relative group"
      id={`prod-${product.code}`}
    >
      {/* Top Image & Swiper Area */}
      <div className="relative w-full aspect-square bg-stone-950 dark:bg-carbon overflow-hidden select-none">
        {/* Horizontal Swiper */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x-mandatory no-scrollbar"
        >
          {images.map((imgSrc, idx) => (
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 snap-center relative"
            >
              <Image
                src={imgSrc}
                alt={`${product.title} - Foto ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={product.code === 'C1' || product.code === 'A1'}
              />
            </div>
          ))}
        </div>

        {/* Video Available Badge */}
        {product.video && (
          <div className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-white text-white" />
            <span>VIDEO</span>
          </div>
        )}

        {/* Floating Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShareProduct(product);
          }}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label={`Compartir ${product.title}`}
          title="Compartir producto"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Top Badges (Stock & Promo) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
          {/* Stock Badge */}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase shadow-sm ${
              product.stock
                ? 'bg-emerald-950/85 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-950/85 text-rose-400 border border-rose-500/30'
            }`}
          >
            {product.stock ? 'DISPONIBLE' : 'AGOTADO'}
          </span>

          {/* Marketing Badge */}
          {product.badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-brand-red text-white shadow-glow-red">
              {product.badge}
            </span>
          )}
        </div>

        {/* Swipe Dot Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-1.5 right-2 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
            <span className="text-[9px] font-mono font-medium text-white/90">
              {activeImageIndex + 1}/{images.length}
            </span>
          </div>
        )}
      </div>

      {/* Product Content & Details */}
      <div className="p-2.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Social Proof: Rating & Sold count */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            {product.rating && product.reviewsCount ? (
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-stone-400 dark:text-ash text-[10px]">
                  ({product.reviewsCount})
                </span>
              </div>
            ) : <div />}

            {product.soldCount && product.soldCount > 0 ? (
              <span className="text-[10px] font-medium text-copper dark:text-copper-light">
                +{product.soldCount} vendidos
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug tracking-tight group-hover:text-copper transition-colors">
            {product.title}
          </h3>
          <span className="text-[10px] text-stone-400 dark:text-ash font-mono">
            Cód: {product.code}
          </span>
        </div>

        {/* Pricing Area: Retail vs Wholesale */}
        <div className="pt-1 border-t border-stone-800/60 dark:border-graphite">
          {mode === 'retail' ? (
            /* Retail Pricing */
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                {product.priceRetailOriginal && (
                  <span className="text-[11px] text-stone-400 dark:text-ash line-through font-mono">
                    {formatPrice(product.priceRetailOriginal)}
                  </span>
                )}
                {retailDiscountPercent && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1 rounded">
                    {retailDiscountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="text-base sm:text-lg font-bold font-serif text-white tracking-tight text-copper">
                {formatPrice(product.priceRetail)}
              </div>
              <span className="text-[10px] text-stone-400 dark:text-fog">
                Precio final por unidad
              </span>
            </div>
          ) : (
            /* Wholesale Pricing with Unit Selector */
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`select-tier-${product.code}`}
                className="text-[10px] font-semibold text-mist uppercase tracking-wider"
              >
                Cantidad Mayorista:
              </label>
              <select
                id={`select-tier-${product.code}`}
                value={wholesaleTier}
                onChange={(e) => setWholesaleTier(e.target.value)}
                className="w-full text-xs font-medium py-1 px-1.5 rounded-lg bg-stone-950 dark:bg-carbon border border-stone-800 dark:border-graphite text-white focus:border-copper outline-none transition-colors"
              >
                <option value="tier3">3 unidades (Default)</option>
                <option value="tier10">10 unidades</option>
                <option value="souvenir20">Souvenir 20 unidades</option>
                <option value="souvenir30">Souvenir 30 unidades</option>
                <option value="souvenirPlus">Souvenir +30 (Cotizar)</option>
              </select>

              <div className="flex items-baseline justify-between pt-0.5">
                <div className="text-sm sm:text-base font-bold font-serif text-copper">
                  {typeof currentWholesale?.total === 'number'
                    ? formatPrice(currentWholesale.total)
                    : currentWholesale?.total}
                </div>
                {typeof currentWholesale?.unitPrice === 'number' && (
                  <span className="text-[10px] font-mono text-stone-400 dark:text-ash">
                    ({formatPrice(currentWholesale.unitPrice)} c/u)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2 Action Buttons: + Ver producto & + Hacer pedido */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={() => onViewProduct(product, wholesaleTier)}
            className="w-full py-1.5 px-1 rounded-xl bg-stone-800/80 hover:bg-stone-700 dark:bg-carbon dark:hover:bg-slate border border-stone-700/60 dark:border-graphite text-stone-200 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 active:scale-95"
            aria-label={`Ver detalles de ${product.title}`}
          >
            <Eye className="w-3 h-3 text-copper" />
            <span className="truncate">+ Ver</span>
          </button>

          <button
            onClick={() => onOrderProduct(product, wholesaleTier)}
            className="w-full py-1.5 px-1 rounded-xl bg-copper hover:bg-copper-dark text-white text-[11px] font-bold transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 hover:shadow-glow-copper"
            aria-label={`Hacer pedido de ${product.title}`}
          >
            <ShoppingCart className="w-3 h-3" />
            <span className="truncate">+ Pedir</span>
          </button>
        </div>
      </div>
    </article>
  );
}
