import Link from 'next/link';

import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { accountDashboardTodos, accountQuoteRecords, accountRecommendedProductSlugs, accountSavedLists } from '@/lib/account-portal';
import { getSeedProductBySlug } from '@/server/storefront/seed';

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
    status: 'active' | 'disabled' | 'pending';
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: unknown;
    placedAt: Date | null;
  }>;
  highlightPending?: boolean;
};

export function AccountDashboard({ summary, profile, recentOrders, highlightPending = false }: AccountDashboardProps) {
  const pendingQuotes = accountQuoteRecords.filter((quote) => quote.status === 'Submitted' || quote.status === 'Quoted' || quote.status === 'Negotiating');
  const recommendedProducts = accountRecommendedProductSlugs
    .map((slug) => getSeedProductBySlug(slug))
    .filter((product): product is NonNullable<ReturnType<typeof getSeedProductBySlug>> => product !== null);

  return (
    <div className="account-panel-stack">
      {profile.status === 'pending' || highlightPending ? (
        <article className="account-review-banner" aria-live="polite">
          <strong>Account pending review</strong>
          <p className="section-description">Your business account is active for sign-in and sourcing history, but pricing and approval-dependent capabilities remain in review. Approval normally lands within one working day.</p>
        </article>
      ) : null}
      <div className="section-header">
        <div>
          <h1 className="section-title">My Account</h1>
          <p className="section-description">
            Hi {profile.firstName} {profile.lastName}. {profile.company ?? 'Your company profile'} is now tied to order history, quote follow-up, saved lists, downloads, invoices, and buyer-level settings.
          </p>
        </div>
      </div>
      <div className="account-kpi-grid">
        <Link href="/account/orders" className="summary-stat knowledge-product-card">
          <span className="summary-label">Open orders</span>
          <strong>{summary.orders}</strong>
          <span className="section-description compact-copy">View all orders</span>
        </Link>
        <Link href="/account/quotes" className="summary-stat knowledge-product-card">
          <span className="summary-label">Pending quotes</span>
          <strong>{pendingQuotes.length}</strong>
          <span className="section-description compact-copy">Quoted and negotiating programs</span>
        </Link>
        <Link href="/cart" className="summary-stat knowledge-product-card">
          <span className="summary-label">Items in cart</span>
          <strong>3</strong>
          <span className="section-description compact-copy">Open cart and checkout draft</span>
        </Link>
        <Link href="/account/company" className="summary-stat knowledge-product-card">
          <span className="summary-label">Credit available</span>
          <strong>$18,400</strong>
          <span className="section-description compact-copy">Net30 account headroom</span>
        </Link>
      </div>

      <div className="info-grid">
        <article className="info-card">
          <div className="card-kicker">Recent orders</div>
          <h2>Latest purchase activity</h2>
          {recentOrders.length ? (
            <div className="account-nav-list">
              {recentOrders.map((order) => (
                <div key={order.id} className="summary-stat">
                  <span className="summary-label">{order.status}</span>
                  <strong>{order.orderNumber}</strong>
                  <span className="section-description compact-copy">{order.placedAt ? new Date(order.placedAt).toLocaleDateString() : 'Pending'} · ${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="section-description">Completed checkouts will appear here.</p>
          )}
          <Link className="section-link" href="/account/orders">View all orders</Link>
        </article>

        <article className="info-card">
          <div className="card-kicker">Recent quotes</div>
          <h2>Commercial follow-up</h2>
          <div className="account-nav-list">
            {pendingQuotes.slice(0, 3).map((quote) => (
              <div key={quote.quoteNumber} className="summary-stat">
                <span className="summary-label">{quote.status}</span>
                <strong>{quote.projectName}</strong>
                <span className="section-description compact-copy">{quote.quoteNumber} · {quote.valueLabel}</span>
              </div>
            ))}
          </div>
          <Link className="section-link" href="/account/quotes">View all quotes</Link>
        </article>

        <article className="info-card">
          <div className="card-kicker">Saved lists</div>
          <h2>Reusable BOMs</h2>
          <div className="account-nav-list">
            {accountSavedLists.slice(0, 3).map((list) => (
              <div key={list.id} className="summary-stat">
                <span className="summary-label">{list.scope}</span>
                <strong>{list.name}</strong>
                <span className="section-description compact-copy">{list.itemCount} items · updated {list.updatedAt}</span>
              </div>
            ))}
          </div>
          <Link className="section-link" href="/account/lists">View all lists</Link>
        </article>

        <article className="info-card">
          <div className="card-kicker">Account todos</div>
          <h2>Finish the buyer setup</h2>
          <div className="account-nav-list">
            {accountDashboardTodos.map((todo) => (
              <Link key={todo.id} className="summary-stat knowledge-product-card" href={todo.href}>
                <span className="summary-label">Todo</span>
                <strong>{todo.title}</strong>
                <span className="section-description compact-copy">{todo.detail}</span>
              </Link>
            ))}
          </div>
        </article>
      </div>

      <article className="info-card">
        <div className="section-header trade-card-header">
          <div>
            <div className="card-kicker">Recommended SKUs</div>
            <h2 className="cart-section-title">Continue with the product families already used in sourcing and quotes</h2>
          </div>
        </div>
        <div className="account-company-grid">
          {recommendedProducts.map((product) => (
            <article key={product.id} className="summary-stat">
              <span className="summary-label">{product.sku}</span>
              <strong>{product.name}</strong>
              <span className="section-description compact-copy">{product.shortDescription}</span>
              <div className="account-inline-actions">
                {product.purchaseMode === 'buy' ? <AddToCartButton productId={product.id} redirectToCart={false} /> : <Link href={`/products/${product.slug}`} className="nav-link">Open RFQ</Link>}
                <Link href={`/products/${product.slug}`} className="nav-link">Open SKU</Link>
              </div>
            </article>
          ))}
        </div>
      </article>

      <div className="info-grid">
        <article className="info-card">
          <h2>Account Profile</h2>
          <p className="section-description">Company: {profile.company ?? 'Not provided'}</p>
          <p className="section-description">Status: {profile.status === 'pending' ? 'Pending review' : profile.status === 'disabled' ? 'Disabled' : 'Active'}</p>
          <p className="section-description">Email: {profile.email}</p>
        </article>
        <article className="info-card">
          <h2>Next Steps</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            <Link className="nav-link" href="/account/orders">
              Review order history
            </Link>
            <Link className="nav-link" href="/account/quotes">
              Review quotes
            </Link>
            <Link className="nav-link" href="/account/downloads">
              Check updated documents
            </Link>
            <Link className="nav-link" href="/account/lists">
              Open saved lists
            </Link>
            <Link className="nav-link" href="/account/company">
              Update company profile
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
  );
}
