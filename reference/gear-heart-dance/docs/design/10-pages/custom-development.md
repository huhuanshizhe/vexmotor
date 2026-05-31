# Custom Development / `/custom`

## 1. 目的
为没有现成型号的项目收集定制电机需求并触发工程对接。

## 2. 入口
- URL：`/custom`
- 来源：Selector "No exact match"、Header `Solutions` 子项、PDP "Need a variant?"。

## 3. 首屏
- H1 `Custom motor development`。
- 副文 `Talk to our motion engineers. NDA-ready, MOQ from {N}.`
- CTA `Start specification` + `Talk to an engineer` (Calendly 占位)。

## 4. 模块
1. **Capability overview**：4 卡（Custom windings / Custom shafts & gearboxes / Integrated drivers / Special environments），各含案例数。
2. **Specification form**：
   - Application & duty cycle、环境（temperature、IP、vibration、altitude）、机械（torque/speed curve、frame、shaft、mounting）、电气（V/A、driver、comm）、反馈、合规需求、年用量、目标价、目标交期、是否 NDA。
   - 上传：草图/STEP/规格书 ZIP。
3. **Process timeline**：5 节点（Inquiry → DFM → Sample → EVT/DVT/PVT → MP）。
4. **NDA download** + 上传签署版。
5. **FAQ**：MOQ / Lead time / IP / Tooling 费用。
6. **Submit** → `/account/quotes/{id}?type=custom`。

## 5. 交互
- 大表单分组折叠，仅必填默认展开。
- 上传进度。
- 提交后自动创建 Quote(custom) 状态。

## 6. 数据
- `CustomBriefDraft`、`capabilities CMS-driven`。

## 7. SEO
- title：`Custom Stepper / BLDC / Servo Motor Development — STEPMOTECH`
- description：能力 / MOQ / 时效。
- JSON-LD：`Service` 或 `Article`（取决于内容）。

## 8. A11y / 9. 埋点
- `custom_submit {fields, files}`、`custom_calendly_click`。

## 10. 验收
- [ ] 表单可分次保存。
- [ ] 上传文件加密 + 仅工程团队可见标识。
