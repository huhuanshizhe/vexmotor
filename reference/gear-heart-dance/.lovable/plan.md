
# STEPMOTECH — 全站 UI/UX 设计规范交付计划

## 0. 交付物总览

在仓库新增 `docs/design/` 目录，按下列结构产出 Markdown 设计规范（不写任何前端代码）。所有文件使用统一术语表、组件库引用与 SEO 字段规范，vscode 可据此 1:1 实现。

```
docs/design/
├── 00-overview.md                  品牌定位、目标用户、业务模式、KPI
├── 01-information-architecture.md  站点地图、URL 规范、导航/页脚结构、面包屑
├── 02-design-system.md             色彩/字体/间距/圆角/阴影/栅格/图标/Motion
├── 03-component-library.md         所有可复用组件的 props/状态/无障碍规范
├── 04-content-model.md             产品/分类/属性/文档/案例/博客的数据模型
├── 05-seo-and-i18n.md              SEO 元数据约定、hreflang、结构化数据
├── 10-pages/                       页面级规范（每页一份）
│   ├── home.md
│   ├── catalog-landing.md          (Shop by Category)
│   ├── category.md                 (PLP，带筛选/对比)
│   ├── product-detail.md           (PDP，含参数表/CAD/阶梯价/配套件)
│   ├── product-compare.md
│   ├── selector-tool.md            (电机选型向导)
│   ├── search-results.md
│   ├── cart.md
│   ├── checkout-one-page.md        (含付邮拿样、MOQ、阶梯价、税号、PO)
│   ├── order-confirmation.md
│   ├── rfq-quote-request.md        (B2B 询盘，上传图纸/BOM)
│   ├── sample-request.md           (付邮拿样专用流)
│   ├── custom-development.md       (定制电机需求收集)
│   ├── volume-pricing.md           (阶梯价说明 + 申请大客户价)
│   ├── account/
│   │   ├── dashboard.md
│   │   ├── orders.md
│   │   ├── quotes.md                (询盘/报价单管理)
│   │   ├── reorder.md
│   │   ├── addresses.md             (多收货地址)
│   │   ├── company-profile.md       (税号/VAT/资质/团队成员)
│   │   ├── invoices.md
│   │   ├── saved-lists.md           (BOM/项目清单)
│   │   ├── downloads.md             (已购产品 CAD/手册)
│   │   └── settings.md
│   ├── auth/
│   │   ├── login.md
│   │   ├── register-business.md     (企业注册，资质审核)
│   │   └── password-reset.md
│   ├── content/
│   │   ├── blog-index.md
│   │   ├── blog-post.md
│   │   ├── applications-index.md    (行业应用)
│   │   ├── application-detail.md    (案例)
│   │   ├── resources-hub.md         (白皮书/视频/Webinar)
│   │   ├── tech-faq.md              (技术 FAQ，可搜索)
│   │   └── glossary.md
│   ├── support/
│   │   ├── contact.md
│   │   ├── help-center.md           (订单/物流/退换/支付)
│   │   ├── shipping-customs.md      (海外物流与关税)
│   │   ├── returns-warranty.md
│   │   └── after-sales.md
│   ├── company/
│   │   ├── about.md
│   │   ├── factory-qc.md            (工厂/产能/QC)
│   │   ├── certifications.md        (CE/RoHS/ISO/UL)
│   │   ├── distributors.md
│   │   ├── careers.md
│   │   ├── press.md
│   │   └── contact-offices.md
│   └── legal/
│       ├── terms.md
│       ├── privacy.md
│       ├── cookies.md
│       ├── ip-policy.md
│       └── export-compliance.md     (EAR/ECCN/受限国家)
└── 99-handoff-checklist.md          vscode 实现优先级与验收清单
```

## 1. 每份页面规范的统一模板

每个 page 文件按下列固定章节，避免 vscode 实施时遗漏：

1. **页面目的与目标用户** — 一句话定位，主目标 / 次目标 / 反目标
2. **入口路径** — 来源页面、来源 CTA、URL、面包屑
3. **首屏（Above the fold）** — 元素清单、内容示例、移动端取舍
4. **模块清单（自上而下）** — 每模块：用途、字段、组件引用（指向 03-component-library.md）、空/加载/错误态、移动端断点行为
5. **交互与状态** — 关键交互（hover/筛选/分页/对比/加车/请求样品/提交询盘）、表单校验规则、Toast/Modal/Drawer
6. **数据契约** — 该页所需字段（指向 04-content-model.md），是否需要登录、是否 SSR
7. **SEO** — title / description / og / 结构化数据（Product / BreadcrumbList / FAQPage / Article…）、canonical
8. **可访问性** — 标题层级、键盘流、ARIA、对比度
9. **埋点事件** — 事件名、属性
10. **验收标准** — Acceptance checklist

