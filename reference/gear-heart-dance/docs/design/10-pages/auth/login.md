# Login / `/login`

## 1. 目的
让现有客户快速登录。

## 2. 入口
- URL：`/login`（回跳参数 `?next=...`）
- 来源：Header、需登录页拦截。

## 3. 首屏
- 居中卡 480w：
  - H1 `Sign in to STEPMOTECH`。
  - Email + Password + `Remember me` + Primary `Sign in`。
  - 分隔线 `or`：`Continue with Google` / `Continue with Microsoft`（可选）。
  - 链接：`Forgot password?` · `Register your company →`。
- 右侧（≥1024）插画区 + 5 个使用收益 bullets。

## 4. 模块 / 5. 交互
- 错误：通用文案 `Email or password is incorrect`（避免账号枚举）。
- 速率限制提示。
- SSO：占位，按企业域名自动建议。

## 6. 数据：Supabase auth（@Cloud）。
## 7. SEO：noindex。
## 8. A11y：表单标签关联，错误 aria-live。
## 9. 埋点：`auth_signin_attempt`、`auth_signin_success`、`auth_signin_fail {reason}`。
## 10. 验收：失败 5 次锁定 10 分钟；回跳 next 安全校验。
