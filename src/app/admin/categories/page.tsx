'use client';

import { Card, Typography } from 'antd';

export default function AdminCategoriesPage() {
  return (
    <Card>
      <Typography.Title level={2}>Categories</Typography.Title>
      <Typography.Paragraph type="secondary">
        Category tree management will be implemented next against the documented categories and product_categories schema.
      </Typography.Paragraph>
    </Card>
  );
}
