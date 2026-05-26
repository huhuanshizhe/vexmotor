'use client';

import {
  AppstoreOutlined,
  BarsOutlined,
  DashboardOutlined,
  InboxOutlined,
  OrderedListOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

const { Header, Sider, Content } = Layout;

const items = [
  { key: '/admin', icon: <DashboardOutlined />, label: <Link href="/admin">Overview</Link> },
  { key: '/admin/products', icon: <ShoppingOutlined />, label: <Link href="/admin/products">Products</Link> },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: <Link href="/admin/categories">Categories</Link> },
  { key: '/admin/orders', icon: <OrderedListOutlined />, label: <Link href="/admin/orders">Orders</Link> },
  { key: '/admin/inquiries', icon: <InboxOutlined />, label: <Link href="/admin/inquiries">Inquiries</Link> },
  { key: '/admin/content', icon: <BarsOutlined />, label: <Link href="/admin/content">Content Blocks</Link> },
  { key: '/admin/customers', icon: <UserOutlined />, label: <Link href="/admin/customers">Customers</Link> },
];

export function AdminShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const selected = items.find((item) => pathname.startsWith(item.key))?.key ?? '/admin';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="light" style={{ borderRight: '1px solid #e5e7eb' }}>
        <div style={{ padding: '20px 20px 8px' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Lianchuan Admin
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Industrial commerce operations hub
          </Typography.Paragraph>
        </div>
        <Menu mode="inline" selectedKeys={[selected]} items={items} style={{ borderInlineEnd: 0 }} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingInline: 24,
          }}
        >
          <div>
            <Typography.Text strong>Backend management</Typography.Text>
          </div>
          <Space size="middle">
            <Button href="/" type="default">
              View Storefront
            </Button>
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Typography.Text>Admin</Typography.Text>
            </Space>
          </Space>
        </Header>
        <Content style={{ padding: 24, background: '#f6f7f9' }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
