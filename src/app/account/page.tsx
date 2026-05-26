import Link from 'next/link';

import { getAuthSession } from '@/server/auth/session';
import { getAccountSummary, getProfile } from '@/server/storefront/account';

import { AccountDashboard } from './account-dashboard';

export default async function AccountPage() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <main className="storefront-shell">
        <section className="section">
          <div className="section-inner">
            <article className="info-card">
              <h1 className="section-title">Member Center</h1>
              <p className="section-description">Sign in with the seeded admin account or your own member account to access profile, addresses, orders, and inquiries.</p>
              <Link href="/login" className="button-primary">
                Go to Login
              </Link>
            </article>
          </div>
        </section>
      </main>
    );
  }

  const [summary, profile] = await Promise.all([getAccountSummary(userId), getProfile(userId)]);

  if (!profile) {
    return null;
  }

  return <AccountDashboard summary={summary} profile={profile} />;
}
