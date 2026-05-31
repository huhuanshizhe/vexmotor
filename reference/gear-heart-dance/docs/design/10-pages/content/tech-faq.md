# Tech FAQ / `/tech-faq`

## 模块
- 搜索框（即时）+ 分类侧栏（Stepper / BLDC / Servo / Drivers / Wiring / Sizing / Compliance / Shipping）。
- `@C/FAQAccordion`：分组显示，每条含 Q / A（含代码/公式/图）/ 相关产品。
- 反馈 `Was this helpful? 👍 👎` 收集改进。
- 底部 CTA：`Didn’t find it? Ask engineering` → `/support/contact?type=tech`。

## SEO：FAQPage JSON-LD（每个 Q/A）。
## A11y：disclosure 模式，键盘 Enter/Space。
## 埋点：`faq_search {q}`、`faq_expand {id}`、`faq_feedback {id, value}`。
## 验收：搜索 < 200ms；URL `#q-{id}` 深链。
