'use client';

import Image from 'next/image';
import { Sparkles, ShoppingBag, Coffee } from 'lucide-react';

export default function StoriesCategoryBar({ categories, activeCategory, onSelectCategory }) {
  const getCategoryIcon = (id) => {
    if (id.includes('maquillaje') || id.includes('portacosmetico')) {
      return <Sparkles className="w-4 h-4" />;
    }
    if (id.includes('portataza') || id.includes('taza')) {
      return <Coffee className="w-4 h-4" />;
    }
    return <ShoppingBag className="w-4 h-4" />;
  };

  return (
    <section
      aria-label="Categorías de productos estilo historias"
      className="w-full border-b border-stone-200 dark:border-graphite py-3.5 bg-stone-50/90 dark:bg-obsidian/80 transition-colors"
    >
      <div className="max-w-md mx-auto sm:max-w-2xl md:max-w-4xl px-3 sm:px-6">
        <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {/* Quick "Todos" Story */}
          <button
            onClick={() => onSelectCategory('all')}
            className="flex flex-col items-center flex-shrink-0 group focus:outline-none active:scale-95 transition-transform"
            aria-label="Ver todos los productos"
          >
            <div
              className={`p-[2.5px] rounded-full transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'story-ring-active'
                  : 'bg-stone-300 dark:bg-graphite hover:border-copper'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-white dark:bg-carbon border-2 border-stone-50 dark:border-obsidian flex items-center justify-center text-copper-dark dark:text-copper font-serif font-bold text-xs group-hover:scale-105 transition-transform">
                <span>TODOS</span>
              </div>
            </div>
            <span
              className={`text-xs tracking-tight mt-1.5 transition-colors text-center ${
                activeCategory === 'all'
                  ? 'text-copper-dark dark:text-copper font-semibold'
                  : 'text-stone-600 dark:text-fog font-medium'
              }`}
            >
              Ver Todo
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(cat.id);
                  const el = document.getElementById(cat.id);
                  if (el) {
                    const yOffset = -132;
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="flex flex-col items-center flex-shrink-0 group focus:outline-none active:scale-95 transition-transform"
                aria-label={`Ver categoría ${cat.name}`}
              >
                <div
                  className={`p-[2.5px] rounded-full transition-all duration-300 ${
                    isActive ? 'story-ring-active' : 'story-ring-default group-hover:scale-105'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden relative border-2 border-stone-50 dark:border-obsidian bg-stone-100 dark:bg-carbon">
                    {cat.avatar ? (
                      <Image
                        src={cat.avatar}
                        alt={cat.name}
                        fill
                        sizes="64px"
                        className={`${
                          cat.avatar.startsWith('/brand/') ? 'object-contain p-1.5' : 'object-cover'
                        } group-hover:scale-110 transition-transform duration-300`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-copper">
                        {getCategoryIcon(cat.id)}
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs tracking-tight whitespace-nowrap transition-colors max-w-[92px] truncate text-center mt-1.5 ${
                    isActive
                      ? 'text-copper-dark dark:text-copper font-semibold'
                      : 'text-stone-600 dark:text-fog font-medium'
                  }`}
                >
                  {cat.shortName || cat.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
