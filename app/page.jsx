'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Sparkles, ShoppingBag, Coffee, ArrowUp } from 'lucide-react';

function formatSheetTitle(rawTitle, categoryId, localMatch) {
  let cleaned = String(rawTitle || '').trim();
  if (!cleaned) return localMatch?.title || '';

  cleaned = cleaned
    .replace(/\bcorcilar\b/gi, 'circular')
    .replace(/\blisto negro\b/gi, 'liso negro');

  if (categoryId === 'portatazas' && !/portataza/i.test(cleaned)) {
    cleaned = `Portataza ${cleaned}`;
  }

  return cleaned || localMatch?.title || String(rawTitle || '');
}

function formatSheetDescription(rawDesc, categoryId, code, localMatch) {
  let cleaned = String(rawDesc || '')
    .trim()
    .replace(/^["“”]+|["“”]+$/g, '')
    .replace(/(^|\s)Lo creí(?=$|[\s.,!?;:])/gi, '$1Lo creé')
    .trim();

  if (!cleaned) {
    return localMatch?.description || '';
  }

  if (categoryId === 'portatazas' && /este bolso/i.test(cleaned) && localMatch?.description) {
    return localMatch.description;
  }

  if (String(code || '').toUpperCase() === 'A3' && /bolso con bolsillo/i.test(cleaned) && localMatch?.description) {
    return localMatch.description;
  }

  return cleaned;
}

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

  const [sheetApiUrl, setSheetApiUrl] = useState('');

  // Load configured sheet URL from env or localStorage
  useEffect(() => {
    try {
      const stored = (
        localStorage.getItem('nellykit_sheet_api_url') ||
        process.env.NEXT_PUBLIC_SHEET_API_URL ||
        ''
      ).trim();
      if (stored) {
        setSheetApiUrl(stored);
      }
    } catch (e) {}
  }, []);

  // Sync function that fetches live data from Google Sheet silently in background
  const syncWithSheet = useCallback(async (urlToFetch) => {
    const targetUrl = String(urlToFetch || '').trim();
    if (!targetUrl) return;

    try {
      const res = await fetch(targetUrl);
      const data = await res.json();

      if (data && data.success && Array.isArray(data.products)) {
        // Sync Categories if new sheets were added
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(
            data.categories.map((c) => {
              const localCat = INITIAL_CATEGORIES.find((ic) => ic.id === c.id);
              return {
                id: c.id,
                name: c.name,
                shortName: localCat?.shortName || c.name,
                avatar: localCat?.avatar || '/brand/NellyKit-logo-blanco.png',
                description: localCat?.description || `Colección artesanal de ${c.name}`,
              };
            })
          );
        }

        // Sync Products (updates prices, stock, titles, wholesale tiers in real time)
        setProducts((prev) => {
          return data.products.map((p) => {
            const codeUpper = String(p.code || '').toLowerCase();
            const localMatch = prev.find((lp) => lp.code.toLowerCase() === codeUpper);
            const retailPrice = Number(p.priceRetail) || localMatch?.priceRetail || 8000;
            return {
              ...localMatch,
              ...p,
              title: formatSheetTitle(p.title, p.categoryId, localMatch),
              description: formatSheetDescription(p.description, p.categoryId, p.code, localMatch),
              priceRetail: retailPrice,
              priceRetailOriginal: localMatch?.priceRetailOriginal || Math.round(retailPrice * 1.18),
              images: localMatch?.images || ['/brand/NellyKit-logo-blanco.png'],
              video: localMatch?.video || null,
              badge: localMatch?.badge || (p.stock ? 'NUEVO' : null),
              rating: localMatch?.rating || 5.0,
              reviewsCount: localMatch?.reviewsCount || 10,
              soldCount: localMatch?.soldCount || 15,
              dimensions: localMatch?.dimensions || 'Medidas artesanales a medida',
              wholesaleTiers: p.wholesaleTiers || localMatch?.wholesaleTiers,
            };
          });
        });
      }
    } catch (err) {
      // Keep local fallback catalog silently if network/endpoint fails
    }
  }, []);

  useEffect(() => {
    if (sheetApiUrl) {
      syncWithSheet(sheetApiUrl);
    }
  }, [sheetApiUrl, syncWithSheet]);

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
    <div className="min-h-[100dvh] flex flex-col bg-[#faf9f6] text-stone-900 dark:bg-obsidian dark:text-stone-100 transition-colors animate-fade-in relative selection:bg-copper selection:text-white">
      {/* Toast Notification */}
      <Toast message={toastMessage} />

      {/* Sticky Header with Protagonist Logo, Mode Switcher & Dark/Light Toggle */}
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
      <div className="w-full bg-stone-100/90 dark:bg-carbon/60 border-b border-stone-200 dark:border-graphite py-2 px-4 text-center">
        <p className="text-[11px] sm:text-xs text-stone-600 dark:text-fog font-medium">
          {mode === 'retail' ? (
            <span>
              Mostrando <strong className="text-copper-dark dark:text-copper">precios por menor</strong> para compra individual. ¿Querés comprar por cantidad? Cambiá arriba a <strong className="text-stone-900 dark:text-white">Por Mayor</strong>.
            </span>
          ) : (
            <span>
              Mostrando <strong className="text-brand-red">precios mayoristas</strong> desde 3 unidades y souvenirs para eventos.
            </span>
          )}
        </p>
      </div>

      {/* Main Catalog Body */}
      <main className="flex-1 w-full max-w-md mx-auto sm:max-w-2xl md:max-w-4xl px-3 sm:px-6 py-5 sm:py-6 space-y-8 sm:space-y-10">
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
              className="scroll-mt-36 space-y-4 animate-fade-in"
            >
              {/* Category Header with Anchor */}
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-graphite pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-copper/15 text-copper-dark dark:text-copper flex items-center justify-center flex-shrink-0">
                    {category.id.includes('maquillaje') ? (
                      <Sparkles className="w-4 h-4" />
                    ) : category.id.includes('portataza') ? (
                      <Coffee className="w-4 h-4" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-white tracking-tight">
                      {category.name}
                    </h2>
                    <p className="text-[11px] text-stone-600 dark:text-fog line-clamp-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-copper-dark dark:text-copper font-semibold flex-shrink-0">
                  {categoryProducts.length} modelos
                </span>
              </div>

              {/* 2 PRODUCTS PER ROW GRID (MOBILE FIRST) */}
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
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 w-11 h-11 rounded-full bg-white/95 dark:bg-carbon/95 border border-stone-200 dark:border-graphite text-copper-dark dark:text-copper flex items-center justify-center shadow-luxury-light dark:shadow-luxury hover:scale-110 active:scale-95 transition-all"
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
          onSelectTier={setSelectedTier}
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
