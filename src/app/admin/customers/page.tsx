'use client';

import { Card, Typography } from 'antd';

export default function AdminCustomersPage() {
  return (
    <Card>
      <Typography.Title level={2}>Customers</Typography.Title>
      <Typography.Paragraph type="secondary">
        Customer detail pages will surface profile, order, address, wishlist, and inquiry data after API implementation.
      </Typography.Paragraph>
    </Card>
  );
}
