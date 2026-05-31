# Quotes / `/account/quotes` & `/account/quotes/{id}`

## List
- 工具条：搜索、状态（Submitted / Quoted / Negotiating / Won / Lost / Expired）、日期、项目名。
- 表：# / Project / Lines / Value (when Quoted) / Expires / Status / Actions (View · Convert to order · Message)。

## Detail
1. **Header**：#编号 · Project info · 状态 `@C/QuoteStatusBadge` · expiry countdown。
2. **Lines (quoted)** 表：SKU / Qty / Unit (quoted) / Lead time / Notes / `Accept` `Reject` `Counter`。
3. **Counter modal**：输入 target price + qty + note。
4. **Attachments**：图纸、规格、合规文件。
5. **Messages thread**：客户 ↔ 销售/工程。
6. **Convert to Order**：选 line subset → 跳 Checkout（预填）。
7. **Lost reason form**（关闭时收集）。

## 交互：状态变化 Toast + 邮件；过期前 7 天提醒。
## SEO：noindex。
## A11y：thread 列表 `role=log aria-live=polite`。
## 埋点：`quote_accept`、`quote_counter`、`quote_convert_to_order`。
## 验收：转单后保留 Quote ID 关联。
