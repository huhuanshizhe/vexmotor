export type StorefrontImage = {
  id: string;
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
};

export type StorefrontBrand = {
  id: string;
  name: string;
  slug: string;
  logo?: StorefrontImage | null;
};

export type StorefrontCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: StorefrontImage | null;
  parentId?: string | null;
  productCount?: number;
};

export type StorefrontProductCard = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  coverImage?: StorefrontImage | null;
  price: {
    currency: string;
    amount: number;
    formatted: string;
  };
  compareAtPrice?: {
    currency: string;
    amount: number;
    formatted: string;
  } | null;
  purchaseMode: 'buy' | 'inquiry';
  inStock: boolean;
  brand?: StorefrontBrand | null;
};

export type StorefrontFeature = {
  key: string;
  value: string;
  unit?: string | null;
};

export type StorefrontAttachment = {
  id: string;
  name: string;
  url: string;
  mimeType: string;
};

export type StorefrontProductDetail = StorefrontProductCard & {
  description: string;
  gallery: StorefrontImage[];
  categories: StorefrontCategory[];
  attributes: Array<{ group: string; value: string }>;
  attachments: StorefrontAttachment[];
  relatedProducts: StorefrontProductCard[];
  stockQuantity: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  features: StorefrontFeature[];
};

export type ProductListResult = {
  items: StorefrontProductCard[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  facets: Array<{ key: string; label: string; options: Array<{ label: string; value: string; count: number }> }>;
};

export type HomeData = {
  heroBanners: Array<{
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: { label: string; href: string };
    secondaryAction: { label: string; href: string };
  }>;
  featuredCategories: StorefrontCategory[];
  hotSale: StorefrontProductCard[];
  newRelease: StorefrontProductCard[];
  featuredIndustries: Array<{ title: string; description: string }>;
  testimonials: Array<{ author: string; quote: string }>;
  trustHighlights: string[];
};
