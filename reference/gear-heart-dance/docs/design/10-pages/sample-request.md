# Sample Request / `/sample`

## 1. 目的
让工程师以最低门槛拿到样品做测试；引导其转化为正式订单。

## 2. 入口
- URL：`/sample`
- 来源：Header Sample Cart、PDP `Request Sample`。
- 登录：可选；强烈推荐（地址簿、跟踪）。

## 3. 首屏
- H1 `Request Samples`。
- 顶部政策说明卡：每客户每月 N 件、每 SKU 限 M、运费规则（默认 paid-by-buyer / 部分 SKU 免邮）、签收要求。

## 4. 模块
1. **Sample items**：行（图/SKU/名/Qty[≤limit]/单价或免费/freight 标识）；
   - 行级"Purpose of use" 必选（Prototyping / Qualification / EVT/DVT/PVT / Education / Reseller test）。
   - 不可加 → 灰显原因。
2. **Shipping address**（@C/AddressForm）。
3. **Freight & payment**：
   - 显示三快递价（DHL/FedEx/UPS）；
   - 付款 = 仅运费 / 全免（promo）。
4. **Engineering contact**：邮件、电话、公司、应用简述（强烈建议，<500 字）。
5. **Convert to order shortcut**：`Skip sample, place full order →`。
6. **Submit**：Primary `Request samples`。

## 5. 交互
- 数量超限自动 clamp + Toast。
- 全免 SKU 显示 `Free sample` 徽章。
- 提交成功 → `/account/orders/{id}?type=sample` 或匿名链接。

## 6. 数据
- `SampleCart, sample policy per SKU, shippingRates`。

## 7. SEO
- noindex。

## 8. A11y
- 限额信息 `aria-live` 提示。

## 9. 埋点
- `sample_submit {skus, freight}`、`sample_blocked {sku, reason}`。

## 10. 验收
- [ ] 限额规则可由后台配置，前端只展示。
- [ ] 申请历史在 `/account/orders` 中以 `Sample` 徽章区分。
