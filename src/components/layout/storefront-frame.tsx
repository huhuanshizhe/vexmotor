import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { HeaderUtilityStrip } from '@/components/layout/header-utility-strip';
import { CookieConsentBar, COOKIE_CONSENT_COOKIE_NAME } from '@/components/layout/cookie-consent-bar';
import { NotificationBar } from '@/components/layout/notification-bar';
import type { Locale } from '@/lib/i18n';
import type { SitePreferences } from '@/lib/i18n';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { notificationBarConfig, NOTIFICATION_BAR_COOKIE_NAME } from '@/lib/site-config';
import { getHomeData, getNavigationData } from '@/server/storefront';
import { getCurrentUserId } from '@/server/auth/session';
import { getExistingActiveCartDetail } from '@/server/storefront/cart';
import { getSeedCategories, getSeedHomeData } from '@/server/storefront/seed';
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
    getHomeData().catch(() => getSeedHomeData()),
    getNavigationData().catch(() => ({ ...storefrontNavigationBase, categories: getSeedCategories().slice(0, 6) })),
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
            <span className="brand-title">StepMotech</span>
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
          <nav className="storefront-nav">
            {navigation.mainLinks.map((item) => {
              const hasNestedChildren = item.children?.some((child) => child.children?.length);

              return item.children?.length ? (
                <div key={item.label} className={`nav-dropdown${hasNestedChildren ? ' nav-dropdown-mega' : ''}`}>
                  <FrameLink href={item.href} className="storefront-nav-link nav-link-inverse nav-dropdown-trigger" external={item.external} locale={preferences.locale}>
                    {item.label}
                  </FrameLink>
                  {hasNestedChildren ? (
                    <div className="nav-mega-panel">
                      {item.children.map((child) => (
                        <article key={`${item.label}-${child.label}`} className={`nav-mega-column${child.children?.length ? ' is-primary' : ''}`}>
                          <FrameLink href={child.href} className="nav-mega-heading" external={child.external} locale={preferences.locale}>
                            {child.label}
                          </FrameLink>
                          {child.children?.length ? (
                            <div className="nav-mega-links">
                              {child.children.map((grandchild) => (
                                <FrameLink key={`${child.label}-${grandchild.label}`} href={grandchild.href} className="nav-mega-link" external={grandchild.external} locale={preferences.locale}>
                                  {grandchild.label}
                                </FrameLink>
                              ))}
                            </div>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="nav-dropdown-panel">
                      {item.children.map((child) => (
                        <FrameLink key={`${item.label}-${child.label}`} href={child.href} className="nav-dropdown-link" external={child.external} locale={preferences.locale}>
                          {child.label}
                        </FrameLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <FrameLink key={item.label} href={item.href} className="storefront-nav-link nav-link-inverse" external={item.external} locale={preferences.locale}>
                  {item.label}
                </FrameLink>
              );
            })}
          </nav>
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
        <div className="footer-inner footer-service-strip">
          {homeData.trustHighlights.map((item) => (
            <article key={item.title} className="footer-service-card">
              <strong className="footer-service-title">{item.title}</strong>
              <p className="footer-service-description">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="footer-inner">
          <article className="newsletter-card footer-newsletter-panel">
            <div className="footer-newsletter-copy">
              <h3 className="footer-column-title">{homeData.newsletter.title}</h3>
              <p className="section-description compact-copy">{homeData.newsletter.description}</p>
            </div>
            <NewsletterSignupForm placeholder={homeData.newsletter.placeholder} buttonLabel={homeData.newsletter.buttonLabel} />
          </article>
        </div>

        <div className="footer-inner footer-columns">
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

          <article className="footer-column footer-brand-column">
            <h3 className="footer-column-title">{homeData.brandStory.title}</h3>
            <p className="section-description compact-copy footer-brand-description">{homeData.brandStory.description}</p>
          </article>

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