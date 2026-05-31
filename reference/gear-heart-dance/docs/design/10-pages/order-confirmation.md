# Order Confirmation / `/order/{id}`

## 1. 目的
确认下单成功、给出后续指引、推动账号注册。

## 2. 入口
- URL：`/order/{id}`（仅当 session 持有 token 或登录）。
- 来源：Checkout 成功跳转、订单邮件链接。

## 3. 首屏
- 大成功图标 + H1 `Thank you, {Name}. Order {#number} received.`
- 关键信息：付款状态 / 预计发货 / 预计送达 / Tracking 占位。
- 主操作：`View invoice (PDF)` · `Continue shopping` · 未登录时 `Create account to track`（预填 email）。

## 4. 模块
1. **Shipment summary**：地址、方式、Incoterm。
2. **Lines table**：图/SKU/Qty/Unit/Line。
3. **Payment summary**：方法、Subtotal / Shipping / Tax / Total。
4. **What happens next**：4 步图示（Confirmed → Processing → Shipped → Delivered）。
5. **Wire instructions**（仅 wire 支付时）。
6. **PO acknowledgement**（仅 PO/Net30）。
7. **Cross-sell**：常配件 / Saved list 推荐。
8. **Support**：联系方式 + Help Center 链接。

## 5. 交互
- `Print` / `Download PDF` 按钮。
- 重新下载发票 → 调 `/account/invoices/{id}`。
- 未登录时 `Create account`：弹 Modal，只需密码（email 已知）。

## 6. 数据
- `Order` 详情。Wire info 仅在 paymentMethod=wire 时显示。

## 7. SEO
- noindex。

## 8. A11y
- 标题层级；导出按钮可键盘触达。

## 9. 埋点
- `order_view_confirmation {orderId}`
- `order_create_account_from_confirmation`

## 10. 验收
- [ ] 直接刷新页面仍可访问（基于 secure token）。
- [ ] 邮件 / 页面信息一致。