## 2. 信息架构（关键决策预告）

- **主导航**：Products（按类别 mega menu）｜ Solutions（按行业）｜ Selector ｜ Resources ｜ Support ｜ Company ｜ 右侧：Search / Quote Cart / Sample Cart / Account / 货币与语言
- **双购物车并行**：Sample Cart（付邮拿样，限 SKU/数量）与 Quote Cart（RFQ 批量询价），常规小额采购走主 Cart → One-page Checkout
- **URL 规范**：`/c/{category-slug}`、`/p/{sku}`、`/applications/{slug}`、`/blog/{slug}`、`/resources/{type}/{slug}`、`/account/...`
- **页脚 5 列**：Products｜Solutions｜Resources｜Company｜Support + 法务/认证/支付/物流图标条 + Newsletter
- **多语言**：英语为主，预留 DE/FR/ES 的 hreflang 与 URL 子目录 `/de/` 结构

## 3. 设计系统（视觉气质）

延续您选择的"工程精密型"，在 02-design-system.md 中固化：

- **色彩**：深工业蓝 `#0B2B4E` 主色 + 精密橙 `#FF6A1A` 强调（用于价格/CTA/在库状态）+ 中性灰阶 9 级 + 语义色（success/warning/danger/info）+ 状态色（in-stock / low / lead-time / made-to-order）
- **字体**：标题 Inter Tight / 正文 Inter / 数字与参数 JetBrains Mono（参数表对齐用等宽）
- **栅格**：12 栏，1280/1440/1680 三档，密度优先（参数表行高 36px）
- **组件密度**：默认 compact，PDP 与 PLP 强调表格化对比
- **图标**：Lucide + 自制电机/驱动器/接口轮廓图标集
- **Motion**：克制（150–200ms 缓动），筛选/抽屉/Tab 切换无炫技动画

## 4. 关键页面要点（在文档中将完整展开）

- **Home**：Hero + 类别九宫格 + Selector 入口 + 行业应用走马 + 资质条 + 最新资源 + Newsletter
- **PLP**：左侧多维筛选（机型/步距角/相数/扭矩/电压/电流/法兰/轴径/编码器/认证/库存/Lead time）+ 顶部对比栏 + 行式/卡片视图切换 + 阶梯价提示徽章
- **PDP**：图册 + 360°/3D + 参数表（按规格族切换 variant）+ 阶梯价表 + 库存与交期 + Add to Cart / Request Sample / Add to Quote / Add to BOM + CAD/STEP/PDF/接线图下载 + 配套驱动器/线缆/支架 + 兼容性矩阵 + 应用案例 + FAQ + 评价
- **Selector Tool**：分步向导（应用 → 负载/转速/电压 → 安装 → 反馈 → 结果列表与对比）
- **Cart**：行项目编辑、阶梯价实时计算、MOQ 提示、税与运费预估、HS Code 提示、转 RFQ 入口
- **One-page Checkout**：地址 / 配送（DHL/FedEx/UPS/海运拼柜）/ 支付（Card、Wire、PayPal、净 30 信用）/ 税号 VAT/EORI / PO 号 / 评论 + 右侧订单摘要常驻
- **RFQ**：项目名、行项目（手填或导入 CSV/BOM）、目标价、年用量、交期、目的港、上传图纸 zip、合规声明
- **Sample Request**：限项、付邮规则、签收要求、转化为正式订单链路
- **Account/Quotes**：报价单状态机（Submitted → Quoted → Negotiating → Won/Lost → Convert to Order）

## 5. 工作方法

1. 先抓取 vexmotor.com 提取 STEPMOTECH 现有品牌资产（logo/色/口号），抓取 stepperonline.com 复刻其产品分类树与属性集，作为 `04-content-model.md` 的基础
2. 按上述目录一次性生成全部 Markdown
3. 在 `99-handoff-checklist.md` 给出实施优先级（P0：导航/PDP/PLP/Cart/Checkout/RFQ；P1：账户中心/Selector；P2：内容/法务/Company）
4. 不修改任何 src/ 代码；仅产出 docs

## 6. 与您确认的默认决策（如不同意请告知）

- 仅英文版上线，预留多语言结构
- 货币默认 USD，支持 EUR/GBP 切换（仅显示，不做汇率结算）
- 支付仅做 UI 规范，不绑定具体网关（vscode 后续接入 Stripe/Paddle 或自有）
- 不做 ERP/CRM 集成的 UI（如需，单列一份附录）

确认后我将在下一轮（build 模式）一次性生成 `docs/design/` 下全部文件。
