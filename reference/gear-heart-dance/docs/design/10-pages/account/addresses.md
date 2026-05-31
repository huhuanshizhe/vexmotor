# Addresses / `/account/addresses`

## 模块
- 卡片列表：每个地址（公司 / Attention / line1/2 / city / region / postal / country / phone / VAT/EORI）+ 默认标签（billing/shipping）+ Actions (Edit · Set default · Delete)。
- `+ Add address`。
- Empty：CTA `Add your first address`。

## 交互
- 删除：若被未完成订单引用则禁删除并提示。
- Set default 切换：billing/shipping 独立。

## SEO：noindex。
## A11y：卡片有可达 `aria-label="{label} address"`。
## 埋点：`address_add`、`address_set_default`。
## 验收：跨国字段集联动正确。
