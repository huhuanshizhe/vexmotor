# Invoices / `/account/invoices`

## 模块
- 表：# / Date / Order# / Amount / Currency / Status (Paid / Due / Overdue) / Due date / Download (PDF) / Pay now (Due/Overdue)。
- 过滤：状态、年份、币种、Export CSV。
- 余额卡：未付小计 / 即将到期 / 已逾期。

## 交互：Pay now → Stripe-hosted；批量下载选中发票 ZIP。
## SEO：noindex。
## 埋点：`invoice_download`、`invoice_pay`。
## 验收：与会计系统一致；overdue ≥7 天显示红条提醒全站。
