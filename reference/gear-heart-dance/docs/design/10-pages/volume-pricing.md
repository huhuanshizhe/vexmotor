# Volume Pricing / `/volume-pricing`

## 1. 目的
公开阶梯价规则、引导大客户申请合同价 / Net30。

## 2. 入口
- URL：`/volume-pricing`
- 来源：Footer、PDP `View tiers` 链接、Cart 提示。

## 3. 首屏
- H1 `Volume & contract pricing`。
- 副文 `Save up to 25% with tiered pricing. Up to 40% with annual contracts.`
- 两 CTA：`Browse catalog` · `Request contract pricing`。

## 4. 模块
1. **How tiers work**：示意表（1–9 / 10–49 / 50–199 / 200+）+ 提示每个 SKU 阶梯可能不同。
2. **Example calculator**：选 SKU + 输入年用量 → 估算节省。
3. **Contract benefits**：固定价 12 月 · 锁定库存 · 优先发货 · 工程支持 · Net30。
4. **Eligibility**：年采购 ≥ $50k 或单批 ≥ 200pcs。
5. **Apply form**：公司、行业、年采购、感兴趣 SKU、联系方式。
6. **FAQ**：何时生效 / 是否可叠加 promo / 多币种。
7. **Trust Strip**。

## 5. 交互
- Calculator：实时计算并展示节省 %。
- Apply 提交 → 进入销售跟进队列；用户邮箱收回执。

## 6. 数据
- `tiersConfig (sample)`、`contractRequest schema`。

## 7. SEO
- title：`Volume Discount & Contract Pricing — STEPMOTECH`
- JSON-LD：`FAQPage`。

## 8. A11y / 9. 埋点
- `volume_calc_run {sku, qty, savings}`、`contract_apply_submit`。

## 10. 验收
- [ ] Calculator 与 PDP 阶梯价一致。
