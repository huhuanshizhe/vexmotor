# Company Profile / `/account/company`

## 1. 目的：管理公司信息、税号、资质，影响价目与 Net30。

## 2. 模块
1. **Company info**：名称、行业、规模、网站、注册地址、Logo（用于发票）。
2. **Tax & trade IDs**：VAT/EORI/Tax ID/DUNS — 按国家显示。
3. **Verification documents**：上传营业执照、ISO 证书等；状态徽章：Pending / Verified / Rejected (with reason)。
4. **Credit & terms**：当前 paymentTerms（prepay/net30/net60）、Credit limit、Available credit、`Apply for credit`。
5. **Tax exemption**（US 州）：上传 resale cert。
6. **Default Incoterm / shipping account**：客户自带 DHL/FedEx 账号。
7. **Team members**（仅 Admin 可见）：列表、Invite、Role 切换、Remove。

## 3. 交互
- 文件上传进度 + 类型校验。
- 关键字段修改触发审核重置。

## SEO：noindex。
## A11y：分区 fieldset。
## 埋点：`company_update {field}`、`credit_apply`、`team_invite`。
## 验收：未审核公司在 Checkout 不显 Net30。
