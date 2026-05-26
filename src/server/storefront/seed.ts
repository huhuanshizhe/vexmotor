import type { HomeData, ProductListResult, StorefrontCategory, StorefrontProductDetail } from './types';

function money(amount: number) {
  return {
    currency: 'USD',
    amount,
    formatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount),
  };
}

const categories: StorefrontCategory[] = [
  {
    id: 'cat-1',
    name: 'Nema 17 Stepper Motor',
    slug: 'nema-17-stepper-motor',
    description: 'Compact high-volume motion component family for printers, feeders, and automation fixtures.',
    productCount: 59,
  },
  {
    id: 'cat-2',
    name: 'Nema 23 Stepper Motor',
    slug: 'nema-23-stepper-motor',
    description: 'Higher torque catalog products for CNC systems and industrial tooling.',
    productCount: 35,
  },
  {
    id: 'cat-3',
    name: 'Stepper Drivers',
    slug: 'stepper-drivers',
    description: 'Controller and drive modules for production-ready motion systems.',
    productCount: 12,
  },
  {
    id: 'cat-4',
    name: 'Power Supplies',
    slug: 'power-supplies',
    description: 'Matched power systems for stable driver and motor performance.',
    productCount: 10,
  },
];

const products: StorefrontProductDetail[] = [
  {
    id: 'prod-1',
    name: '17 Single Shaft Bipolar Stepper Motor, 45N·cm Torque',
    slug: '17-single-shaft-bipolar-stepper-motor-45ncm',
    sku: 'VXM-17-45NCM',
    shortDescription: '1.8° step angle, 1.5A current, 40mm body, 4-wire.',
    description:
      'A catalog-ready Nema 17 motor targeted at compact automation cells, 3D printing assemblies, and precision feeders that need stable torque with repeatable performance.',
    coverImage: {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80',
      alt: 'Industrial stepper motor close-up',
      width: 1200,
      height: 800,
    },
    gallery: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80',
        alt: 'Industrial stepper motor close-up',
        width: 1200,
        height: 800,
      },
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80',
        alt: 'Motor detail and housing',
        width: 1200,
        height: 800,
      },
    ],
    price: money(23.9),
    compareAtPrice: money(27.5),
    purchaseMode: 'buy',
    inStock: true,
    stockQuantity: 186,
    brand: {
      id: 'brand-1',
      name: 'Lianchuan Motion',
      slug: 'lianchuan-motion',
    },
    categories: [categories[0]],
    attributes: [
      { group: 'Body Length', value: '40mm' },
      { group: 'Current', value: '1.5A' },
      { group: 'Wiring', value: '4-Wire' },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Specification Sheet',
        url: 'https://example.com/spec/vxm-17-45ncm.pdf',
        mimeType: 'application/pdf',
      },
    ],
    relatedProducts: [],
    seoTitle: 'Nema 17 Bipolar Stepper Motor 45Ncm Torque',
    seoDescription: 'Buy a Nema 17 industrial stepper motor with 45Ncm torque and 1.5A rated current.',
    features: [
      { key: 'Torque', value: '45', unit: 'N·cm' },
      { key: 'Current', value: '1.5', unit: 'A' },
      { key: 'Step Angle', value: '1.8', unit: '°' },
    ],
  },
  {
    id: 'prod-2',
    name: '23 Stepper Motor, 240N·cm Torque, 82mm Body',
    slug: '23-stepper-motor-240ncm',
    sku: 'VXM-23-240NCM',
    shortDescription: '4A current, 82mm body, industrial torque profile for CNC and tooling.',
    description:
      'High-torque Nema 23 motor designed for larger industrial axes, tooling automation, and higher load applications.',
    coverImage: {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      alt: 'Industrial automation assembly',
      width: 1200,
      height: 800,
    },
    gallery: [
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        alt: 'Industrial automation assembly',
        width: 1200,
        height: 800,
      },
    ],
    price: money(68.5),
    compareAtPrice: null,
    purchaseMode: 'buy',
    inStock: true,
    stockQuantity: 62,
    brand: {
      id: 'brand-1',
      name: 'Lianchuan Motion',
      slug: 'lianchuan-motion',
    },
    categories: [categories[1]],
    attributes: [
      { group: 'Body Length', value: '82mm' },
      { group: 'Current', value: '4A' },
      { group: 'Wiring', value: '4-Wire' },
    ],
    attachments: [],
    relatedProducts: [],
    seoTitle: 'Nema 23 Stepper Motor 240Ncm Torque',
    seoDescription: 'Industrial Nema 23 stepper motor for CNC and automation projects.',
    features: [
      { key: 'Torque', value: '240', unit: 'N·cm' },
      { key: 'Current', value: '4', unit: 'A' },
    ],
  },
  {
    id: 'prod-3',
    name: 'Integrated Motion Assembly for OEM Projects',
    slug: 'integrated-motion-assembly-oem',
    sku: 'VXM-OEM-ASM',
    shortDescription: 'Custom-configured assembly with engineering review and OEM quotation workflow.',
    description:
      'A quotation-led configurable motion assembly sold through RFQ rather than instant checkout, suitable for custom industrial projects.',
    coverImage: {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
      alt: 'Precision engineering prototype',
      width: 1200,
      height: 800,
    },
    gallery: [
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
        alt: 'Precision engineering prototype',
        width: 1200,
        height: 800,
      },
    ],
    price: money(0),
    compareAtPrice: null,
    purchaseMode: 'inquiry',
    inStock: true,
    stockQuantity: 0,
    brand: {
      id: 'brand-1',
      name: 'Lianchuan Motion',
      slug: 'lianchuan-motion',
    },
    categories: [categories[2]],
    attributes: [{ group: 'Sales Model', value: 'Custom RFQ' }],
    attachments: [],
    relatedProducts: [],
    seoTitle: 'OEM Motion Assembly RFQ',
    seoDescription: 'Submit an inquiry for a custom integrated motion assembly.',
    features: [{ key: 'Workflow', value: 'Inquiry-first' }],
  },
];

