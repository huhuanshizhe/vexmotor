# 01 — Information Architecture / 信息架构

## 1. 站点地图

```
/
├── /products                       Catalog Landing（按类别九宫格）
│   └── /c/{category-slug}          PLP（含子类）
│       └── /p/{sku}                PDP
├── /compare?skus=...               Product Compare（最多 4）
├── /selector                       Motor Selector Tool（向导）
├── /search?q=...                   Search Results
│
├── /solutions                      Solutions Landing（按行业）
│   └── /solutions/{industry}       行业页（含推荐选型 + 案例）
│
├── /applications                   Applications Index（案例库）
│   └── /applications/{slug}        Case Study
│
├── /resources                      Resources Hub
│   ├── /resources/whitepapers
│   ├── /resources/videos
│   ├── /resources/webinars
│   └── /resources/downloads
│
├── /blog
│   └── /blog/{slug}
│
├── /tech-faq                       Technical FAQ（可搜索）
├── /glossary                       术语表
│
├── /quote                          RFQ Quote Request
├── /sample                         Sample Request
├── /custom                         Custom Development
├── /volume-pricing                 Tiered & Contract Pricing
│
├── /cart                           Main Cart
├── /checkout                       One-page Checkout
├── /order/{id}                     Order Confirmation
│
├── /account
│   ├── /account                    Dashboard
│   ├── /account/orders
│   │   └── /account/orders/{id}
│   ├── /account/quotes
│   │   └── /account/quotes/{id}
│   ├── /account/reorder
│   ├── /account/addresses
│   ├── /account/company
│   ├── /account/invoices
│   ├── /account/lists              Saved Lists / BOM
│   │   └── /account/lists/{id}
│   ├── /account/downloads
│   ├── /account/team               (Admin only)
│   └── /account/settings
│
├── /login
├── /register                       Business Registration
├── /password-reset
│
├── /support
│   ├── /support                    Help Center
│   ├── /support/contact
│   ├── /support/shipping           Shipping & Customs
│   ├── /support/returns
│   └── /support/after-sales
│
├── /company
│   ├── /about
│   ├── /factory                    Factory & QC
│   ├── /certifications
│   ├── /distributors
│   ├── /careers
│   ├── /press
│   └── /offices
│
└── /legal
    ├── /legal/terms
    ├── /legal/privacy
    ├── /legal/cookies
    ├── /legal/ip
    └── /legal/export-compliance
```

## 2. URL 规范

- 全部小写、连字符分隔，无 trailing slash。
- 类别：`/c/stepper-motors`、`/c/stepper-motors/nema-17`（最多 3 级）。
- 产品：`/p/{sku}`，SKU 为权威标识；slug 仅做附加 `?n=slug` 显示。
- 多语言：默认无前缀 = en；其他 `/de/`、`/fr/`、`/es/` 子目录；hreflang 双向声明（详见 `05-seo-and-i18n.md`）。
- 货币与单位：通过 cookie `pref_currency`、`pref_unit` 控制，不写入 URL。
- 站内搜索：`/search?q=...&c=...&in_stock=1`。
- UTM：保留参数透传到 Cart/Checkout 完成事件。

## 3. 主导航（顶部 Header）

```
[Logo]  Products ▾   Solutions ▾   Selector   Resources ▾   Support   Company ▾
                                                                                 [🔍] [📋 Quote(2)] [📦 Sample(1)] [🛒 Cart(3)] [Sign in] [🇺🇸 USD ▾]
```

### Products mega menu（按类别）

| 左列：大类 | 中列：子类 | 右列：精选 SKU / 入口 |
|---|---|---|
| Stepper Motors | NEMA 8 / 11 / 14 / 17 / 23 / 24 / 34 / 42 · Linear · Geared · IP65 · Closed-loop · Hollow-shaft | Bestsellers · New · CAD library |
| Stepper Drivers | Open-frame · Closed-loop · Integrated · Programmable · EtherCAT/CANopen | Selector → Driver compatibility |
| BLDC Motors & Drivers | Frame size · Voltage · Hall/Encoder · Integrated | — |
| Servo Motors & Drivers | AC Servo · DC Servo · Frame · Power | — |
| Gear Motors / Gearboxes | Planetary · Spur · Worm · Harmonic | — |
| Linear Motion | Lead screw · Ball screw · External/Captive/Non-captive linear stepper · Linear actuators | — |
| Encoders & Sensors | Incremental · Absolute · Magnetic · Optical | — |
| Power Supplies | Switching · DIN-rail · Regulated | — |
| Accessories | Couplings · Brackets · Cables · Connectors · Heatsinks | — |
| Kits & Bundles | 3D printer · CNC · Robotics · Education | — |

