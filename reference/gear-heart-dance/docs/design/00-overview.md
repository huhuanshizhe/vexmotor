# 00 — Overview / 项目总览

> 本目录是 STEPMOTECH 海外 B2B 电机销售平台的全站 UI/UX 设计规范。所有规范以 Markdown 为唯一交付物，vscode 端 1:1 实施。

## 1. 品牌

- **品牌名**：STEPMOTECH
- **定位**：Engineering-grade motion components, ready to ship worldwide.
- **Slogan（候选）**：
  - *Precision Motion. Engineered to Ship.*
  - *Motors for engineers, by engineers.*
- **品牌人格**：精密、可信、工程师友好、像 Misumi/Digi-Key 一样"工具感"，不浮夸。
- **Logo 使用**：来源于 vexmotor.com 现有资产；如缺失矢量版，先以 wordmark `STEPMOTECH`（Inter Tight 700, tracking -0.02em）占位。

## 2. 目标用户

| 角色 | 占比预估 | 典型决策 | 关键诉求 |
|---|---|---|---|
| Design / R&D Engineer | 50% | 选型、试样、批量评估 | 精确参数表、CAD/STEP、技术 FAQ、付邮拿样 |
| Sourcing / Buyer | 25% | 比价、RFQ、合同 | 阶梯价、Lead time、税费、PO/Net30、合规文件 |
| Maintenance / MRO | 15% | 备件、替换 | 兼容性、库存、交期、文档 |
| Maker / Small business | 10% | 小额自助下单 | 透明价、Stripe/PayPal、DHL 直邮 |

主要市场：北美（US/CA）、西欧（DE/UK/FR/NL）、北欧、澳新。

## 3. 业务模式

- **B2C 式自助交易**：标品现货 → 加入 Cart → One-page Checkout → DHL/FedEx 直邮。支持阶梯价、付邮拿样、最小起订量（MOQ）。
- **B2B 询盘**：项目级 RFQ（多 SKU / 上传 BOM / 定制需求），后台报价 → Quote 状态机 → 转订单。
- **企业账户**：多收货地址、Net30 信用、税号/EORI、PO、团队成员、报价历史、再次下单、私有 BOM。

## 4. 核心 KPI（用于反推设计目标）

| 漏斗 | 指标 | 设计抓手 |
|---|---|---|
| 流量 → PDP | PDP 到达率 | 强 Selector、行业应用入口、SEO 结构化 |
| PDP → Cart/Quote/Sample | 三路转化率 | 三个 CTA 并列且语义清晰；阶梯价透明 |
| Cart → Order | Checkout 完成率 | One-page、保存进度、税运费预估、Wire/Net30 |
| 首单 → 复购 | 30/90 日复购 | Account/Reorder/Saved BOM、邮件触达 |
| RFQ → 成交 | RFQ 转化率 | Quote 状态机、报价过期、价对比 |

## 5. 设计原则（适用于全站决策）

1. **Information density first** — 工业 B2B 用户优先看参数与库存，不是大图。
2. **Three carts, one mental model** — Main Cart / Sample Cart / Quote Cart 在头部并列，图标与配色一致，避免误操作。
3. **Make every spec copyable** — 参数表、SKU、Datasheet、CAD 链接全部支持一键复制 / 下载。
4. **Stateful, never anonymous for B2B** — 登录后所有价格切换为企业价；游客可看 list price + Sign in to see net pricing。
5. **Compliance is a feature** — 关税、HS Code、EAR/ECCN、CE/RoHS/UL 必须在 PDP 与 Checkout 显式呈现。
6. **No decorative motion** — 仅功能性动效（loading、抽屉、Toast），≤200ms。

## 6. 不在本轮范围

- 后台管理（ERP/CRM/PIM）UI
- 实时汇率与税务计算引擎绑定
- 移动 App（仅响应式 Web）

## 7. 文档约定

- 所有页面规范沿用 `10-pages/_template.md` 的统一章节顺序。
- 组件引用以 `@C/ComponentName` 形式回指 `03-component-library.md`。
- 数据字段引用以 `@M/Entity.field` 形式回指 `04-content-model.md`。
- SEO 字段以 `@SEO/...` 引用 `05-seo-and-i18n.md`。
