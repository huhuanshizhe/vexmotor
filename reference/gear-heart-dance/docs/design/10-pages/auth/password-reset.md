# Password Reset / `/password-reset`

## 1. 目的
忘记密码自助重置。

## 2. 模块
1. **Request**：Email → Send reset link（防枚举：永远显示成功）。
2. **Reset**（带 token）：New password + Confirm，强度计 + 规则提示。
3. **Success** → 自动登录或回 Login。

## 3. 交互 / SEO / A11y / 埋点
- 速率限制；token 一次有效；过期文案明确。
- noindex。
- `pwd_reset_request`、`pwd_reset_complete`。

## 4. 验收
- [ ] 旧密码失效、所有 session 注销可选。
