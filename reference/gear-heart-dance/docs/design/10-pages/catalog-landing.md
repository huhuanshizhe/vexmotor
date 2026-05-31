# Catalog Landing / `/products`

## 1. 目的
让用户从总目录视图进入任意类别；替代浏览器层级菜单的"目录大全"。

## 2. 入口
- URL：`/products`
- 来源：Header `Products` 点击非 hover 的备援、Footer、SEO。
- 面包屑：`Products`

## 3. 首屏
- 标题区：H1 `Product Catalog` + 副文 `10,000+ engineering-grade SKUs across 9 categories.`
- 工具条：搜索框（仅产品库内） + 排序（A–Z / 最受欢迎）+ Industry 过滤多选。

## 4. 模块
1. **All Categories** — 大卡列表：每个一级类别一个 `@C/CategoryBlock`：图标 + 名 + 简介 + 子类标签云 + Top 3 sub-categories + `Explore →`。
2. **By Industry shortcuts** — 6 industry chips。
3. **Quick links** — CAD Library / Datasheet Library / Selector / Volume Pricing。
4. **Trust Strip + Newsletter**。

## 5. 交互
- 子类标签 hover 显示 SKU 数。
- 多选 Industry 时高亮匹配的 Category Block。

## 6. 数据
- `Category[]`（含子类、SKU 数缓存）。

## 7. SEO
- title：`Product Catalog — STEPMOTECH`
- description：列出 9 个大类。
- JSON-LD：`CollectionPage`。

## 8. A11y
- 类别块语义 `<section aria-labelledby>`。

## 9. 埋点
- `catalog_category_click {slug}`

## 10. 验收
- [ ] 与 Mega menu 类别 1:1 一致。
- [ ] 每个块都有 Explore 链接进入 PLP。
