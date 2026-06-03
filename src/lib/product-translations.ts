/**
 * Product translation utilities
 * Handles loading and caching product translations from database
 */

import { type Locale, DEFAULT_LOCALE } from '@/lib/i18n';

// Product translation cache (in production, this would be Redis or DB)
const productTranslationCache = new Map<string, ProductTranslation>();

export type ProductTranslation = {
  productId: string;
  locale: Locale;
  name?: string;
  shortDescription?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

/**
 * Get product translation for a specific locale
 * Falls back to default locale (English) if translation not found
 */
export async function getProductTranslation(
  productId: string,
  locale: Locale,
  fallback = true
): Promise<ProductTranslation | null> {
  const cacheKey = `${productId}_${locale}`;
  
  // Check cache first
  const cached = productTranslationCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // In production, this would query the database:
    // const translation = await db.query.productTranslations.findFirst({
    //   where: (t, { eq, and }) => and(eq(t.productId, productId), eq(t.locale, locale)),
    // });
    
    // For now, return null (will use English fallback)
    const translation = null;
    
    if (translation) {
      productTranslationCache.set(cacheKey, translation);
      return translation;
    }
    
    // Fallback to default locale
    if (fallback && locale !== DEFAULT_LOCALE) {
      return getProductTranslation(productId, DEFAULT_LOCALE, false);
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to load product translation for ${productId} (${locale}):`, error);
    return null;
  }
}

/**
 * Get localized product name
 */
export async function getLocalizedProductName(
  product: { id: string; name: string },
  locale: Locale
): Promise<string> {
  const translation = await getProductTranslation(product.id, locale);
  return translation?.name || product.name;
}

/**
 * Get localized product description
 */
export async function getLocalizedProductDescription(
  product: { id: string; description?: string | null },
  locale: Locale
): Promise<string | null> {
  const translation = await getProductTranslation(product.id, locale);
  return translation?.description || product.description || null;
}

/**
 * Bulk load product translations for efficiency
 */
export async function getProductTranslations(
  productIds: string[],
  locale: Locale
): Promise<Map<string, ProductTranslation>> {
  const results = new Map<string, ProductTranslation>();
  
  // Load in parallel
  const promises = productIds.map(async (id) => {
    const translation = await getProductTranslation(id, locale);
    if (translation) {
      results.set(id, translation);
    }
  });
  
  await Promise.all(promises);
  return results;
}

/**
 * Clear translation cache (useful after admin updates)
 */
export function clearProductTranslationCache(productId?: string) {
  if (productId) {
    // Clear specific product
    for (const locale of ['en', 'de', 'fr', 'es']) {
      productTranslationCache.delete(`${productId}_${locale}`);
    }
  } else {
    // Clear all
    productTranslationCache.clear();
  }
}

/**
 * Preload translations for better performance
 */
export async function preloadProductTranslations(
  productIds: string[],
  locales: Locale[] = ['en', 'de', 'fr', 'es']
) {
  const promises = locales.flatMap((locale) =>
    productIds.map((id) => getProductTranslation(id, locale))
  );
  
  await Promise.all(promises);
}
