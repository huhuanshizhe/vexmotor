# Reorder / `/account/reorder`

## 1. 目的：5 秒重下历史订单。

## 2. 模块
1. **Quick reorder**：搜 SKU + qty → 加 Cart 行。
2. **From past orders**：按 SKU 聚合（最近一次 qty + 周期估算）。
3. **From saved lists**：选择 BOM → 一键全加。
4. **CSV upload**：SKU,qty 模板，错误行高亮。

## 3. 交互：缺货 SKU 替代建议、停产 SKU 显示 `Discontinued — see successor`。
## SEO：noindex。
## 埋点：`reorder_add {source, lineCount}`。
## 验收：批量加入 ≤ 1s（200 行）。
