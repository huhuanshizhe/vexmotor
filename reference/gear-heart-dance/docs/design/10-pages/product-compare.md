# Product Compare / `/compare?skus=A,B,C,D`

## 1. 目的
让用户在最多 4 个 SKU 之间快速找差异。

## 2. 入口
- URL：`/compare?skus=...`
- 来源：CompareDrawer `Compare` 按钮、PDP `Add to compare`。
- 登录：否。

## 3. 首屏
- 顶部 toolbar：`Comparing 4 products` · `Hide identical rows` · `Print` · `Save list` · `Toggle units` · `Add another (+)`。
- 4 列 Product header（图 · SKU · Name · Price from · `Add to Cart`）。

## 4. 模块
1. **Spec compare table** — `@C/CompareTable`：
   - 分组：Electrical / Mechanical / Environmental / Feedback / Comms / Compliance / Stock / Lead time。
   - 差异行：背景 `--brand-100`，对比值高亮 `--accent-600`。
2. **Documents row** — 每个 SKU 的 Datasheet/CAD 快速下载。
3. **Compatible row** — 各自兼容驱动器图标行。
4. **Add another**：搜索弹层选 SKU。
5. **CTA strip 底部**：`Add all to Quote` · `Add all to Cart` · `Save as list`。

## 5. 交互
- 列可删除（×）；删除后 URL 同步。
- 拖拽换列序。
- 列内 Add to Cart 立即 Toast。
- 单位切换全表同步。

## 6. 数据
- `products: Product[]`（按 sku 批量）。
- 缺货 / 不存在 SKU 显占位列 + `Remove`。

## 7. SEO
- noindex（结果非长链接 SEO 目标）。
- title：`Compare {N} motors — STEPMOTECH`

## 8. A11y
- 表头 `<th scope=col>`；差异行 `aria-label="difference"`。

## 9. 埋点
- `compare_view {skus}`
- `compare_add_all_to_cart`
- `compare_save_list`

## 10. 验收
- [ ] 4 列在 ≥1280 完整可见，不出横向滚动；≥4 列时表内横向滚动。
- [ ] Hide identical 状态持久 session。
