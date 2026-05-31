# Product Detail (PDP) / `/p/{sku}`

## 1. 目的
让工程师 60 秒内判断"这是不是我要的"，并以最低摩擦完成 Add to Cart / Sample / Quote。

## 2. 入口
- URL：`/p/17HS19-2004S1`
- 面包屑：`Products › Stepper Motors › NEMA 17 › {SKU}`

## 3. 首屏（1440）
两栏 7 / 5：
- 左 `@C/ImageGallery`：主图 + 缩略图（含 3D/360°/视频/接线图）。
- 右 PDP Buy Box：
  - 类别面包屑微缩
  - H1 = `Name`（小标）；SKU + Copy 按钮 + Datasheet 链接
  - 5 行关键参数 mini-spec（Mono 数字）
  - `@C/VariantPicker`（按规格族切换）
  - 库存 `@C/StockBadge` + warehouse + ETA
  - 价格区：单价 + `@C/TierPriceTable`（折叠）
  - Qty stepper（默认 MOQ）+ `@C/AddToCartGroup`
  - 4 行 trust：Warranty 18mo · 30-day return · CE/RoHS/UL · CAD/STEP available
  - Share / Save to list

## 4. 模块（首屏之下）
1. **Sticky sub-nav**：Overview · Specs · CAD/Docs · Compatible · Applications · Reviews · FAQ。
2. **Overview**：长描述 Markdown + 关键特性 bullet。
3. **Specifications** — `@C/SpecTable`，分组 Electrical / Mechanical / Environmental / Feedback / Communication / Compliance；右上 `Download all specs (PDF)`、`Copy as JSON`、`Toggle units`。
4. **CAD & Documents** — `@C/DownloadList`：Datasheet (PDF) · 2D (DXF/DWG) · 3D (STEP/IGES) · Wiring · Manual · Test report · CE/UL certs。
5. **3D viewer** — `@C/CADViewer`（可后期接入）。
6. **Compatible products** — 三 tab：Drivers / Cables & Connectors / Encoders & Brackets；卡片含 "Adds compatibility check" 徽章。
7. **Used in (Applications)** — `@C/CaseStudyCard` × N。
8. **Reviews & Q&A** — 星级 + 文本 + 工程师回答；空态 `Be the first to review`。
9. **FAQ for this product** — `@C/FAQAccordion`（输出 FAQPage）。
10. **You may also like** — 同族 / 同应用产品。
11. **Recently viewed** — 由 localStorage 驱动。
12. **Trust Strip + Footer**。

## 5. 交互
- VariantPicker 切换：更新 URL 至 `?v={variantSku}`、SKU、图主图、参数、价、库存。
- 数量改变实时刷新当前阶梯与 line total；超过 MOQ 上限 → 提示 `Request volume quote`。
- 库存 `Notify me` → 邮箱 modal。
- `Add to Cart` 成功 → Mini Cart Drawer（自动 1.5s 收起）+ Toast。
- `Request Sample`：检查 `priceModel.sample.eligible`；不可拿样时灰显并 tooltip 原因。
- `Add to Quote`：弹 modal 输入 Annual volume & target price。
- CAD 下载 → 若 `loginRequired`，未登录则触发 Sign-in（保留意图，回跳后续下）。
- 复制 SKU / JSON 成功 → Toast。
- 单位切换全局生效，参数表同步。
- 移动端：Buy Box 跌入下方；首屏只显示 image + 价格 + Add to Cart sticky 底栏。

## 6. 数据契约
- `product (family)`, `defaultVariant`, `variants`, `documents`, `compatible`, `applications`, `reviewsSummary`, `relatedFAQ`。
- SSR：所有首屏 + Specs；CAD viewer 与 reviews CSR lazy。

## 7. SEO
- title：`{Name} — {SKU} | STEPMOTECH`
- description：包含 top 2 specs + warehouse + price from。
- og:image：variant.image || product.images[0]
- JSON-LD：`Product` 含 `brand`、`offers`（带阶梯）、`aggregateRating`、`review`、`gtin?`、`mpn=sku`、`additionalProperty[]`（每 spec 一条）。
- canonical：`/p/{sku}`（变体不变 canonical，使用 `?v=` 视为同一文档）。

## 8. 可访问性
- 图册有 alt（`{Name} — {SKU} side view`），可键盘切换。
- Variant picker 用 `<fieldset>`。
- Spec 表 `<table>` + `scope`。

## 9. 埋点
- `pdp_view {sku, category, variant}`
- `pdp_variant_change {from, to}`
- `pdp_add_to_cart {sku, qty, tier}`
- `pdp_add_to_sample {sku}`
- `pdp_add_to_quote {sku, annualVol, target}`
- `pdp_download {docType, sku}`
- `pdp_units_toggle {to}`

## 10. 验收
- [ ] Buy Box 在 ≥1280 一屏可见（含主操作）。
- [ ] 切换 variant 不引起页面刷新（History pushState）。
- [ ] 所有参数支持单位切换且 SEO 标记同步。
- [ ] 三个 Add 按钮的语义 / 文案 / 图标完全区分。
- [ ] 离线（无 reviews）也能渲染。
