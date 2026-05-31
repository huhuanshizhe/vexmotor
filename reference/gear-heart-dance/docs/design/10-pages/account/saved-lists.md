# Saved Lists / BOM / `/account/lists` & `/account/lists/{id}`

## List 页
- 卡片：name / items / 上次修改 / 共享 (公司内可见的同事头像)。
- `+ New list`，可从 Cart / Order / RFQ 创建。

## Detail 页
- Header：名 / 描述 / 共享设置 (Private / Team / Public link readonly)。
- Items 表：SKU / Qty / Note / Stock / Price / Actions (Edit · Remove · Move)。
- Actions: `Add all to Cart` · `Add all to Sample` · `Add all to Quote` · `Export CSV` · `Duplicate` · `Delete`。

## 交互：批量编辑 qty；缺货行替代建议。
## SEO：noindex（public link 可 noindex；后续可议）。
## 埋点：`list_create`、`list_share {scope}`、`list_add_all {target}`。
## 验收：与采购流程的三入口（Cart/Sample/Quote）顺畅互通。
