# 04 — Content Model / 数据模型

> 仅描述前端展示所需契约。后端字段可超集，UI 不依赖未列出字段。

## 1. Category

```
Category {
  id, slug, name, parentId?,
  description, heroImage?, icon,
  attributesSchema: [AttributeDef],  // 决定 PLP 筛选器
  defaultSort: 'bestseller'|'price-asc'|'price-desc'|'torque-desc',
  seo: { title, description, h1, faq?: FAQ[] }
}
```

层级最多 3：`L1 → L2 → L3`（例：Stepper Motors → NEMA 17 → 1.8°）。

## 2. AttributeDef

```
AttributeDef {
  key,                       // 'holding_torque'
  label,                     // 'Holding torque'
  unit,                      // 'N·m' (with alt 'oz·in')
  type: 'range' | 'enum' | 'bool',
  options?: string[],        // for enum
  group: 'electrical'|'mechanical'|'environmental'|'feedback'|'communication',
  filterable: boolean,
  comparable: boolean,
  sortable: boolean
}
```

## 3. Product (Family) + Variant

```
Product {
  id, sku,                   // 主 SKU = 默认 variant
  slug, name, shortDescription, longDescriptionMd,
  categoryIds: [..],
  brand: 'STEPMOTECH',
  images: [Image], video?: VideoRef, model3d?: Model3dRef,
  variants: [Variant],
  defaultVariantId,
  specs: { [attrKey]: value },   // family-level common
  compatibleWith: [ProductRef],  // drivers, encoders, cables
  bundledWith: [ProductRef],     // accessories suggestions
  applicationsTags: [string],
  documents: [Document],
  certifications: ['CE','RoHS','UL','REACH','IP65',...],
  countryOfOrigin: 'CN',
  hsCode: '8501.10.40',
  eccn?: 'EAR99',
  warrantyMonths: 18,
  faq?: FAQ[],
  reviewsSummary?: { avg, count }
}

Variant {
  id, sku, name,
  attributes: { holding_torque, length, shaft, connector, ... },
  price: PriceModel,
  stock: StockModel,
  weightKg, dimsMm,
  image?,
  documentsOverride?: [Document]
}
```

## 4. PriceModel

```
PriceModel {
  currency: 'USD'|'EUR'|'GBP'|...,
  list: number,
  tiers: [{ minQty, price }],     // 1, 10, 50, 200, 500...
  msrp?: number,
  customerPrice?: number,         // 登录后覆盖
  moq?: number,
  packSize?: number,              // 5 pcs / pack
  sample?: { eligible: bool, freight: 'paid-by-buyer'|'free', limitPerOrder: number }
}
```

## 5. StockModel

```
StockModel {
  status: 'in_stock'|'low_stock'|'lead_time'|'mto'|'oos',
  available: number,
  warehouse: 'US'|'EU'|'CN',
  leadTimeBusinessDays?: [min, max],
  nextRestockEta?: ISODate,
  backorderable: bool
}
```

## 6. Document

```
Document {
  id, type: 'datasheet'|'wiring'|'cad-2d'|'cad-3d'|'manual'|'app-note'|'certificate',
  format: 'pdf'|'step'|'dxf'|'dwg'|'iges'|'zip',
  language: 'en'|'de'|'fr',
  version, sizeBytes, url,
  loginRequired: bool
}
```

## 7. Application / Industry

```
Industry { slug, name, hero, intro, recommendedCategories, caseStudies, faq }
CaseStudy { slug, title, hero, customer?, problem, solution, productsUsed, results, downloadable? }
```

## 8. Cart 系列

```
CartLine { sku, qty, unitPrice, tierApplied?, lineTotal, notes? }
MainCart { lines, subtotal, discounts, shippingEstimate?, taxEstimate?, total, currency, promoCode? }
SampleCart { lines: SampleLine[] }
SampleLine { sku, qty (≤ sample.limit), purpose? }
QuoteCart { lines: QuoteLine[], project: ProjectInfo }
QuoteLine { sku, qty, targetUnitPrice?, annualVolume?, note? }
ProjectInfo { name, industry, targetDate?, port?, incoterm? }
```

## 9. Order / Quote / Sample

```
Order {
  id, number, createdAt, status,
  buyer, billingAddress, shippingAddress,
  lines, subtotal, discount, shipping, tax, total, currency,
  paymentMethod, paymentStatus,
  poNumber?, notes?,
  tracking: [TrackingEvent]
}
Quote {
  id, number, status, createdAt, expiresAt?,
  buyer, project, lines: QuoteLineQuoted[], terms,
  attachments, messages: ThreadMessage[]
}
QuoteLineQuoted { sku, qty, unitPriceQuoted, leadTime, notes? }
SampleOrder { id, number, status, lines, shippingAddress, freightPaid }
```

## 10. Account / Company

```
User { id, email, name, role: 'admin'|'buyer'|'engineer'|'viewer', companyId }
Company {
  id, name, registrationNo, taxId/VAT, EORI?,
  industry, size, website,
  defaultBillingAddressId, defaultShippingAddressId,
  creditApproved: bool, creditLimit?, paymentTerms: 'prepay'|'net30'|'net60',
  verifiedDocs: [DocumentRef], verificationStatus: 'pending'|'verified'|'rejected'
}
Address { id, label, company, attention, line1, line2, city, region, postalCode, country, phone }
SavedList { id, name, owner, items: { sku, qty, note? }[], sharedWith: [userId] }
```

## 11. 内容（Blog / FAQ / Glossary）

```
Article { slug, title, excerpt, cover, author, publishedAt, tags, bodyMd, related, readMin }
FAQ { id, question, answerMd, category, productTags? }
GlossaryTerm { term, definitionMd, synonyms[], related[] }
```

## 12. 单位转换约定

UI 始终成对显示主单位 + 副单位（小灰字）：
- Torque：N·m / oz·in
- Force：N / lbf
- Length：mm / in
- Voltage / Current：V / A
- Speed：rpm / steps/sec
- Weight：g / oz

切换 `pref_unit=metric|imperial`，全站持久。
