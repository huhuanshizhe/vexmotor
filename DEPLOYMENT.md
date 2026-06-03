# STEPMOTECH 生产部署指南

## 📋 部署前检查清单

### 1. 环境准备

```bash
# 确认 Node.js 版本（>= 20.0.0）
node --version

# 确认 pnpm 版本（>= 10.0.0）
pnpm --version

# 安装依赖（包含 next-intl）
pnpm install
```

### 2. 环境变量配置

创建 `.env.production` 文件或配置 Vercel 环境变量：

```env
# 数据库
DATABASE_URL=postgresql://user:password@host:5432/dbname

# 认证
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://stepmotech.online

# 邮件服务（Resend）
RESEND_API_KEY=re_your-api-key-here

# 支付（Stripe）
STRIPE_SECRET_KEY=sk_live_your-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-secret-here

# 对象存储（阿里云 OSS）
ALI_OSS_ACCESS_KEY_ID=your-access-key
ALI_OSS_ACCESS_KEY_SECRET=your-secret-key
ALI_OSS_BUCKET=your-bucket-name
ALI_OSS_REGION=oss-cn-hangzhou

# 站点配置
NEXT_PUBLIC_SITE_URL=https://stepmotech.online
NEXT_PUBLIC_SITE_NAME=STEPMOTECH

# 分析（GA4）
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Vercel 分析
VERCEL_ANALYTICS_ID=your-analytics-id
```

### 3. 数据库迁移

```bash
# 生成迁移文件
pnpm db:generate

# 执行迁移
pnpm db:push

# 种子数据（可选）
pnpm db:seed
```

### 4. 构建测试

```bash
# TypeScript 类型检查
pnpm typecheck

# ESLint 代码检查
pnpm lint

# 生产构建
pnpm build

# 本地预览生产构建
pnpm start
```

## 🚀 Vercel 部署

### 方法 1：Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

### 方法 2：GitHub 集成

1. 将代码推送到 GitHub 仓库
2. 在 Vercel Dashboard 中导入项目
3. 配置环境变量
4. 自动部署（每次 push 到 main 分支）

### 方法 3：Vercel Dashboard

1. 访问 https://vercel.com/new
2. 导入 Git 仓库
3. 配置构建设置：
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
4. 添加环境变量
5. 点击 Deploy

## 📊 部署后验证

### 1. 功能测试清单

```bash
# 访问首页
curl -I https://stepmotech.online

# 访问多语言页面
curl -I https://stepmotech.online/de
curl -I https://stepmotech.online/fr
curl -I https://stepmotech.online/es

# 测试产品列表
curl -I https://stepmotech.online/products

# 测试产品详情
curl -I https://stepmotech.online/products/nema-17-bipolar-stepper-motor

# 测试搜索
curl -I https://stepmotech.online/search?keyword=stepper

# 测试 Sitemap
curl https://stepmotech.online/sitemap.xml

# 测试 Robots
curl https://stepmotech.online/robots.txt
```

### 2. SEO 验证

- [ ] 访问 https://stepmotech.online，检查 `<link rel="alternate" hreflang="...">` 标签
- [ ] 访问 https://stepmotech.online/sitemap.xml，确认包含所有语言版本
- [ ] 使用 Google Search Console 测试结构化数据
- [ ] 验证 Open Graph 和 Twitter Card 元数据

### 3. 性能测试

```bash
# 使用 Lighthouse CLI
npx lighthouse https://stepmotech.online --output html --output-path ./lighthouse-report.html

# 关键指标目标：
# - Performance: >= 90
# - Accessibility: >= 95
# - Best Practices: >= 90
# - SEO: >= 95
```

### 4. 多语言测试

- [ ] 切换语言（EN → DE → FR → ES）
- [ ] 验证 URL 前缀正确（/de, /fr, /es）
- [ ] 检查 Cookie 设置（site_locale）
- [ ] 验证货币和单位系统自动切换
- [ ] 测试翻译管理后台（/admin/translations）

### 5. 邮件功能测试

```bash
# 测试欢迎邮件（注册新用户）
# 测试密码重置邮件
# 测试订单确认邮件（创建测试订单）
```

## 🔧 故障排除

### 构建失败

```bash
# 清理缓存
rm -rf .next node_modules

# 重新安装依赖
pnpm install

# 重新构建
pnpm build
```

### 数据库连接错误

```bash
# 测试数据库连接
psql $DATABASE_URL -c "SELECT 1"

# 检查迁移状态
pnpm db:studio
```

### 环境变量问题

```bash
# 检查环境变量是否加载
node -e "console.log(process.env.DATABASE_URL)"

# Vercel 环境变量验证
vercel env ls
```

## 📈 监控和日志

### Vercel 日志

```bash
# 查看实时日志
vercel logs

# 查看构建日志
vercel build --debug
```

### 错误监控

- Vercel 内置错误追踪
- Sentry 集成（可选）
- GA4 错误事件追踪

### 性能监控

- Vercel Speed Insights（已集成）
- Vercel Analytics（已集成）
- Lighthouse CI（CI/CD 集成）

## 🔄 持续部署

### Git 分支策略

```
main          → 生产环境（自动部署）
staging       → 预览环境（自动部署）
feature/*     → 开发分支
```

### 部署钩子

在 `package.json` 中添加：

```json
{
  "scripts": {
    "deploy": "vercel --prod",
    "deploy:preview": "vercel",
    "deploy:rollback": "vercel rollback"
  }
}
```

## 📝 部署检查清单

### 部署前

- [ ] 所有测试通过（pnpm test）
- [ ] TypeScript 无错误（pnpm typecheck）
- [ ] ESLint 无警告（pnpm lint）
- [ ] 生产构建成功（pnpm build）
- [ ] 数据库迁移完成
- [ ] 环境变量配置完成
- [ ] 翻译文件完整（4 语言）

### 部署后

- [ ] 网站可访问（HTTPS）
- [ ] 多语言切换正常
- [ ] 产品列表和详情页正常
- [ ] 搜索功能正常
- [ ] 购物车和结账流程正常
- [ ] 用户注册/登录正常
- [ ] 邮件发送正常
- [ ] Sitemap 和 hreflang 正确
- [ ] 性能指标达标（Lighthouse >= 90）
- [ ] 移动端响应式正常
- [ ] 管理后台可访问

## 🎯 回滚程序

如果部署后发现问题：

```bash
# Vercel 回滚到上一个版本
vercel rollback

# 或手动重新部署上一个已知良好的提交
vercel --prod git@github.com:username/repo.git#<commit-hash>
```

## 📞 支持

- **Vercel 文档**: https://vercel.com/docs
- **Next.js 文档**: https://nextjs.org/docs
- **问题反馈**: GitHub Issues

---

**最后更新**: 2026-06-04
**版本**: 1.0.0
