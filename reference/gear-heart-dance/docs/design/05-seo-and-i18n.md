# 05 — SEO & i18n

## 1. 全局规则

- 每页**唯一 H1**；只用一次。
- `<title>` ≤ 60；`<meta name="description">` ≤ 160。
- 自定义 OG image：每个产品 / 案例使用自身图；其余页用 `og-default.jpg`（1200×630）。**根路由不要设 og:image**（会覆盖子路由）。
- Canonical：始终绝对 URL；分页页 `?page=2` 使用自指 canonical（不用 rel=prev/next）。
- 站点地图：`sitemap.xml` + 分片 `sitemap-products.xml`、`sitemap-content.xml`。
- `robots.txt` 禁止 `/cart`、`/checkout`、`/account/*`、`/search`。

## 2. Title / Description 模板

| 页面 | Title 模板 | Description 模板 |
|---|---|---|
| Home | `STEPMOTECH — Precision Stepper, BLDC & Servo Motors` | `Engineering-grade motion components. Ship worldwide from US/EU/CN warehouses. Datasheets, CAD, tiered pricing.` |
| Category | `{Category} — STEPMOTECH` | `Shop {Category}: {N} models, {key attrs}. CAD, datasheets, volume pricing. DHL/FedEx worldwide.` |
| PDP | `{SKU} {Name} — {KeyAttr}` | `{Name}. {Top 2 specs}. In stock {warehouse}. Tier pricing from {minPrice}.` |
| Application | `{Industry} Motion Solutions — STEPMOTECH` | — |
| Blog post | `{Title} — STEPMOTECH Blog` | first 155 chars of excerpt |

## 3. 结构化数据 (JSON-LD)

| 页面 | Schema |
|---|---|
| All | `Organization` (root) + `BreadcrumbList` |
| Home | `WebSite` + `SearchAction` |
| PDP | `Product` (含 `offers`, `aggregateRating`, `review`, `brand`, `gtin`?), `Offer` 支持 `priceSpecification` 数组（阶梯价用 `UnitPriceSpecification`） |
| Category | `CollectionPage` + `ItemList` |
| Blog post | `Article` (author, datePublished, image) |
| Case study | `Article` 或 `TechArticle` |
| FAQ / Tech FAQ | `FAQPage` |
| HowTo (Selector results, wiring tutorials) | `HowTo` |
| Contact | `LocalBusiness` (per office) |
| Career | `JobPosting` |

## 4. 价格与货币

- `Offer.price` 以默认货币（USD）。
- 多货币不写多份 Offer，使用 `priceCurrency` 与运行时检测。
- 阶梯价：
```json
"offers": {
  "@type": "Offer",
  "priceCurrency": "USD",
  "price": "19.80",
  "priceSpecification": [
    { "@type": "UnitPriceSpecification", "price": 17.82, "priceCurrency": "USD",
      "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 10 } },
    { "@type": "UnitPriceSpecification", "price": 16.83, "priceCurrency": "USD",
      "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 50 } }
  ]
}
```

## 5. i18n

- 默认语言：`en`，市场：US/CA/AU/UK 等。
- 候选语言：`de`（DACH）、`fr`、`es`。
- URL：`/`（en）、`/de/`、`/fr/`、`/es/`。
- `<html lang>`、`hreflang` 双向声明 + `x-default = en`。
- 单位与货币与语言解耦（cookie 持久），但默认映射：
  - en-US → USD / imperial
  - en-GB → GBP / metric
  - de → EUR / metric
  - fr / es → EUR / metric
- 译文工作流：以 `en` 为权威；缺译回退 en；UI 字符串放 `i18n/{lang}/common.json`、`i18n/{lang}/pdp.json` 等。

## 6. 内链策略

- Home → 一级类别 + 行业 + Selector + 最新 Resources。
- Category → 相关子类 + Top SKUs + 应用案例。
- PDP → 兼容驱动器 / 配件 / 相同应用案例 / 同族产品 / FAQ。
- Blog → 主题相关 PDP / 案例。
- Sitemap-html footer：链接到所有顶级类别与行业。

## 7. 性能 / 核心 Web Vitals 目标

| 指标 | 目标 |
|---|---|
| LCP | ≤ 2.0s (4G) |
| INP | ≤ 200ms |
| CLS | ≤ 0.05 |
| 图片 | AVIF/WebP，按需 width 服务；hero `priority` |
| 字体 | self-host woff2, `font-display: swap` |
| JS | PLP 路由 ≤ 150KB gz |

## 8. Open Graph & Social

```
og:type        website / product / article
og:title       同 <title>
og:description 同 description
og:image       1200×630
og:url         canonical
og:site_name   STEPMOTECH
twitter:card   summary_large_image
```

## 9. 受限内容

- `/account/*`、`/cart`、`/checkout`、`/quote`、`/sample`、`/search`：noindex。
- 登录后 PDP 显示企业价时，结构化数据仍使用 list price。
