'use client';

import { Card, List, Typography } from 'antd';

export default function LoginPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <Card style={{ width: 'min(680px, 100%)' }}>
        <Typography.Title level={2}>Authentication Entry</Typography.Title>
        <Typography.Paragraph>
          The Auth.js credentials flow is wired at <code>/api/auth/[...nextauth]</code>. Next step is to build the final login form and
          connect it to the real users table after database migrations are generated from the documented schema.
        </Typography.Paragraph>
        <List
          bordered
          dataSource={[
            'Credentials provider enabled',
            'Password hashing uses MD5 to match your compatibility requirement',
            'Admin and account routes are protected by middleware',
            'Third-party providers remain an extension point for phase two',
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>
    </main>
  );
}
