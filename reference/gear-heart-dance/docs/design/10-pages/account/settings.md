# Settings / `/account/settings`

## 模块
1. **Profile**：姓名、头像、电话、时区、语言、单位。
2. **Email & password**：变更 email（含验证）/ 密码 / 2FA (TOTP)。
3. **Sessions**：登录设备列表 + Revoke。
4. **Notifications**：订单 / 报价 / 促销 / 工程更新（邮件 / Webhook，按事件）。
5. **API keys**（仅 Admin）：生成/吊销。
6. **Danger zone**：删除账户（需密码 + 写 `DELETE`）。

## SEO：noindex。
## 埋点：`settings_update {section}`、`2fa_enable`。
## 验收：所有改动需当前密码确认（高风险操作）。
