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

function normalizeComparableText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function buildRecentSummary(item: RecentProduct) {
  const description = item.shortDescription?.trim();

  if (description && normalizeComparableText(description) !== normalizeComparableText(item.name)) {
    return description;
  }

  return item.purchaseMode === 'buy'
    ? 'Saved to your comparison trail for a fast return to pricing, drawings and documents.'
    : 'Saved to your shortlist so the RFQ flow and engineering files stay one click away.';
}

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
  const [items, setItems] = useState<RecentProduct[]>(fallbackProducts.map(toRecentProduct).filter((item) => item.id !== currentProduct.id).slice(0, 3));

  useEffect(() => {
    const stored = readRecentlyViewed();
    const nextStored = [toRecentProduct(currentProduct), ...stored.filter((item) => item.id !== currentProduct.id)].slice(0, 8);

    window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(nextStored));

    const visibleItems = nextStored.filter((item) => item.id !== currentProduct.id).slice(0, 3);
    if (visibleItems.length) {
      setItems(visibleItems);
      return;
    }

    setItems(fallbackProducts.map(toRecentProduct).filter((item) => item.id !== currentProduct.id).slice(0, 3));
  }, [currentProduct, fallbackProducts]);

  if (!items.length) {
    return null;
  }

  return (
    <article className="info-card detail-panel-card detail-recent-card detail-shortlist-card">
      <div className="detail-panel-heading">
        <div className="detail-panel-copy">
          <span className="card-kicker">Shortlist trail</span>
          <h2 className="detail-panel-title">Recently viewed products from this session.</h2>
        </div>
        <div className="detail-panel-badges">
          <span className="detail-panel-badge">{items.length} items</span>
        </div>
      </div>

      <div className="detail-shortlist-list">
        {items.map((item) => (
          <Link key={item.id} href={withLocalePath(`/products/${item.slug}`, locale)} className="detail-shortlist-item">
            <div className="detail-shortlist-meta">
              <span className="product-meta">SKU {item.sku}</span>
              <span className="detail-shortlist-price">{item.purchaseMode === 'buy' ? item.price.formatted : 'Request Quote'}</span>
            </div>
            <strong>{item.name}</strong>
            <p className="section-description compact-copy">{buildRecentSummary(item)}</p>
            <span className="card-kicker">{item.purchaseMode === 'buy' ? 'Direct buy ready' : 'RFQ workflow'}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}