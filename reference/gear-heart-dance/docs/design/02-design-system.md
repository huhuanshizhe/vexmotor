# 02 — Design System / 设计系统

> 风格定位："Engineering Precision" — 类 StepperOnline / Misumi / Digi-Key，信息密度高、工程师友好、零装饰动效。

## 1. 色彩（HSL & HEX）

### 1.1 品牌色
| Token | HEX | 用途 |
|---|---|---|
| `--brand-900` | `#06192E` | 暗色块、Header 深底 |
| `--brand-800` | `#0B2B4E` | **主色**（Header / Footer / Links） |
| `--brand-700` | `#143C68` | Hover、强调底 |
| `--brand-500` | `#2E6BB8` | 链接、辅助按钮 |
| `--brand-100` | `#E8F0FB` | 高亮底（行 hover、徽章） |

### 1.2 强调色（Action / Price）
| Token | HEX | 用途 |
|---|---|---|
| `--accent-600` | `#E45A0F` | 价格、Primary CTA hover |
| `--accent-500` | `#FF6A1A` | **Primary CTA**（Add to Cart） |
| `--accent-100` | `#FFE7D6` | Promo 徽章底 |

### 1.3 中性灰（9 级）
| Token | HEX |
|---|---|
| `--gray-0` | `#FFFFFF` |
| `--gray-50` | `#F7F8FA` |
| `--gray-100` | `#EEF0F4` |
| `--gray-200` | `#DDE2EA` |
| `--gray-300` | `#C2C9D4` |
| `--gray-400` | `#8C95A4` |
| `--gray-500` | `#5D6776` |
| `--gray-700` | `#323A48` |
| `--gray-900` | `#10141B` |

### 1.4 语义色
| Token | HEX | 用途 |
|---|---|---|
| `--success-600` | `#1F8A4C` | In stock, 成功 |
| `--warning-600` | `#B5751A` | Low stock, 警告 |
| `--danger-600`  | `#C42B1C` | Out of stock, 错误 |
| `--info-600`    | `#1F6FB5` | 提示 |

### 1.5 库存 / 交期专用状态色
| 状态 | 颜色 | 文案 |
|---|---|---|
| In stock | `--success-600` 圆点 | "In stock · Ships today" |
| Low stock | `--warning-600` | "Only N left" |
| Lead time | `--info-600` | "Ships in N–M business days" |
| Made-to-order | `--brand-500` | "Built-to-order · 3–5 weeks" |
| Out of stock | `--danger-600` | "Notify me" |

### 1.6 对比度
所有正文文字最小 4.5:1；UI 控件最小 3:1。深色 Header 使用 `--gray-0`/`--gray-200` 组合。

## 2. 字体

| 用途 | 字体 | Weight |
|---|---|---|
| Display / H1–H2 | **Inter Tight** | 600 / 700 |
| Body / UI | **Inter** | 400 / 500 / 600 |
| Mono / Spec table / SKU / 数字 | **JetBrains Mono** | 400 / 500 |

### 2.1 字号梯度
| Token | rem | px | 行高 | 用途 |
|---|---|---|---|---|
| `text-2xs` | 0.6875 | 11 | 14 | Spec table sublabels |
| `text-xs`  | 0.75   | 12 | 16 | Caption, badge |
| `text-sm`  | 0.875  | 14 | 20 | Body small, table |
| `text-base`| 1.0    | 16 | 24 | Body |
| `text-lg`  | 1.125  | 18 | 26 | Lead body |
| `text-xl`  | 1.25   | 20 | 28 | Card title |
| `text-2xl` | 1.5    | 24 | 32 | Section title |
| `text-3xl` | 1.875  | 30 | 36 | Page title |
| `text-4xl` | 2.25   | 36 | 42 | Hero subhead |
| `text-5xl` | 3      | 48 | 54 | Hero |

价格统一 `text-2xl` Mono 500；SKU `text-sm` Mono 500 with copy 按钮。

## 3. 间距 / 圆角 / 阴影

