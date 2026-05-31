# 03 — Component Library / 组件库

> 全部组件以 shadcn/Radix 为底，密度调到 compact。命名 PascalCase。规范 = Props + 状态 + 无障碍。

## A. 基础

### A1. Button `@C/Button`
Props: `variant: primary | secondary | brand | ghost | danger`, `size: sm | md | lg`, `icon?`, `loading?`, `as?`。
状态：default / hover / active / focus / disabled / loading。
A11y：`type` 默认 `button`；loading 时 `aria-busy=true`。

### A2. IconButton `@C/IconButton`
40×40 默认；必须 `aria-label`。

### A3. Input / NumberInput / SelectUnit `@C/Input`
- `NumberInput` 支持 spinner、min/max、step、单位切换。
- `SelectUnit` 右侧 dropdown 切换 mm/in、N·m/oz·in、V/A。

### A4. Combobox `@C/Combobox`
带搜索的下拉，支持多选、分组、虚拟列表（≥200 项）。

### A5. Checkbox / Radio / Switch `@C/Toggle`

### A6. Tag / Badge `@C/Badge`
变体：`stock-ok | stock-low | stock-out | lead-time | mto | new | promo | tier`。

### A7. Tooltip `@C/Tooltip`
delay 200ms；mobile 长按。

### A8. Toast `@C/Toast`
位置 bottom-right；自动 4s；error 永驻直到 dismiss。

### A9. Skeleton `@C/Skeleton`
行式 / 卡片 / 表格三套。

### A10. Pagination `@C/Pagination`
`prev / 1 2 3 … / next`；同时 page size 切换 24 / 48 / 96。

## B. 导航

### B1. Header `@C/Header`
固定，64h；含 Logo / Nav / MegaMenu 触发 / Search / Carts(3) / Account / Currency。

### B2. MegaMenu `@C/MegaMenu`
三列布局；hover/focus 触发；ESC 关闭；键盘 ↑↓→← 导航。

### B3. Breadcrumbs `@C/Breadcrumbs`
最后一级不可点击；输出 BreadcrumbList JSON-LD。

### B4. Footer `@C/Footer`
5 列 + Trust Strip + Newsletter。

### B5. NotificationBar `@C/NotificationBar`
可关闭（cookie 30 天）；用于运费促销、维护通告。

## C. 商品/目录

### C1. ProductCard `@C/ProductCard`
两形态：`grid`（240w）/ `row`（PLP row view）。
字段：image · SKU · 名称 · 关键参数（≤3）· Price · Tier price hint · Stock badge · `Add` 按钮 + `Compare` 复选框。

### C2. SpecTable `@C/SpecTable`
两栏 key/value；支持分组（Electrical / Mechanical / Environmental）；可全选复制；支持差异高亮（Compare 页）。

### C3. TierPriceTable `@C/TierPriceTable`
| Qty | Unit price | You save |
|---|---|---|
| 1–9 | $19.80 | — |
| 10–49 | $17.82 | 10% |
| 50–199 | $16.83 | 15% |
| 200+ | Request quote | — |
- 行 hover 高亮当前数量所在档；
- 当前购物车数量满足时显示 ✓。

### C4. StockBadge `@C/StockBadge`
点 + 文案 + 可选 ETA。

### C5. VariantPicker `@C/VariantPicker`
按规格族切换：Holding torque / Shaft / Length / Lead / Connector。视为产品族 + variant，URL 不变，更新 SKU & 图片。

### C6. DownloadList `@C/DownloadList`
按文件类型分组（Datasheet PDF / 2D DXF / 3D STEP / Wiring / Catalog）。文件大小、版本、语言、登录后下载（可选）。

### C7. CompareDrawer `@C/CompareDrawer`
底部抽屉，吸附；最多 4；含 `Compare`、`Clear`、`Save list`。

### C8. CompareTable `@C/CompareTable`
表头为 4 个 ProductCard；行差异自动高亮。

### C9. Selector `@C/Selector`
分步向导：Application → Mechanical → Electrical → Feedback → Results。
Result 含"Match score"+ "Why this fits"。

### C10. CADViewer `@C/CADViewer`
轻量 3D 旋转（占位/可后期接入）；附键盘控制说明；可全屏。

