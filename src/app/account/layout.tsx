import Link from 'next/link';
import type { ReactNode } from 'react';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { accountNavLinks } from '@/lib/account-portal';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildMetadata } from '@/lib/seo';
import { getCurrentUserId } from '@/server/auth/session';

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();
  return buildMetadata({
  title: 'Account — STEPMOTECH',
  description: 'Manage orders, addresses, quotes, downloads, and preferences.',
  path: '/account',
  noIndex: true,
    locale,
  });
}

const accountLinks = [
  ...accountNavLinks,
  { href: '/cart', label: 'Cart' },
];

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const userId = await getCurrentUserId();
  const preferences = await getServerSitePreferences();

  return (
    <StorefrontFrame
      eyebrow="Member Center"
      title="Manage orders, quotes, downloads, lists, company data, and sourcing preferences from one account portal."
      description="The account area now combines order history with quote follow-up, document access, saved BOMs, invoices, company credentials, and buyer-level settings."
    >
      <section className="section">
        <div className="section-inner">
          {!userId ? (
            <article className="info-card">
              <h2 style={{ marginTop: 0 }}>Sign in to access your member center</h2>
              <p className="section-description">Orders, addresses, wishlist items, and inquiry history are tied to an authenticated account.</p>
              <Link href={`${withLocalePath('/login', preferences.locale)}?callbackUrl=${encodeURIComponent(withLocalePath('/account', preferences.locale))}`} className="button-primary">
                Go to Login
              </Link>
            </article>
          ) : (
            <div className="account-shell-grid">
              <aside className="info-card account-nav-card">
                <div className="card-kicker">Account navigation</div>
                <div className="account-nav-list">
                  {accountLinks.map((item) => (
                    <Link key={item.href} href={withLocalePath(item.href, preferences.locale)} className="nav-link">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </aside>
              <div className="account-shell-content">{children}</div>
            </div>
          )}
        </div>
      </section>
    </StorefrontFrame>
  );
}