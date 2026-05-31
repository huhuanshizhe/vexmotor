import { getAuthSession } from '@/server/auth/session';
import { getAccountSummary, getOrdersByUser, getProfile } from '@/server/storefront/account';

import { AccountDashboard } from './account-dashboard';

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ pendingReview?: string }>;
}) {
  const session = await getAuthSession();
  const params = await searchParams;
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const [summary, profile, recentOrders] = await Promise.all([getAccountSummary(userId), getProfile(userId), getOrdersByUser(userId)]);

  if (!profile) {
    return null;
  }

  return <AccountDashboard summary={summary} profile={profile} recentOrders={recentOrders.slice(0, 5)} highlightPending={params.pendingReview === '1'} />;
}
