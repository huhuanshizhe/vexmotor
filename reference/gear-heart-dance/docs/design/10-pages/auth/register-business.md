# Business Registration / `/register`

## 1. 目的
让企业账号在 2 分钟内完成注册并进入待审核队列。

## 2. 入口
- URL：`/register`
- 来源：Login 页、Header CTA。

## 3. 首屏
- H1 `Create a business account`。
- 副文：Net 30 / 阶梯价 / Saved BOM / 多用户。
- 注册卡 + 右侧 benefits 列表。

## 4. 模块
1. **Step 1 — Account**：Work email、Name、Password、Role(下拉)。
2. **Step 2 — Company**：Company name、Country、Industry、Company size、Website、VAT/Tax ID/EORI（按国家显示）、Annual volume estimate（可选）。
3. **Step 3 — Verification (optional now)**：上传营业执照 / Tax cert（可跳过，限制功能直到审核通过）。
4. **Terms**：勾选 Terms / Privacy / Export compliance。
5. **Submit** → 邮箱验证 → Dashboard（待审核 banner）。

## 5. 交互
- 字段联动 by country。
- 重复邮箱：友好提示 `This email is already registered — Sign in`。
- 提交后给"What happens next" 时间线（审核 ≤ 1 工作日）。

## 6. 数据：`User, Company` 草稿。
## 7. SEO：title `Create a business account — STEPMOTECH`，noindex 可设 index（视策略）。
## 8. A11y：表单上下文清晰。
## 9. 埋点：`register_step_complete {step}`、`register_submit`。
## 10. 验收：未完成可保存草稿；邮箱验证未完成时功能受限。
