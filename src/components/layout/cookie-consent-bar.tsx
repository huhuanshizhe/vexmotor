'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { Locale } from '@/lib/i18n';
import { withLocalePath } from '@/lib/i18n';

export const COOKIE_CONSENT_COOKIE_NAME = 'cookie_consent_state';
export const COOKIE_CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

type CookieConsentBarProps = {
  locale: Locale;
  initiallyAccepted: boolean;
};

export function CookieConsentBar({ locale, initiallyAccepted }: CookieConsentBarProps) {
  const [accepted, setAccepted] = useState(initiallyAccepted);
  const privacyHref = useMemo(() => withLocalePath('/legal/privacy', locale), [locale]);

  if (accepted) {
    return null;
  }

  return (
    <aside className="cookie-consent-bar" aria-label="Cookie consent banner">
      <div className="cookie-consent-copy">
        <strong>Cookie preferences</strong>
        <p>
          We use cookies for cart persistence, session preferences, site analytics, and support workflows. You can review GDPR/CCPA details in our privacy policy.
        </p>
      </div>
      <div className="cookie-consent-actions">
        <Link href={privacyHref} className="ui-button is-secondary is-sm">
          Privacy policy
        </Link>
        <button
          type="button"
          className="ui-button is-brand is-sm"
          onClick={() => {
            document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=accepted; Path=/; Max-Age=${COOKIE_CONSENT_COOKIE_MAX_AGE}; SameSite=Lax`;
            setAccepted(true);
          }}
        >
          Accept cookies
        </button>
      </div>
    </aside>
  );
}