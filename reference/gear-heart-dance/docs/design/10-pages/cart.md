# Cart / `/cart`

## 1. 目的
让买家审阅清单、调整数量、估运费/税，决定 Checkout 或转 RFQ。

## 2. 入口
- URL：`/cart`
- 来源：Header cart icon、PDP Add → "View cart"。
- 登录：否（结算时再要求登录或 guest）。

## 3. 首屏
- H1 `Cart ({N} items)`。
- 两栏 8 / 4：
  - 左：Line items 表 `@C/CartLine`。
  - 右：`@C/CartSummary` + Primary `Proceed to Checkout` + Secondary `Convert cart to RFQ`。

## 4. 模块
1. **Line items 表**：
   - 列：图 · 名/SKU/variant · Qty · Unit price (含 tier 标签 `Tier 2`) · Line total · Move to ▾ (Sample/Quote) · Remove
   - 行下方提示条：`Add {n} more for $X each (Tier 2)` (info bar)。
   - 缺货行：变色 + `Save for later`。
2. **Promo code**：可折叠输入。
3. **PO Number / Notes**：折叠区，登录企业用户可见。
4. **Shipping estimator** — `@C/ShippingEstimator`：国家/邮编 → 时效与费率列表。
5. **Tax estimator**：基于地址显示 VAT/HST/GST/Sales tax 预估。
6. **Summary**：Subtotal / Volume discount / Shipping est. / Tax est. / Total（货币切换提示，不锁定）。
7. **Cross-sell**：3 个常配件（cables/brackets）。
8. **Trust Strip**。

## 5. 交互
- Qty 修改实时刷新 tier、line total、summary（debounce 250ms）。
- Move to Sample：检查 sample.eligible 与限额；不可时 disabled + tooltip。
- Move to Quote：弹 modal 收 Annual volume / Target price / Notes。
- Convert to RFQ：将所有 line 复制到 Quote Cart 并跳 `/quote`。
- Empty cart：插画 + `Start with Selector` + 3 个最热类。

## 6. 数据
- `MainCart`（@M）。SSR 不缓存（用户私有）。
- 离线：`localStorage` 暂存 guest cart。

## 7. SEO
- noindex。

## 8. A11y
- 表语义；Qty stepper `aria-label="Quantity for {SKU}"`。

## 9. 埋点
- `cart_view {value, items}`、`cart_qty_change`、`cart_line_remove`、`cart_move_to_sample`、`cart_move_to_quote`、`cart_convert_to_rfq`、`cart_promo_apply`。

## 10. 验收
- [ ] Tier 实时计算正确。
- [ ] 运费/税仅"估算"标识清楚。
- [ ] 三键转换路径无数据丢失。
