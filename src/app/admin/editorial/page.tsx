import { AdminEditorialClient } from './editorial-client';

import { getAdminEditorialBlogEntries, getAdminEditorialPressEntries } from '@/server/admin/editorial-content';
import { getAdminEditorialDashboard } from '@/server/admin/editorial';

export default async function AdminEditorialPage() {
  const [dashboard, blogEntries, pressEntries]: [
    Awaited<ReturnType<typeof getAdminEditorialDashboard>>,
    Awaited<ReturnType<typeof getAdminEditorialBlogEntries>>,
    Awaited<ReturnType<typeof getAdminEditorialPressEntries>>,
  ] = await Promise.all([
    getAdminEditorialDashboard(),
    getAdminEditorialBlogEntries(),
    getAdminEditorialPressEntries(),
  ]);

  return <AdminEditorialClient initialDashboard={dashboard} initialBlogEntries={blogEntries} initialPressEntries={pressEntries} />;
}