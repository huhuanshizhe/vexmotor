'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { Locale } from '@/lib/i18n';
import { withLocalePath } from '@/lib/i18n';
import type { StorefrontProductCard } from '@/server/storefront';

const RECENTLY_VIEWED_STORAGE_KEY = 'vexmotor-recently-viewed-products';

type RecentProduct = Pick<StorefrontProductCard, 'id' | 'name' | 'slug' | 'sku' | 'price' | 'purchaseMode' | 'shortDescription'>;

type RecentlyViewedProductsProps = {
  currentProduct: StorefrontProductCard;
  fallbackProducts: StorefrontProductCard[];
  locale: Locale;
};

function toRecentProduct(product: StorefrontProductCard): RecentProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: product.price,
    purchaseMode: product.purchaseMode,
    shortDescription: product.shortDescription,
  };
}

function readRecentlyViewed() {
  if (typeof window === 'undefined') {
    return [] as RecentProduct[];
  }

  const stored = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
  if (!stored) {
    return [] as RecentProduct[];
  }

  try {
    const parsed = JSON.parse(stored) as RecentProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as RecentProduct[];
  }
}

export function RecentlyViewedProducts({ currentProduct, fallbackProducts, locale }: RecentlyViewedProductsProps) {
  const [items, setItems] = useState<RecentProduct[]>(fallbackProducts.map(toRecentProduct).filter((item) => item.id !== currentProduct.id).slice(0, 4));

  useEffect(() => {
    const stored = readRecentlyViewed();
    const nextStored = [toRecentProduct(currentProduct), ...stored.filter((item) => item.id !== currentProduct.id)].slice(0, 8);

    window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(nextStored));

    const visibleItems = nextStored.filter((item) => item.id !== currentProduct.id).slice(0, 4);
    if (visibleItems.length) {
      setItems(visibleItems);
      return;
    }

    setItems(fallbackProducts.map(toRecentProduct).filter((item) => item.id !== currentProduct.id).slice(0, 4));
  }, [currentProduct, fallbackProducts]);

  if (!items.length) {
    return null;
  }

  return (
    <article className="info-card detail-recent-card">
      <div className="section-header detail-section-header">
        <div>
          <h2 className="section-title">Recently viewed</h2>
          <p className="section-description">Keep fast access to the products you checked while comparing motion families and accessories.</p>
        </div>
      </div>

      <div className="detail-related-grid">
        {items.map((item) => (
          <Link key={item.id} href={withLocalePath(`/products/${item.slug}`, locale)} className="detail-related-card">
            <span className="product-badge">Recently viewed</span>
            <strong>{item.name}</strong>
            <span className="product-meta">SKU {item.sku}</span>
            <p className="section-description compact-copy">{item.shortDescription ?? 'Stored locally from your latest product-detail browsing session.'}</p>
            <span className="card-kicker">{item.purchaseMode === 'buy' ? item.price.formatted : 'Request Quote'}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}