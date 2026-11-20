'use client';

import Image from 'next/image';
import { Sparkles, ShoppingBag, Coffee } from 'lucide-react';

export default function StoriesCategoryBar({ categories, activeCategory, onSelectCategory }) {
  const getCategoryIcon = (id) => {
    if (id.includes('maquillaje') || id.includes('portacosmetico')) {
      return <Sparkles className="w-3.5 h-3.5" />;
    }
    if (id.includes('portataza') || id.includes('taza')) {
      return <Coffee className="w-3.5 h-3.5" />;
    }
    return <ShoppingBag className="w-3.5 h-3.5" />;
  };

  return (
    <section
      aria-label="Categorías de productos estilo historias"
      className="w-full border-b border-stone-800/60 dark:border-graphite py-3.5 bg-stone-950/80 dark:bg-obsidian/90 backdrop-blur-md sticky top-14 z-30 transition-colors"
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {/* Quick "Todos" Story */}
          <button
            onClick={() => onSelectCategory('all')}
            className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
            aria-label="Ver todos los productos"
          >
            <div
              className={`p-[2.5px] rounded-full transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'story-ring-active'
                  : 'bg-stone-800 dark:bg-graphite hover:border-copper'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-stone-900 dark:bg-carbon border-2 border-stone-950 dark:border-obsidian flex items-center justify-center text-copper font-serif font-bold text-xs group-hover:scale-105 transition-transform">
                <span>TODOS</span>
              </div>
            </div>
            <span
              className={`text-[11px] font-medium tracking-tight mt-1.5 transition-colors text-center ${
                activeCategory === 'all' ? 'text-copper font-semibold' : 'text-stone-400 dark:text-fog'
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
                    const yOffset = -120;
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
                aria-label={`Ver categoría ${cat.name}`}
              >
                <div
                  className={`p-[2.5px] rounded-full transition-all duration-300 ${
                    isActive ? 'story-ring-active' : 'story-ring-default group-hover:scale-105'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-stone-950 dark:border-obsidian bg-stone-900 dark:bg-carbon">
                    {cat.avatar ? (
                      <Image
                        src={cat.avatar}
                        alt={cat.name}
                        fill
                        sizes="56px"
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

                <div className="flex items-center gap-1 mt-1.5">
                  <span
                    className={`text-[11px] font-medium tracking-tight whitespace-nowrap transition-colors max-w-[80px] truncate text-center ${
                      isActive ? 'text-copper font-semibold' : 'text-stone-400 dark:text-fog'
                    }`}
                  >
                    {cat.shortName || cat.name}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