### C11. ImageGallery `@C/ImageGallery`
主图 + 缩略图带视频/360°；键盘可控；Lightbox。

## D. 购物 / 结算

### D1. AddToCartGroup `@C/AddToCartGroup`
四件套（PDP 主操作）：
- Qty input
- `Add to Cart`（Primary）
- `Request Sample`（Secondary）
- `Add to Quote`（Secondary）
- 下方一行：实时阶梯价提示 / MOQ 提示 / 库存 ETA

### D2. CartLine `@C/CartLine`
含 image / SKU / 名称 / Qty stepper / Unit price (含 tier 标识) / Line total / Move to (Sample/Quote) / Remove。

### D3. CartSummary `@C/CartSummary`
Subtotal / Volume discount / Estimated shipping / Estimated tax / Total。展开 Promo code、PO 号、Notes。

### D4. ShippingEstimator `@C/ShippingEstimator`
国家/邮编输入 → 显示 DHL / FedEx / UPS / Sea-LCL 时效与价。

### D5. PaymentMethodSelector `@C/PaymentMethodSelector`
Card / PayPal / Wire / Net 30(approved-only)。Net 30 仅在 `account.creditApproved=true` 显示。

### D6. AddressForm `@C/AddressForm`
含 Company / VAT / EORI / Tax ID / Attention / Phone / Country specific。地址簿 + 新增 + 默认。

### D7. CheckoutStepper `@C/CheckoutStepper`
单页结账，但提供锚点导航（Address / Shipping / Payment / Review）+ 右侧 Sticky Summary。

### D8. SampleRequestForm `@C/SampleRequestForm`
列出 SKU、数量限制、用途说明、地址、合规声明。

### D9. RFQForm `@C/RFQForm`
顶部 Project info；Line items（手填 / 导入 CSV BOM / 复制 Cart）；Target price；Annual volume；交期；港口；上传 ZIP；提交。

## E. 账户

### E1. AccountSidebar `@C/AccountSidebar`
分组：Overview / Buying / Quotes / Lists / Company / Settings。

### E2. OrderTable / QuoteTable `@C/OrderTable`
列：#编号 / 日期 / 项数 / 金额 / 状态 / Actions。

### E3. QuoteStatusBadge `@C/QuoteStatusBadge`
`Submitted | Quoted | Negotiating | Won | Lost | Expired`。

### E4. CompanyProfileCard `@C/CompanyProfileCard`
公司名/税号/EORI/资质上传/审核状态。

### E5. TeamMembersTable `@C/TeamMembersTable`
角色：Admin / Buyer / Engineer / Viewer。

## F. 内容

### F1. ArticleCard / CaseStudyCard `@C/ContentCard`
封面 / 类型徽章 / 标题 / 摘要 / 阅读时长。

### F2. ResourceFilter `@C/ResourceFilter`
按类型 / 行业 / 产品线 / 语言。

### F3. FAQAccordion `@C/FAQAccordion`
搜索 + 分类 + 折叠；输出 FAQPage JSON-LD。

### F4. GlossaryList `@C/GlossaryList`
A–Z 索引 + 搜索。

## G. 反馈与系统

### G1. EmptyState `@C/EmptyState`
图标 + 标题 + 说明 + 主 CTA。

### G2. ErrorState `@C/ErrorState`
错误码 / 简介 / 重试 / 联系支持。

### G3. Modal / Drawer / Sheet `@C/Overlay`
ESC / 遮罩点击关闭；focus trap；恢复焦点。

### G4. TrustStrip `@C/TrustStrip`
认证图标 + 文案，置 PLP/PDP/Cart/Checkout 底部。

## H. 状态机参考

### H1. Quote 状态
`Draft → Submitted → Quoted (with expiry) → (Customer) Accepted | Rejected | Counter → Negotiating → Won (Convert to Order) | Lost | Expired`

### H2. Order 状态
`Pending payment → Paid → Processing → Shipped → Delivered → Closed`；分支：`Backorder` / `Returned` / `Refunded`。

### H3. Sample 状态
`Requested → Approved → Shipped → Delivered → Feedback collected`。
