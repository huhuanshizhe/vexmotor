# Blog Post / `/blog/{slug}`

## 布局：单栏 720 + 右 ToC（粘性）。

## 模块
1. Cover image + Topic / Read min / Date / Author。
2. H1 + Lead。
3. Body（Markdown，可含 code block、参数表、图表、内联 Product mention 卡）。
4. Inline `Related products` 卡。
5. Author bio。
6. Related posts ×3。
7. CTA：`Subscribe` + `Talk to engineer`。

## SEO：title/desc by post；og:image = cover；JSON-LD `Article`（含 author/publishedAt/image）。
## A11y：标题层级；图片 alt；代码块 `<pre><code>`。
## 埋点：`blog_view {slug, readTimeSec}`、`blog_product_click`。
## 验收：内联 Product 卡可直接 Add to Cart。
