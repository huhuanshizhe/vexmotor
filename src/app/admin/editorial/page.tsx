import { AdminEditorialClient } from './editorial-client';

import { getAdminEditorialBlogEntries } from '@/server/admin/editorial-content';
import { getAdminEditorialDashboard } from '@/server/admin/editorial';

export default async function AdminEditorialPage() {
  const [dashboard, blogEntries] = await Promise.all([
    getAdminEditorialDashboard(),
    getAdminEditorialBlogEntries(),
  ]);

  return <AdminEditorialClient initialDashboard={dashboard} initialBlogEntries={blogEntries} />;
}