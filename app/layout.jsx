import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { BRAND_INFO } from '../data/catalog';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata = {
  metadataBase: new URL('https://nellykit-ecommerce.vercel.app'),
  title: `${BRAND_INFO.name} | Tienda Online Artesanal - Bolsos, Portamaquillajes y Portatazas`,
  description:
    'Tienda online oficial de NellyKit. Productos confeccionados 100% a mano con amor: estuches de maquillaje, portacosméticos, bolsos diarios y portatazas. Venta por menor, mayor y souvenirs.',
  keywords: [
    'NellyKit',
    'artesanías',
    'hecho a mano',
    'portamaquillaje',
    'neceser',
    'bolsos diarios',
    'portatazas',
    'souvenirs',
    'compra por mayor',
    'Argentina',
  ],
  authors: [{ name: 'Nelly' }],
  creator: 'NellyKit',
  publisher: 'NellyKit',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://nellykit-ecommerce.vercel.app',
    title: `${BRAND_INFO.name} | ${BRAND_INFO.tagline}`,
    description:
      'Descubrí portamaquillajes, bolsos diarios y portatazas hechos a mano con dedicación. Precios por menor, mayor y souvenirs para eventos.',
    siteName: BRAND_INFO.name,
    images: [
      {
        url: '/brand/NellyKit.png',
        width: 800,
        height: 600,
        alt: `${BRAND_INFO.name} Logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_INFO.name} | Artesanías Hechas a Mano`,
    description: 'Catálogo online con precios minoristas y mayoristas directos por WhatsApp.',
    images: ['/brand/NellyKit.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#08080a' },
    { media: '(prefers-color-scheme: light)', color: '#faf9f6' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: BRAND_INFO.name,
  description: BRAND_INFO.tagline,
  image: 'https://nellykit-ecommerce.vercel.app/brand/NellyKit.png',
  telephone: BRAND_INFO.whatsapp,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Buenos Aires',
    addressCountry: 'AR',
  },
  paymentAccepted: 'Transferencia bancaria, Mercado Pago',
  currenciesAccepted: 'ARS',
  makesOffer: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: 'Portamaquillajes Artesanales',
        description: 'Estuches y portacosméticos confeccionados a mano',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: 'Bolsos Diarios Hechos a Mano',
        description: 'Bolsos amplios y confortables para todos los días',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: 'Portatazas Artesanales',
        description: 'Portatazas confeccionados 100% a mano ideales para regalar o souvenirs',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('nellykit-theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-copper selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
