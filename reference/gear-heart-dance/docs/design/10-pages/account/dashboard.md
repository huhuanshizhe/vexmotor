# Account Dashboard / `/account`

## 1. 目的
登录后一站式总览（订单、报价、待办、推荐）。

## 2. 入口：URL `/account`，需登录。

## 3. 布局
- 两栏：左 `@C/AccountSidebar`（Overview / Orders / Quotes / Reorder / Lists / Addresses / Company / Invoices / Downloads / Team / Settings）+ 主区。

## 4. 模块
1. **Welcome strip**：`Hi {Name} · {Company} · {role}` + 公司审核状态徽章。
2. **KPI cards (4)**：Open orders / Pending quotes / Items in cart / Credit available (Net30)。
3. **Recent orders**（≤5）→ `View all`。
4. **Recent quotes**（≤5）。
5. **Saved lists / BOM**（≤3）。
6. **Recommended SKUs**（基于浏览/购买）。
7. **Account todos**：补充 VAT、上传资质、邀请同事、确认未读报价。

## 5. 交互：每卡 `View all` 跳子页；todo 完成后即时消失。

## 6. 数据：用户、订单/报价摘要、推荐 API。
## 7. SEO：noindex。
## 8. A11y：sidebar `<nav aria-label=Account>`。
## 9. 埋点：`account_view_dashboard`、`account_todo_click {todo}`。
## 10. 验收：所有 KPI 链接到对应子页。
