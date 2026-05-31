# Motor Selector / `/selector`

## 1. 目的
不知道型号的工程师，5 步内得到推荐 SKU 列表。

## 2. 入口
- URL：`/selector`（可附 `?category=stepper`）
- 来源：Header、Home Hero、PLP banner、Solutions 页。

## 3. 首屏
- 顶部进度条 5 步：**Application → Mechanical → Electrical → Feedback → Results**。
- 左侧 Tips 面板（"Why we ask"，可折叠）。

## 4. 步骤详情
1. **Application**：
   - Motor type 选择卡：Stepper / BLDC / Servo / Gearmotor / Linear actuator / "Help me decide"。
   - Industry chips（多选）。
2. **Mechanical**：
   - Required torque（值 + 单位）/ peak torque
   - Required speed（rpm）
   - Frame size constraint（可选范围）
   - Shaft / mounting / orientation
   - Environment（temperature / IP）
3. **Electrical**：
   - Supply voltage
   - Current limit
   - Driver included? (yes/no)
   - Communication（STEP-DIR / EtherCAT / CANopen / Modbus / Pulse-Dir）
4. **Feedback**：
   - Open / Encoder / Closed-loop
   - Resolution
   - Brake?
5. **Results**：
   - Result list（卡片）：含 **Match score**（百分比）、`Why this fits`（命中条件徽章）、关键 5 参数、价 + tier hint、`Add to Compare` `Add to Cart` `Add to Quote`。
   - 左侧"Refine"：所选条件可单项修改（回到对应步骤）。
   - "No exact match" → 给最近邻 + `Request custom development`（→ `/custom`）。

## 5. 交互
- 每步右下 `Next`，左下 `Back`；Esc 不退出。
- 所有输入持久 sessionStorage；URL 同步加密参数 `?w=...`，可分享。
- Selector 提供 `Reset` 与 `Save scenario`（登录后写入 Saved lists）。
- 移动端：步骤纵向叠加；底部 sticky `Next`。

## 6. 数据契约
- 规则引擎：JSON 配置 `selector-rules.json`，由内容运营维护；前端不内嵌业务规则。
- `match(score, reasons[])` 返回。

## 7. SEO
- title：`Motor Selector — Find the right motor in 5 steps`
- 结构化数据：`HowTo`（步骤）。

## 8. A11y
- 每步是 `<section role=group aria-labelledby>`；进度条 `aria-current=step`。
- 表单字段全部 label 关联。

## 9. 埋点
- `selector_start`、`selector_step_complete {step, fields}`、`selector_results {topSku, score, count}`、`selector_pick {sku}`、`selector_no_match`

## 10. 验收
- [ ] 全键盘可完成 5 步。
- [ ] URL 可分享并 1:1 还原。
- [ ] Result 列表 ≤ 200ms 渲染（虚拟列表）。
