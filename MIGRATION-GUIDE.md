# 数据库迁移执行指南

## 方式一：通过 Neon Console（推荐）

1. 打开浏览器访问：https://console.neon.tech
2. 登录你的 Neon 账号
3. 选择 `neondb` 项目
4. 点击左侧的 **SQL Editor**
5. 新建一个查询，复制并粘贴以下 SQL：

```sql
-- 添加 is_dimension 字段
DO $$ BEGIN
  ALTER TABLE "product_images" ADD COLUMN "is_dimension" boolean NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN 
  RAISE NOTICE 'Column is_dimension already exists';
END $$;

-- 添加 image_type 字段
DO $$ BEGIN
  ALTER TABLE "product_images" ADD COLUMN "image_type" varchar(50) NOT NULL DEFAULT 'gallery';
EXCEPTION WHEN duplicate_column THEN 
  RAISE NOTICE 'Column image_type already exists';
END $$;

-- 验证迁移
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'product_images' 
  AND column_name IN ('is_dimension', 'image_type');
```

6. 点击 **Run** 执行
7. 看到成功消息后，继续执行数据导入

---

## 方式二：通过 psql 命令行

如果你本地安装了 psql，在项目根目录执行：

```bash
psql "postgresql://neondb_owner:npg_ZaA1Ruz9TUFv@ep-curly-field-a6wk13j5-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require" -f scripts/complete-migration.sql
```

---

## 方式三：通过批处理文件

双击运行：`scripts/migrate-db.bat`

---

## 验证迁移成功

执行以下查询确认字段已添加：

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_images' 
ORDER BY ordinal_position;
```

你应该能看到 `is_dimension` 和 `image_type` 两个新字段。

---

## 下一步：导入完整产品数据

数据库字段添加成功后，需要导入旧站的所有产品数据。

在 Vercel 项目的 Settings → Environment Variables 中确保 `DATABASE_URL` 已设置，然后：

1. 访问 Vercel Dashboard
2. 进入你的项目
3. 点击 **Settings** → **Environment Variables**
4. 确认 `DATABASE_URL` 已配置

然后通过 Vercel CLI 或 Neon Console 执行导入脚本。

---

## 数据库连接信息

- **Host**: ep-curly-field-a6wk13j5-pooler.us-west-2.aws.neon.tech
- **Database**: neondb
- **Username**: neondb_owner
- **Password**: npg_ZaA1Ruz9TUFv
- **SSL**: required

---

## 迁移内容说明

此次迁移会为 `product_images` 表添加：

1. **is_dimension** (boolean): 标识是否为尺寸图
   - `true`: 尺寸图/示意图
   - `false`: 普通产品图片

2. **image_type** (varchar): 图片类型分类
   - `'gallery'`: 产品图库图片
   - `'dimension'`: 尺寸示意图
   - `'detail'`: 细节特写图

这些字段将用于前端产品详情页更好地展示和管理产品图片。
