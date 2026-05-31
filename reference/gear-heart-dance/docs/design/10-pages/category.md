# Category (PLP) / `/c/{category-slug}`

## 1. 目的
工程师快速筛选 + 对比 + 添加到 Cart/Sample/Quote；密度优先。

## 2. 入口
- URL：`/c/stepper-motors`、`/c/stepper-motors/nema-17`
- 面包屑：`Products › Stepper Motors › NEMA 17`
- 登录：否（登录后显示企业价）。

## 3. 首屏
- Hero band（紧凑 120h）：H1 `{Category}` · 简介一句 · KPI（SKU 数 · 起售价 · Lead time 范围）· `Open Selector for this category`。
- 子类 chips（横向）：`All · 0.9° · 1.8° · 5-phase · Hollow-shaft · IP65 · Closed-loop`。
- 工具条：sort · view (grid|row) · per-page · in-stock-only · compare-mode toggle。

## 4. 模块
1. **左侧 Filters**（粘性，桌面）— `@C/FilterPanel`：
   - 内嵌搜索 `Search within {category}`。
   - 关键属性（每个 attribute 都来自 `category.attributesSchema`）：
     - Frame size (enum)
     - Step angle (enum)
     - Phase (enum)
     - Holding torque (range, 单位切换)
     - Rated current (range)
     - Rated voltage (range)
     - Body length (range)
     - Shaft (enum: single / dual / hollow / lead screw)
     - Connector (enum)
     - Feedback (enum: open-loop / encoder / closed-loop)
     - Communication (enum: STEP/DIR / EtherCAT / CANopen / Modbus)
     - Protection (enum: IP20 / IP54 / IP65)
     - Certifications (multi)
     - Warehouse (multi: US / EU / CN)
     - Lead time (range)
     - Price (range)
   - 已选筛选：顶部 chips，可单个清除 / `Clear all`。
   - 移动：底部按钮 `Filters (3)` → 全屏 Sheet。
2. **主区 Product List** — 视图二选一：
   - **Grid (default)** — 卡片 240w，4 列；
   - **Row (table-like)** — 列：图 · SKU · 关键 5 参数 · Stock · Price (含 tier hint) · `+ Cart` `Compare`。
3. **Compare Drawer** — `@C/CompareDrawer`（最多 4）。
4. **Pagination** + page size 24/48/96。
5. **Subcategory cards**（仅一级 PLP 显示）：3×N 子类块。
6. **SEO content block**（底部）：H2 + 200 字文案 + FAQ 折叠（输出 FAQPage）。
7. **Trust Strip**。

## 5. 交互
- 筛选实时（debounce 300ms）；URL 同步（`?holding_torque=0.2-1.5&phase=2`）。
- 单位切换在筛选与卡片同步。
- 行视图支持键盘 ↑↓ 选行，`c` 加入对比，`Enter` 进入 PDP。
- `Add to Cart` 默认数量 = MOQ；点击后 Toast `Added · View cart` + 当前数量是否达成下一阶梯提示。
- 价格区显示：`from $14.20` + `View tiers ↓` 弹出 `@C/TierPriceTable` 浮层。
- 排序选项：Bestseller / Price asc/desc / Holding torque desc / Newest / Lead time asc。
- Empty state：`No SKUs match. Try widening {topFilter}` + `Reset filters`。

## 6. 数据契约
- `category, breadcrumb, subcategories, attributesSchema, results: { items: Product[], total, facets }`
- SSR：首屏；其余 hydrate 后 CSR。
- URL 完整反映筛选 → 可分享。

## 7. SEO
- title：`{Category} — STEPMOTECH`
- description：列出关键参数范围、SKU 数。
- canonical：去除 sort/page，保留 filter。
- 分页：`?page=2` 自指 canonical。
- JSON-LD：`CollectionPage` + `ItemList` (top 24)。

## 8. A11y
- Filters `<fieldset legend>`；slider 含 `aria-valuemin/max/now`。
- Grid/Row 切换 `aria-pressed`。

## 9. 埋点
- `plp_filter_apply {key, value}`
- `plp_compare_add {sku}`
- `plp_add_to_cart {sku, qty}`
- `plp_view_change {grid|row}`

## 10. 验收
- [ ] 任意筛选可通过 URL 重现。
- [ ] 单位切换覆盖筛选与展示，全站持久。
- [ ] 比较抽屉跨页保留（sessionStorage）。
- [ ] Lighthouse a11y ≥ 95。
