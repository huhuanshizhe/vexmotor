# Orders / `/account/orders` & `/account/orders/{id}`

## List `/account/orders`
- 工具条：搜索 (#/PO/SKU) · 状态过滤 · 日期范围 · 类型 (Order/Sample) · Export CSV。
- 表 `@C/OrderTable`：# / Date / Items / Total / Status badge / Tracking / Actions (View · Reorder · Invoice)。
- 空态：`No orders yet — Start shopping`。
- 分页。

## Detail `/account/orders/{id}`
1. Status timeline（Pending → Paid → Processing → Shipped → Delivered）含 tracking events。
2. Shipment 信息、Carrier、tracking #（链接 carrier）。
3. Addresses、Payment、PO、Notes。
4. Lines 表（含已发/待发 split）。
5. Documents：Invoice PDF · Packing slip · CoC（如有）· Test report。
6. Actions：Reorder（全部 → Cart） · Request return（在窗口期） · Open ticket。
7. Messages：与 Support 的工单线程。

## 交互：reorder 时缺货 SKU 给替代建议。
## SEO：noindex。
## A11y：状态时间线 `aria-label`。
## 埋点：`order_reorder`、`order_open_ticket`。
## 验收：跨仓拆单显示清晰；可下载所有发票。
