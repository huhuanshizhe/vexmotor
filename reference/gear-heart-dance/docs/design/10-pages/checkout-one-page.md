# One-page Checkout / `/checkout`

## 1. 目的
最少滚动完成下单；同时支持 guest / 企业 PO / Net30。

## 2. 入口
- URL：`/checkout`
- 来源：Cart `Proceed to Checkout`。
- 登录：可选；强烈推荐 Sign in 复用地址簿。

## 3. 首屏（1440）
- 顶部 mini-header：Logo + `Secure checkout` + 客服电话 + Steps 锚点（Address · Shipping · Payment · Review）。
- 两栏 8 / 4：
  - 左：所有 Sections。
  - 右：Sticky Order Summary（Lines 折叠 / Subtotal / Discount / Shipping / Tax / Total / Promo / PO）。

## 4. 模块（自上而下）
1. **Account state bar**：未登录 → `Sign in for saved addresses` + `Continue as guest`。
2. **Contact**：Email + 电话 + `Subscribe to engineering updates`。
3. **Shipping address** — `@C/AddressForm`：含 Company、Attention、VAT/EORI/Tax ID（按国家显示）、`Save to address book`。地址簿用户可选已有。
4. **Billing address** — 默认同上 / 不同时展开。
5. **Shipping method**：DHL Express · FedEx Priority · UPS Worldwide · Sea-LCL · Pickup（如有海外仓自提）。显时效 + 价。
6. **Customs & compliance**：HS code 自动 / Incoterm 选择（DDP 默认 / DAP / EXW，按国家限制）+ "I confirm not for restricted end-use" 勾选（受 EAR/ECCN 提醒）。
7. **Payment** — `@C/PaymentMethodSelector`：
   - Card (Stripe Elements 占位)
   - PayPal
   - Wire transfer（提交订单后显示银行信息）
   - Net 30（仅 `creditApproved` 显示，须 PO 必填）
8. **Order options**：PO Number · Required delivery date · Notes for warehouse。
9. **Review & Place order**：终态摘要 + 法律确认 + `Place order` Primary。
10. **Trust Strip 底部**。

## 5. 交互
- 每节完成 → 状态点变绿；点击锚点跳转。
- 地址国家变化 → 字段集联动（VAT 仅 EU；EORI 仅出口到 EU）。
- 切换货币锁定为下单货币（顶部 disabled，附 tooltip）。
- 表单错误：聚焦首个错误字段并滚动。
- 失败的支付：保留所有数据，显示原因。
- 移动端：单列 + 底部 sticky `Place order $XXX`。

## 6. 数据契约
- `cart, addresses, shippingOptions, taxEstimate, customer (if logged), paymentMethods (filtered by company.creditApproved)`
- SSR 否（私有）。

## 7. SEO
- noindex。

## 8. A11y
- 每步 `<section aria-labelledby>`；表单字段错误 `aria-describedby`。
- `Place order` 在加载时 `aria-busy`。

## 9. 埋点
- `checkout_start`、`checkout_step_complete {step}`、`shipping_method_select`、`payment_method_select`、`order_place_attempt`、`order_place_success {orderId, value}`、`order_place_fail {reason}`。

## 10. 验收
- [ ] Net30 仅对资质企业显示。
- [ ] 缺税号时给清晰阻塞提示。
- [ ] 价格、运费、税、总价与 Cart 一致。
- [ ] 支付失败可重试不丢数据。
