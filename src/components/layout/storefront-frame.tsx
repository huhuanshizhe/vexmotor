import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { HeaderUtilityStrip } from '@/components/layout/header-utility-strip';
import { CookieConsentBar, COOKIE_CONSENT_COOKIE_NAME } from '@/components/layout/cookie-consent-bar';
import { NotificationBar } from '@/components/layout/notification-bar';
import { StorefrontNav } from '@/components/layout/storefront-nav';
import type { Locale } from '@/lib/i18n';
import type { SitePreferences } from '@/lib/i18n';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { notificationBarConfig, NOTIFICATION_BAR_COOKIE_NAME } from '@/lib/site-config';
import { getHomeData, getNavigationData } from '@/server/storefront';
import { getCurrentUserId } from '@/server/auth/session';
import { getExistingActiveCartDetail } from '@/server/storefront/cart';
import { storefrontNavigationBase } from '@/server/storefront/site-shell';
import { NewsletterSignupForm } from '@/components/storefront/newsletter-signup-form';

type StorefrontFrameProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

type FrameLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
  external?: boolean;
  locale: Locale;
};

const fallbackSitePreferences: SitePreferences = {
  locale: 'en',
  currency: 'USD',
  unitSystem: 'imperial',
};

function FrameLink({ href, className, children, external, locale }: FrameLinkProps) {
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href.startsWith('/') ? withLocalePath(href, locale) : href} className={className}>
      {children}
    </Link>
  );
}

