'use client';

import { useState, useEffect, useMemo } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import LoadingTransition from '../components/LoadingTransition';
import Header from '../components/Header';
import StoriesCategoryBar from '../components/StoriesCategoryBar';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import OrderModal from '../components/OrderModal';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import Toast from '../components/Toast';
import {
  BRAND_INFO,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
} from '../data/catalog';
import { Sparkles, ShoppingBag, ArrowUp } from 'lucide-react';

export default function Home() {
  const [screen, setScreen] = useState('welcome'); // 'welcome' | 'loading' | 'catalog'
  const [mode, setMode] = useState('retail'); // 'retail' | 'wholesale'
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewingProduct, setViewingProduct] = useState(null);
  const [orderingProduct, setOrderingProduct] = useState(null);
  const [selectedTier, setSelectedTier] = useState('tier3');
  const [toastMessage, setToastMessage] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Dynamic products & categories (syncs with Google Apps Script if NEXT_PUBLIC_SHEET_API_URL is configured)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Check if hash points to a product or mode in URL on mount
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#prod-')) {
        const code = hash.replace('#prod-', '');
        const found = INITIAL_PRODUCTS.find((p) => p.code.toLowerCase() === code.toLowerCase());
        if (found) {
          setScreen('catalog');
          setViewingProduct(found);
        }
      }
    } catch (e) {}

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Google Sheets sync in background
  useEffect(() => {
    const sheetApiUrl = process.env.NEXT_PUBLIC_SHEET_API_URL;
    if (sheetApiUrl) {
      fetch(sheetApiUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.products)) {
            // Merge sheet products with local media assets
            setProducts((prev) => {
              const updated = data.products.map((p) => {
                const localMatch = prev.find((lp) => lp.code === p.code);
                return {
                  ...p,
                  images: localMatch?.images || p.images || ['/brand/NellyKit.png'],
                  video: localMatch?.video || p.video || null,
                  badge: localMatch?.badge || p.badge || null,
                  rating: localMatch?.rating || 5.0,
                  reviewsCount: localMatch?.reviewsCount || 10,
                  soldCount: localMatch?.soldCount || 20,
                  dimensions: localMatch?.dimensions || 'Medidas estándar artesanales',
                };
              });
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectModeFromWelcome = (chosenMode) => {
    setMode(chosenMode);
    setScreen('loading');
  };

  const handleLoadingComplete = () => {
    setScreen('catalog');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleViewProduct = (product, tier = 'tier3') => {
    setSelectedTier(tier);
    setViewingProduct(product);
  };

  const handleOrderProduct = (product, tier = 'tier3') => {
    setSelectedTier(tier);
    setOrderingProduct(product);
  };

  const handleShareProduct = async (product) => {
    const url = `${window.location.origin}/#prod-${product.code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} - ${BRAND_INFO.name}`,
          text: `Mirá este producto artesanal de NellyKit: ${product.title}`,
          url,
        });
      } catch (err) {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      triggerToast(`Enlace copiado: ${product.title}`);
    }
  };

  // Filtered categories and products
  const productsByCategory = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.id] = products.filter((p) => p.categoryId === cat.id);
    });
    return map;
  }, [categories, products]);

  // Screen 1: Welcome Screen
  if (screen === 'welcome') {
    return <WelcomeScreen onSelectMode={handleSelectModeFromWelcome} />;
  }

  // Intermediate Screen: Microsecond Loading transition
  if (screen === 'loading') {
    return (
      <LoadingTransition
        onComplete={handleLoadingComplete}
        selectedMode={mode}
      />
    );
  }

  // Screen 2: Central Catalog Experience
  return (
    <div className="min-h-screen flex flex-col bg-obsidian text-stone-100 transition-colors animate-fade-in relative selection:bg-copper selection:text-white">
      {/* Toast Notification */}
      <Toast message={toastMessage} />

      {/* Sticky Header with Mode Switcher & Dark/Light Toggle */}
      <Header
        mode={mode}
        onToggleMode={(newMode) => {
          setMode(newMode);
          triggerToast(newMode === 'retail' ? 'Modo: Precios por menor' : 'Modo: Precios por mayor');
        }}
        onOpenWelcome={() => setScreen('welcome')}
      />

      {/* Instagram Stories Style Circular Category Bar */}
      <StoriesCategoryBar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(catId) => setActiveCategory(catId)}
      />

      {/* Mode Banner Indicator */}
      <div className="w-full bg-stone-900/60 dark:bg-carbon/50 border-b border-stone-800/60 dark:border-graphite py-2 px-4 text-center">
        <p className="text-[11px] text-stone-300 dark:text-fog font-medium">
          {mode === 'retail' ? (
            <span>
              Mostrando <strong className="text-copper">precios por menor</strong> para compra individual. ¿Querés comprar por cantidad? Cambiá arriba a <strong className="text-white">Por Mayor</strong>.
            </span>
          ) : (
            <span>
              Mostrando <strong className="text-brand-red">precios mayoristas</strong> desde 3 unidades y souvenirs para eventos.
            </span>
          )}
        </p>
      </div>

      {/* Main Catalog Body */}
      <main className="flex-1 w-full max-w-md mx-auto sm:max-w-2xl md:max-w-4xl px-3 sm:px-6 py-6 space-y-10">
        {categories.map((category) => {
          const categoryProducts = productsByCategory[category.id] || [];
          if (categoryProducts.length === 0) return null;

          // If a category filter is active and not 'all', hide others
          if (activeCategory !== 'all' && activeCategory !== category.id) {
            return null;
          }

          return (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-32 space-y-4 animate-fade-in"
            >
              {/* Category Header with Anchor */}
              <div className="flex items-center justify-between border-b border-stone-800/80 dark:border-graphite pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-copper/15 text-copper flex items-center justify-center">
                    {category.id.includes('maquillaje') ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                      {category.name}
                    </h2>
                    <p className="text-[11px] text-stone-400 dark:text-fog line-clamp-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-copper font-medium">
                  {categoryProducts.length} modelos
                </span>
              </div>

              {/* 2 PRODUCTS PER ROW GRID (MOBILE FIRST MATCHING REFERENCE DESIGN) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.code}
                    product={product}
                    mode={mode}
                    onViewProduct={handleViewProduct}
                    onOrderProduct={handleOrderProduct}
                    onShareProduct={handleShareProduct}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-40 w-10 h-10 rounded-full bg-stone-900/90 dark:bg-carbon/90 border border-stone-800 dark:border-graphite text-copper flex items-center justify-center shadow-luxury hover:scale-110 active:scale-95 transition-all"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer with Legal Requirements, Terms, Payment and About */}
      <Footer />

      {/* Cookie Consent Banner */}
      <CookieBanner />

      {/* Product Detail Modal */}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          mode={mode}
          selectedTier={selectedTier}
          onClose={() => setViewingProduct(null)}
          onOrderProduct={handleOrderProduct}
          onToast={triggerToast}
        />
      )}

      {/* WhatsApp Checkout Order Modal */}
      {orderingProduct && (
        <OrderModal
          product={orderingProduct}
          mode={mode}
          selectedTier={selectedTier}
          onClose={() => setOrderingProduct(null)}
          onToast={triggerToast}
        />
      )}
    </div>
  );
}
