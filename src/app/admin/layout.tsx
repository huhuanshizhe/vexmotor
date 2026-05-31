import type { PropsWithChildren } from 'react';

import { AdminShell } from '@/components/layout/admin-shell';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '管理后台 — VexMotor',
  description: '内部运营管理控制台。',
  path: '/admin',
  noIndex: true,
});

export default function AdminLayout({ children }: PropsWithChildren) {
  return <AdminShell>{children}</AdminShell>;
}
