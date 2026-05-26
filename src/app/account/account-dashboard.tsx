import Link from 'next/link';

type AccountDashboardProps = {
  summary: {
    orders: number;
    addresses: number;
    inquiries: number;
    wishlist: number;
  };
  profile: {
    email: string;
    firstName: string;
    lastName: string;
    company: string | null;
  };
};

export function AccountDashboard({ summary, profile }: AccountDashboardProps) {
  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">My Account</h1>
              <p className="section-description">
                Welcome back, {profile.firstName} {profile.lastName}. Your member center is now connected to real account, address, order, and inquiry tables.
              </p>
            </div>
          </div>
          <div className="trust-grid">
            <article className="trust-card">
              <strong>{summary.orders}</strong>
              <p className="section-description">Orders</p>
            </article>
            <article className="trust-card">
              <strong>{summary.addresses}</strong>
              <p className="section-description">Saved addresses</p>
            </article>
            <article className="trust-card">
              <strong>{summary.inquiries}</strong>
              <p className="section-description">Open inquiries</p>
            </article>
            <article className="trust-card">
              <strong>{profile.email}</strong>
              <p className="section-description">Account email</p>
            </article>
            <article className="trust-card">
              <strong>{summary.wishlist}</strong>
              <p className="section-description">Wishlist items</p>
            </article>
          </div>
          <div className="info-grid" style={{ marginTop: 24 }}>
            <article className="info-card">
              <h2>Account Profile</h2>
              <p className="section-description">Company: {profile.company ?? 'Not provided'}</p>
              <p className="section-description">API access: <code>/api/front/profile</code></p>
            </article>
            <article className="info-card">
              <h2>Next Steps</h2>
              <div style={{ display: 'grid', gap: 10 }}>
                <Link className="nav-link" href="/account/orders">
                  Review order history
                </Link>
                <Link className="nav-link" href="/account/addresses">
                  Manage saved addresses
                </Link>
                <Link className="nav-link" href="/account/wishlist">
                  Review wishlist
                </Link>
                <Link className="nav-link" href="/account/inquiries">
                  Track inquiries
                </Link>
                <Link className="nav-link" href="/cart">
                  Open shopping cart
                </Link>
                <Link className="nav-link" href="/products">
                  Continue shopping
                </Link>
                <Link className="nav-link" href="/contact">
                  Submit a quote request
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