- 间距基线 4px：`0/1/2/3/4/6/8/10/12/16/20/24/32` × 4。
- 圆角：`--radius-sm 4 · md 6 · lg 8 · xl 12`；按钮/输入 6；卡片 8；Modal 12。**不使用大圆角**。
- 阴影：
  - `--shadow-1` `0 1px 2px rgba(15,20,30,.06)`
  - `--shadow-2` `0 4px 12px rgba(15,20,30,.08)`
  - `--shadow-pop` `0 12px 32px rgba(15,20,30,.16)`（Drawer/Modal）

## 4. 栅格 / 断点

| 断点 | 宽度 | 列 | 边距 | 槽 |
|---|---|---|---|---|
| sm   | <640 | 4  | 16 | 16 |
| md   | 640–1023 | 8 | 24 | 16 |
| lg   | 1024–1279 | 12 | 24 | 24 |
| xl   | 1280–1535 | 12 | 32 | 24 |
| 2xl  | ≥1536 | 12 | 40 | 32 |

页面最大宽度 1440（content）/ 1680（Catalog dashboard）。PDP 双栏 `7+5`；PLP 三栏 `filters 3 / list 9` 或 `filters 3 / list 7 / compare 2`。

## 5. 图标

- 基础库：**Lucide**（24px stroke 1.5；UI 内 16px / 18px）。
- 自定义工业线性图标（同 stroke 风格）：Stepper / BLDC / Servo / Driver / Gearbox / Encoder / PSU / Linear actuator / Holding torque / Frame size / IP65 / Closed-loop。
- 文件下载图标语义化：PDF / STEP / DXF / DWG / IGES / ZIP。

## 6. Motion

- 缓动 `cubic-bezier(.2,.8,.2,1)`，150ms（micro）/ 200ms（drawer/modal）。
- 仅以下场景允许动效：Drawer 抽屉、Modal、Toast、加载骨架、Tab 切换、Compare 抽屉。
- **禁止**：滚动视差、淡入序列、悬停放大、Hero 视频自动播放。

## 7. 表格规范（核心）

| 维度 | 值 |
|---|---|
| 行高 | 36 |
| 表头 | `text-xs` 600 uppercase, `--gray-700` |
| 表体 | `text-sm` 400, `--gray-900` |
| 数字 | Mono 500 右对齐 |
| 分隔线 | `--gray-200` 1px |
| Hover | `--brand-100` |
| Sticky 表头 | 固定，阴影 1 |
| 列宽 | SKU 144 / Param 80–120 / Price 96 / Stock 120 / Actions 120 |

## 8. 表单规范

- 输入高 40（compact 32）；圆角 6；边 1px `--gray-300`；focus 2px `--brand-500` outline + 内描边。
- Label 在上，required `*`；Help text 在下，error 红色并替换 help text。
- 数字 spinner、单位选择（mm/in、N·m/oz·in）内嵌右侧。
- 多步表单（Selector、Checkout）使用顶部进度条。

## 9. 按钮规范

| 类型 | 用途 | 样式 |
|---|---|---|
| Primary | Add to Cart, Place order, Submit | bg `--accent-500` / text white / 6 radius |
| Secondary | Add to Quote, Add to Sample | bg `--gray-0` / 1px `--gray-300` / text `--gray-900` |
| Brand | Sign in, Save | bg `--brand-800` / text white |
| Ghost | 表格内操作、次要 | text `--brand-500` / 无底 |
| Danger | Delete | text `--danger-600` |
| Sizes | sm 32 / md 40 / lg 48 |

## 10. 可访问性

- 全部交互可键盘到达，可见 focus ring。
- 表单字段关联 `<label for>` 或 `aria-labelledby`。
- 表格使用 `<th scope>`；筛选切换使用 `aria-pressed`。
- 颜色不是唯一信息载体（库存状态附文字 / 图标）。

## 11. Tailwind 主题映射建议

```css
@theme inline {
  --color-brand-800: #0B2B4E;
  --color-brand-500: #2E6BB8;
  --color-accent-500: #FF6A1A;
  --color-success-600: #1F8A4C;
  /* ...全部 token 同步到 styles.css */
}
```

字体加载（`@import` Google Fonts 或自托管）：
```
Inter (400/500/600/700)
Inter Tight (600/700)
JetBrains Mono (400/500)
```