### Solutions（按行业）
3D Printing · CNC & Machine Tools · Robotics & Cobots · Medical & Lab Automation · Semiconductor · Packaging · Textile · Photonics · Aerospace · Automotive Test · Renewable Energy · Education & Research.

### Resources
Blog · Application Notes · Whitepapers · Videos · Webinars · CAD Library · Datasheet Library · Tech FAQ · Glossary · Newsletter.

### Support
Help Center · Contact · Shipping & Customs · Returns & Warranty · After-sales · Order Status.

### Company
About · Factory & QC · Certifications · Distributors · Careers · Press · Offices.

## 4. 头部右侧元素

- **Search**：全站搜索，键盘 `/` 聚焦，含产品 / 资源 / FAQ tabs。
- **Quote Cart**：RFQ 待提交列表，徽标显示项数。
- **Sample Cart**：付邮拿样列表，与 Main Cart 独立结算流程。
- **Main Cart**：常规购物车。
- **Account**：未登录显示 `Sign in / Register`；登录后显示头像 + 公司名。
- **Currency / Language**：USD/EUR/GBP/CAD/AUD + en/de/fr/es。

## 5. 面包屑规则

- 第二级及更深的所有页面必须有面包屑。
- 形如：`Products › Stepper Motors › NEMA 17 › 17HS19-2004S1`。
- 面包屑同时输出 `BreadcrumbList` 结构化数据（@SEO）。

## 6. 页脚（Footer）

5 列 + 底栏：

```
Products            Solutions         Resources          Company            Support
- Stepper Motors    - 3D Printing     - Blog             - About            - Help Center
- Drivers           - CNC             - App Notes        - Factory & QC     - Contact
- BLDC / Servo      - Robotics        - Whitepapers      - Certifications   - Shipping
- Gearboxes         - Medical         - Webinars         - Distributors     - Returns
- Linear Motion     - Semiconductor   - CAD Library      - Careers          - After-sales
- Encoders          - Packaging       - Tech FAQ         - Press            - Order Status
- Power Supplies    - Aerospace       - Glossary         - Offices          - Volume Pricing
- Accessories       - Education       - Newsletter       - Press kit        - Request Sample

[Trust strip]  ISO 9001 · CE · RoHS · UL · REACH · EAR99
[Payment]       Visa / Mastercard / Amex / PayPal / Wire / Net 30 (approved)
[Shipping]      DHL · FedEx · UPS · TNT · Sea-freight LCL/FCL
[Newsletter]    Email input → subscribe (Resources)

Legal: © 2025 STEPMOTECH · Terms · Privacy · Cookies · IP Policy · Export Compliance
Country/Currency selector  ·  Switch to Distributor Portal
```

## 7. 全局组件出现位置

| 组件 | Header | Hero | PLP | PDP | Cart | Checkout | Account | Content |
|---|---|---|---|---|---|---|---|---|
| Search bar | ✅ | — | — | — | — | — | — | ✅ |
| Mega menu | ✅ | — | — | — | — | — | — | — |
| Compare drawer | — | — | ✅ | ✅ | — | — | — | — |
| Cart drawer | ✅ | — | — | (mini) | — | — | — | — |
| Sample drawer | ✅ | — | — | (mini) | — | — | — | — |
| Quote drawer | ✅ | — | — | (mini) | — | — | — | — |
| Notification bar | ✅ (top) | — | — | — | — | — | — | — |
| Trust strip | — | — | ✅ | ✅ | ✅ | ✅ | — | ✅ |

## 8. 关键转化路径

1. **小额自助**：Home → Selector / PLP → PDP → Add to Cart → Checkout → Order
2. **样品拿样**：PDP → Add to Sample → Sample Cart → Sample Request → Confirmation
3. **批量询盘**：PDP / PLP → Add to Quote → Quote Cart → RFQ Form → Submit → Quote 状态机
4. **企业采购**：Register Business → Approved → Net30 → 同 1，但 Checkout 显 PO / Net30 选项
5. **内容沉淀**：Blog / Application → 内链相关产品 → PDP

## 9. 三个购物车的边界

| 维度 | Main Cart | Sample Cart | Quote Cart |
|---|---|---|---|
| 目标 | 立即结算 | 申请样品（付邮 or 免费） | 批量询价 |
| 数量 | 任意 | ≤ Sample policy 限额 | 任意 |
| 价格 | 实时阶梯价 | 仅运费 / 0 | 报价后显示 |
| 收尾 | Checkout 付款 | Sample Request 表单 | RFQ 表单 |
| 状态 | Order | Sample Order | Quote → 可转 Order |

任意时间允许将一个 cart 的 item 整体 / 单项 **Move to** 其他 cart。
