# Search Results / `/search?q=...`

## 1. 目的
跨产品 / 资源 / FAQ 的统一搜索结果。

## 2. 入口
- URL：`/search?q=nema+17+closed+loop`
- 来源：Header 搜索框（`/` 聚焦）。

## 3. 首屏
- H1：`Results for "{q}"`（`{N} products · {M} resources · {K} answers`）。
- Tabs：All / Products / Resources / FAQ / Docs。

## 4. 模块
1. **顶部 Did-you-mean / 拼写建议**。
2. **Products** — 同 PLP 行视图（截前 12）+ `View all in catalog → /c/...`。
3. **Resources** — Article cards × 6。
4. **FAQ** — 答案卡片 × 5。
5. **Documents** — Datasheet / CAD 直接命中文件名。
6. **Empty state** — `No matches. Try Selector` + 3 个热门类别。

## 5. 交互
- 站内搜索带高亮 mark。
- 键盘 ↑↓ + Enter 进入命中。
- 保存搜索（登录后）。

## 6. 数据
- 搜索 API：`/search?q&type&page`。
- 缓存：query 同 60s。

## 7. SEO
- noindex。

## 8. A11y
- `role=search`；`aria-live=polite` 通知结果数。

## 9. 埋点
- `search_query {q, resultCount}`、`search_click {q, type, sku|slug}`、`search_no_result {q}`。

## 10. 验收
- [ ] Tabs 数字与实际命中一致。
- [ ] 空状态有可执行建议。
