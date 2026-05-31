# 99 — Handoff Checklist / 实施清单

> 给 vscode 端按此优先级落地；每项完成后打勾即可。

## Phase 0 — 基础设施（必须先做）
- [ ] Tailwind 主题接入 `02-design-system.md` 的全部 color / radius / shadow tokens；字体加载 Inter / Inter Tight / JetBrains Mono。
- [ ] 创建组件骨架 (`@C/...`)：Button / Input / Toggle / Badge / Tooltip / Toast / Skeleton / Pagination。
- [ ] Router 与 `__root.tsx` 完成 Header / Footer / NotificationBar shell。
- [ ] i18n 中间件 + 单位/货币 cookie。
- [ ] SEO helper：title/desc/og/JSON-LD 注入。

## Phase 1 — P0 交易闭环
- [ ] Home (`home.md`)
- [ ] Catalog Landing (`catalog-landing.md`)
- [ ] PLP (`category.md`) — 含 Filters / Compare drawer
- [ ] PDP (`product-detail.md`) — 含 AddToCartGroup / TierPrice / Variants / Documents
- [ ] Cart (`cart.md`)
- [ ] Checkout (`checkout-one-page.md`)
- [ ] Order Confirmation (`order-confirmation.md`)
- [ ] RFQ (`rfq-quote-request.md`)
- [ ] Sample Request (`sample-request.md`)
- [ ] Auth: Login / Register / Reset

## Phase 2 — P1 账户与选型
- [ ] Account Dashboard / Orders / Quotes / Reorder / Addresses / Company / Invoices / Lists / Downloads / Settings
- [ ] Selector Tool
- [ ] Product Compare
- [ ] Search Results
- [ ] Volume Pricing
- [ ] Custom Development

## Phase 3 — P2 内容与公司
- [ ] Solutions Index + Detail
- [ ] Blog Index + Post
- [ ] Applications Index + Detail
- [ ] Resources Hub（+ subpages：whitepapers / videos / webinars / downloads / cad / datasheet）
- [ ] Tech FAQ / Glossary
- [ ] Help Center / Contact / Shipping / Returns / After-sales
- [ ] Company：About / Factory / Certifications / Distributors / Careers / Press / Offices
- [ ] Legal × 5

## 全局验收门槛
- [ ] Lighthouse（Home / PLP / PDP / Checkout）Performance ≥ 90 mobile，A11y ≥ 95。
- [ ] 全键盘可达 + Focus ring 全程可见。
- [ ] 单位 / 货币 / 语言切换全站持久。
- [ ] 三 cart（Main / Sample / Quote）互转无数据丢失。
- [ ] 所有公开页有 title / description / og / canonical / JSON-LD（依 `05-seo-and-i18n.md`）。
- [ ] `noindex` 范围：`/cart`、`/checkout`、`/account/*`、`/quote`、`/sample`、`/search`、`/compare`。
- [ ] 错误 / 空 / 加载态全部实现（不留白屏）。
- [ ] Cookie 同意 + GDPR/CCPA 入口可用。
- [ ] 表单全部 zod 校验（前后端一致）。
- [ ] 关键转化漏斗埋点齐全（home → PDP → Cart → Order；PDP → Quote → Won）。

## 文档维护约定
- 任何 UI 调整先更新本目录对应 page md，再改代码（PR 必含 doc diff）。
- 新组件先入 `03-component-library.md`，再实现。
- 新字段先入 `04-content-model.md`，避免散落。