for (const product of products) {
  product.relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 2).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    sku: item.sku,
    shortDescription: item.shortDescription,
    coverImage: item.coverImage,
    price: item.price,
    compareAtPrice: item.compareAtPrice,
    purchaseMode: item.purchaseMode,
    inStock: item.inStock,
    brand: item.brand,
  }));
}

export function getSeedHomeData(): HomeData {
  return {
    heroBanners: [
      {
        id: 'hero-1',
        eyebrow: 'Precision Motion Components',
        title: 'Stepper motors and drivers for modern automation lines.',
        description:
          'Industrial-grade motion systems designed for CNC, robotics, medical devices, and smart manufacturing teams that need stable torque and predictable lead times.',
        primaryAction: { label: 'Browse Product Series', href: '/products' },
        secondaryAction: { label: 'Request a Quote', href: '/contact' },
      },
    ],
    featuredCategories: categories,
    hotSale: products.slice(0, 3).map(toCard),
    newRelease: [...products].reverse().map(toCard),
    featuredIndustries: [
      { title: 'Industrial Automation', description: 'Precision motion control for assembly lines, fixtures, and automated material handling.' },
      { title: 'Medical Devices', description: 'Quiet and consistent stepping performance for diagnostics and controlled delivery systems.' },
      { title: '3D Printing', description: 'Stable microstepping and repeatable positioning for fine layer deposition.' },
      { title: 'Robotics', description: 'Multi-axis actuation for robotic joints, feeders, and adaptive motion modules.' },
    ],
    testimonials: [
      { author: 'Global OEM Buyer', quote: 'The catalog structure and RFQ path make this storefront suitable for both repeat orders and custom sourcing.' },
      { author: 'Automation Integrator', quote: 'Industrial content blocks help engineers qualify products faster than a generic store layout.' },
    ],
    trustHighlights: [
      'Free shipping and duties on orders over $299',
      '30-day return support for standard catalog items',
      'Secure payment support for major global cards',
      'Fast technical support during business hours',
    ],
  };
}

export function getSeedCategories() {
  return categories;
}

export function getSeedProductsResult(input?: { keyword?: string; categorySlug?: string; page?: number; pageSize?: number }): ProductListResult {
  const page = input?.page ?? 1;
  const pageSize = input?.pageSize ?? 12;
  let filtered = [...products];

  if (input?.keyword) {
    const keyword = input.keyword.toLowerCase();
    filtered = filtered.filter((item) =>
      [item.name, item.sku, item.shortDescription, item.description].filter(Boolean).join(' ').toLowerCase().includes(keyword),
    );
  }

  if (input?.categorySlug) {
    filtered = filtered.filter((item) => item.categories.some((category) => category.slug === input.categorySlug));
  }

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize).map(toCard);

  return {
    items,
    meta: {
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    },
    facets: [
      {
        key: 'purchaseMode',
        label: 'Purchase Mode',
        options: [
          { label: 'Direct Buy', value: 'buy', count: filtered.filter((item) => item.purchaseMode === 'buy').length },
          { label: 'Inquiry', value: 'inquiry', count: filtered.filter((item) => item.purchaseMode === 'inquiry').length },
        ],
      },
    ],
  };
}

export function getSeedProductBySlug(slug: string) {
  return products.find((item) => item.slug === slug) ?? null;
}

function toCard(item: StorefrontProductDetail) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    sku: item.sku,
    shortDescription: item.shortDescription,
    coverImage: item.coverImage,
    price: item.price,
    compareAtPrice: item.compareAtPrice,
    purchaseMode: item.purchaseMode,
    inStock: item.inStock,
    brand: item.brand,
  };
}
