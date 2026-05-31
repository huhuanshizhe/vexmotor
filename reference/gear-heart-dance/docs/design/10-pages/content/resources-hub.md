# Resources Hub / `/resources`

## 模块
- Hero：H1 `Engineering Resources`。
- Tabs / 子页：Whitepapers · Videos · Webinars · Downloads · CAD Library · Datasheet Library。
- Filter by topic / product line / language / format / gated。
- Grid `@C/ContentCard`（gated 资源带 Lock 图标，需 Email/登录）。

## 子页关键差异
- **Videos**：网格 16:9 + 时长，YouTube/自托管 lazy。
- **Webinars**：上下分 Upcoming / On-demand；含报名表 (Hubspot 占位)。
- **Whitepapers**：列表 + 摘要 + Gated 下载。
- **CAD Library**：搜索框 + SKU 直达 + 文件类型筛选。
- **Datasheet Library**：同上，含语言筛选。

## SEO：CollectionPage；gated 资源页 noindex 表单成功页。
## 埋点：`resource_view`、`resource_download {sku|slug, gated}`、`webinar_register`。
## 验收：Gated 资源邮件触达可追溯到来源 UTM。
