# RFQ / Quote Request / `/quote`

## 1. 目的
让 B2B 采购在一页内提交多 SKU + 定制需求的批量询价。

## 2. 入口
- URL：`/quote`
- 来源：Header `Quote Cart`、PDP `Add to Quote`、Cart `Convert to RFQ`、Compare 底部、CTA banners。
- 登录：不强制；登录后自动带公司信息。

## 3. 首屏
- H1 `Request for Quote`。
- 进度条 3 段（Project · Line items · Submit）— 单页但锚点导航。
- 右侧 Sticky 摘要：项目名、行项数、总年用量。

## 4. 模块
1. **Project info**（@C/RFQForm 顶部）：
   - Project name、Industry、Target start date、Annual volume estimate、Port of delivery、Incoterm（EXW / FOB / DAP / DDP）、Customer reference。
2. **Line items**：
   - 三种添加方式 Tab：
     - **From Quote Cart**（默认；显示已加 SKU）
     - **Add SKU**：搜索 → 选 variant
     - **Import BOM (CSV)**：模板下载 + 上传 + 列映射
     - **Describe custom**：手填名称 + 参数 + 数量
   - 行字段：SKU / 名 / Qty / Target unit price / Required by / Notes / Remove。
   - 行级 attach（图纸 PDF/STEP）。
3. **Project attachments**：批量上传 ZIP（最大 50MB）。
4. **Compliance**：勾选确认非受限用途；End-user statement（如需）。
5. **Contact & company**：
   - 邮箱（必填）/ 姓名 / 公司 / 国家 / 电话 / VAT。
   - 若未登录：`Create account to track this RFQ`（密码可选）。
6. **Submit**：Primary `Submit RFQ` + 预计回应时间 `Typical response within 1 business day`。
7. **后置 Confirmation**：跳 `/account/quotes/{id}`（或匿名查询链接邮件）。

## 5. 交互
- 行实时校验（数量 > 0、target 价格非负）。
- 文件上传：进度条、可删除、限类型/大小。
- 保存草稿：`Save draft`（写 localStorage 或登录用户后端）。
- 错误聚焦首个未填字段。

## 6. 数据
- `QuoteCart, Company?, IncotermList, IndustryList`
- 文件上传 → presigned URL → S3-compatible 存储。

## 7. SEO
- noindex。

## 8. A11y
- 多文件上传 `aria-describedby` 列出限额；表格行 `scope`。

## 9. 埋点
- `rfq_start`、`rfq_add_line {source}`、`rfq_attach_file {sizeKb}`、`rfq_submit {lineCount, value}`、`rfq_submit_fail {reason}`。

## 10. 验收
- [ ] 三种添加方式互相不冲突，统一存入 lines。
- [ ] BOM CSV 导入支持中英表头。
- [ ] 匿名提交 → 给唯一查询链接（邮件）。