export async function StorefrontFrame({ title, description, eyebrow, actions, children }: StorefrontFrameProps) {
  const cookieStore = await cookies();
  const userId = await getCurrentUserId().catch(() => null);
  const anonymousToken = cookieStore.get('cart_token')?.value ?? null;
  const preferences = await getServerSitePreferences().catch(() => fallbackSitePreferences);
  const [homeData, navigation, activeCart] = await Promise.all([
    getHomeData(),
    getNavigationData().catch(() => ({ ...storefrontNavigationBase, categories: [] })),
    getExistingActiveCartDetail({ userId, anonymousToken }).catch(() => null),
  ]);
  const notificationDismissed = cookieStore.get(NOTIFICATION_BAR_COOKIE_NAME)?.value === notificationBarConfig.id;
  const cookieConsentAccepted = cookieStore.get(COOKIE_CONSENT_COOKIE_NAME)?.value === 'accepted';

  return (
    <main className="storefront-shell">
      <NotificationBar locale={preferences.locale} initiallyDismissed={notificationDismissed} />

      <div className="storefront-topbar">
        <div className="storefront-topbar-inner">
          <span>Self-owned brand | Factory direct supply | Global delivery support</span>
          <span>Technical service for stepper motors, drivers, and motion components</span>
        </div>
      </div>

      <header className="storefront-header">
        <div className="storefront-header-main">
          <Link href={withLocalePath('/', preferences.locale)} className="brand-mark">
            <Image src="/brand/stepmotech-logo-legacy.jpg" alt="StepMotech" width={300} height={37} className="brand-logo-image" priority />
            <span className="brand-title brand-title-fallback">StepMotech</span>
            <span className="brand-subtitle">Factory Direct Motion Components</span>
          </Link>

          <form action={withLocalePath('/search', preferences.locale)} className="header-search-form">
            <input name="keyword" className="header-search-input" placeholder="Search Product Here..." aria-label="Search products" />
            <button type="submit" className="header-search-button">
              Search
            </button>
          </form>

          <HeaderUtilityStrip links={navigation.utilityLinks} initialCartCount={activeCart?.itemCount ?? 0} preferences={preferences} />
        </div>

        <div className="storefront-nav-band">
          <StorefrontNav items={navigation.mainLinks} locale={preferences.locale} />
        </div>
      </header>

      {title ? (
        <section className="section">
          <div className="section-inner">
            <article className="page-hero-card">
              <div className="page-hero-copy">
                {eyebrow ? <div className="card-kicker">{eyebrow}</div> : null}
                <h1 className="section-title">{title}</h1>
                {description ? <p className="section-description">{description}</p> : null}
              </div>
              {actions ? <div className="page-hero-actions">{actions}</div> : null}
            </article>
          </div>
        </section>
      ) : null}

      {children}

      <footer className="storefront-footer">
        {/* SERVICE HIGHLIGHTS */}
        <div className="footer-inner footer-service-strip">
          {homeData.trustHighlights.map((item) => (
            <article key={item.title} className="footer-service-card">
              <strong className="footer-service-title">{item.title}</strong>
              <p className="footer-service-description">{item.description}</p>
            </article>
          ))}
        </div>

        {/* NEWSLETTER - FULL WIDTH */}
        <div className="footer-inner">
          <article className="newsletter-card footer-newsletter-panel">
            <div className="footer-newsletter-copy">
              <h3 className="footer-column-title">{homeData.newsletter.title}</h3>
              <p className="section-description compact-copy">{homeData.newsletter.description}</p>
            </div>
            <NewsletterSignupForm placeholder={homeData.newsletter.placeholder} buttonLabel={homeData.newsletter.buttonLabel} />
          </article>
        </div>

        {/* MAIN COLUMNS */}
        <div className="footer-inner footer-columns">
          {/* Column 1: Company Info (Wider) */}
          <article className="footer-column footer-brand-column">
            <h3 className="footer-column-title">{homeData.brandStory.title}</h3>
            <p className="section-description compact-copy footer-brand-description">{homeData.brandStory.description}</p>
          </article>

          {/* Column 2-3: Footer Sections (Catalog, Support, etc.) */}
          {homeData.footerSections.map((section) => (
            <article key={section.id} className="footer-column">
              <h3 className="footer-column-title">{section.title}</h3>
              <div className="footer-link-list">
                {section.links.map((link) => (
                  <FrameLink key={`${section.id}-${link.label}`} href={link.href} className="footer-link-item" external={link.external} locale={preferences.locale}>
                    {link.label}
                  </FrameLink>
                ))}
              </div>
            </article>
          ))}

          {/* Column 4: Most Viewed Products */}
          <article className="footer-column footer-most-viewed">
            <h3 className="footer-column-title">Most Viewed</h3>
            <div className="footer-product-list">
              {homeData.mostViewedProducts.map((product) => (
                <article key={product.id} className="footer-product-card">
                  {product.coverImage ? (
                    <Link href={withLocalePath(`/products/${product.slug}`, preferences.locale)} className="footer-product-image-wrap">
                      <Image src={product.coverImage.url} alt={product.coverImage.alt || product.name} fill sizes="84px" unoptimized className="footer-product-image" />
                    </Link>
                  ) : null}
                  <div className="footer-product-copy">
                    <Link href={withLocalePath(`/products/${product.slug}`, preferences.locale)} className="footer-product-link">
                      {product.name}
                    </Link>
                    <strong className="footer-product-price">{product.purchaseMode === 'buy' ? product.price.formatted : 'Request Quote'}</strong>
                  </div>
                </article>
              ))}
            </div>
          </article>

          {/* Column 5: Contact Info (Rightmost) */}
          <article className="footer-column footer-contact-column">
            <h3 className="footer-column-title">CONTACT</h3>
            <div className="footer-contact-list">
              {homeData.footerContact.map((item) => (
                <article key={item.title} className="footer-contact-item">
                  <strong className="footer-contact-title">{item.title}</strong>
                  {item.href ? (
                    <a href={item.href} className="footer-contact-link">
                      {item.lines[0]}
                    </a>
                  ) : null}
                  {item.lines.filter((_, index) => !item.href || index > 0).map((line) => (
                    <span key={`${item.title}-${line}`}>{line}</span>
                  ))}
                </article>
              ))}
            </div>
          </article>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-inner footer-note-row">
          <div className="footer-payment-strip">
            {homeData.paymentMethods.map((item) => (
              <span key={item} className="footer-payment-badge">
                {item}
              </span>
            ))}
          </div>
          <p className="footer-note">{homeData.copyright}</p>
        </div>
      </footer>

      <CookieConsentBar locale={preferences.locale} initiallyAccepted={cookieConsentAccepted} />
    </main>
  );
}