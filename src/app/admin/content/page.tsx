'use client';

import { Card, Typography } from 'antd';

export default function AdminContentPage() {
  return (
    <Card>
      <Typography.Title level={2}>Content Blocks</Typography.Title>
      <Typography.Paragraph type="secondary">
        Home hero, industry sections, testimonials, and footer highlights will map to the content_blocks schema.
      </Typography.Paragraph>
    </Card>
  );
}
