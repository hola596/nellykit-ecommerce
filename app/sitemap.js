import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/catalog';

export default function sitemap() {
  const baseUrl = 'https://nellykit-ecommerce.vercel.app';

  const productUrls = INITIAL_PRODUCTS.map((p) => ({
    url: `${baseUrl}/#prod-${p.code}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryUrls = INITIAL_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/#${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
