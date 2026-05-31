# Home / 首页

## 1. 目的与目标用户
- 一句话定位：让首次来访的工程师/采购在 5 秒内理解"我们卖什么、是否专业、如何快速选型"。
- Primary goal：把流量分发到 Category / Selector / Solutions。
- Secondary goal：建立信任（认证、仓库、案例、资源）+ Newsletter 留资。
- Anti-goal：长篇品牌叙事、自动播视频、Hero 大色块装饰。

## 2. 入口路径
- URL：`/`
- 来源：搜索引擎、广告、收藏、Footer 回链。
- 面包屑：无。
- 登录：否。

## 3. 首屏（1440 / 390）
桌面：
- 顶部 NotificationBar：`Free DHL shipping on orders over $499` × 可关闭。
- Header（固定 64h）。
- Hero 左 7 / 右 5：
  - 左：H1 `Engineering-grade motion. Ready to ship worldwide.` + 副文案 + 两 CTA `Browse Catalog` (Primary) `Run Selector` (Secondary) + 4 个 trust 数字（10,000 SKUs · 3 warehouses · 24h dispatch · CE/UL/RoHS）。
  - 右：静态产品堆叠图（多种电机正面 3/4 视角，无背景）。
移动：H1 → CTA → trust 数字 → 产品图。

## 4. 模块清单
1. **NotificationBar** — `@C/NotificationBar`。空态：不显示。
2. **Hero** — 见 §3。
3. **Shop by Category 九宫格** — 3×3 卡片：Stepper / Drivers / BLDC / Servo / Gearbox / Linear / Encoder / PSU / Accessories；每卡 icon + 名 + 子类数；点击 → `/c/{slug}`。组件 `@C/CategoryTile`。
4. **Selector CTA 带** — 全宽窄条：`Not sure which motor? Use our 5-step Selector` → `/selector`。
5. **Solutions by Industry** — 横向 6 卡（3D Printing / CNC / Robotics / Medical / Semiconductor / Packaging），点击 → `/solutions/{slug}`。
6. **Featured / Best-sellers** — `@C/ProductCard grid` × 8，含 `Add to Cart`。
7. **Why STEPMOTECH** — 4 栏：In-house manufacturing · 24h dispatch from US/EU · Engineering support · Tiered & contract pricing。图标 + 短文。
8. **Trust Strip** — `@C/TrustStrip`（认证 + 物流 + 支付徽标灰度）。
9. **Latest Application / Case Studies** — 3 卡 `@C/CaseStudyCard`。
10. **From the Resources Hub** — 最新 Blog 3 + Whitepaper 1 混排。
11. **Engineering Resources strip** — 链接：CAD Library / Datasheet Library / Tech FAQ / Glossary / Wiring Diagrams。
12. **Newsletter** — Email + 行业多选 + Subscribe；隐私链接。
13. **Footer**。

## 5. 交互与状态
- Hero CTA hover：标准。
- Category tile hover：边框 `--brand-500`，icon 微动 1px。
- Newsletter：客户端校验邮箱；成功 Toast；失败保留输入。
- 加载：每个产品/案例卡显示 skeleton 3 行。

## 6. 数据契约
- `featured: Product[]`（缓存 5 min，SSR）。
- `industries: Industry[]`（静态）。
- `latestArticles: Article[]`（ISR 1h）。
- SSR：全部首屏内容。

## 7. SEO
- title：`STEPMOTECH — Precision Stepper, BLDC & Servo Motors`
- description：`Engineering-grade motion components. CAD, datasheets, tiered pricing. Ships worldwide from US/EU/CN warehouses.`
- og:image：`/og/home.jpg`（产品集合图）
- JSON-LD：`Organization` + `WebSite` + `SearchAction(/search?q={q})`
- canonical：`https://stepmotech.com/`

## 8. 可访问性
- H1 仅一个；Category tiles 用 `<ul><li><a>`；Hero 图 `alt="Stepper, BLDC and servo motors"`。

## 9. 埋点
- `home_hero_cta_click {cta}`
- `home_category_click {slug}`
- `home_selector_cta_click`
- `home_newsletter_subscribe {industries[]}`

## 10. 验收
- [ ] Hero 在 1440 一屏可见，无滚动。
- [ ] 九宫格类别命名与 Mega menu 一致。
- [ ] 所有产品卡支持直接加购物车并产生 Toast。
- [ ] Lighthouse 性能 ≥ 90 (mobile)。
