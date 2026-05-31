'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { COMPARE_ITEMS_UPDATED_EVENT, readCompareItems } from '@/lib/compare-items';
import { CURRENCY_COOKIE_NAME, LOCALE_COOKIE_NAME, PREFERENCE_COOKIE_MAX_AGE, type SitePreferences, UNIT_SYSTEM_COOKIE_NAME, getLocaleLabel, getMarketDefaults, withLocalePath, parseLocaleFromPathname } from '@/lib/i18n';
import type { StorefrontUtilityLink } from '@/server/storefront';

type HeaderUtilityStripProps = {
  links: StorefrontUtilityLink[];
  initialCartCount: number;
  preferences: SitePreferences;
};

export function HeaderUtilityStrip({ links, initialCartCount, preferences }: HeaderUtilityStripProps) {
  const [compareCount, setCompareCount] = useState(0);
  const [locale, setLocale] = useState(preferences.locale);
  const [currency, setCurrency] = useState(preferences.currency);
  const [unitSystem, setUnitSystem] = useState(preferences.unitSystem);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const syncCompareCount = () => {
      setCompareCount(readCompareItems().length);
    };

    syncCompareCount();
    window.addEventListener('storage', syncCompareCount);
    window.addEventListener(COMPARE_ITEMS_UPDATED_EVENT, syncCompareCount);

    return () => {
      window.removeEventListener('storage', syncCompareCount);
      window.removeEventListener(COMPARE_ITEMS_UPDATED_EVENT, syncCompareCount);
    };
  }, []);

  const writePreferenceCookie = (name: string, value: string) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${PREFERENCE_COOKIE_MAX_AGE}; SameSite=Lax`;
  };

  const applyLocale = (nextLocale: SitePreferences['locale']) => {
    const defaults = getMarketDefaults(nextLocale);
    const strippedPath = parseLocaleFromPathname(pathname).pathname;
    const queryString = searchParams.toString();
    const nextPath = `${withLocalePath(strippedPath, nextLocale)}${queryString ? `?${queryString}` : ''}`;

    setLocale(nextLocale);
    setCurrency(defaults.currency);
    setUnitSystem(defaults.unitSystem);
    writePreferenceCookie(LOCALE_COOKIE_NAME, nextLocale);
    writePreferenceCookie(CURRENCY_COOKIE_NAME, defaults.currency);
    writePreferenceCookie(UNIT_SYSTEM_COOKIE_NAME, defaults.unitSystem);

    startTransition(() => {
      router.push(nextPath);
      router.refresh();
    });
  };

  const applyCurrency = (nextCurrency: SitePreferences['currency']) => {
    setCurrency(nextCurrency);
    writePreferenceCookie(CURRENCY_COOKIE_NAME, nextCurrency);

    startTransition(() => {
      router.refresh();
    });
  };

  const applyUnitSystem = (nextUnitSystem: SitePreferences['unitSystem']) => {
    setUnitSystem(nextUnitSystem);
    writePreferenceCookie(UNIT_SYSTEM_COOKIE_NAME, nextUnitSystem);

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="header-utility-strip">
      <div className="header-market-group" aria-label="Site preferences">
        <label className="header-language-chip">
          <span className="sr-only">Language</span>
          <select className="header-market-select" value={locale} onChange={(event) => applyLocale(event.target.value as SitePreferences['locale'])} disabled={isPending}>
            <option value="en">{getLocaleLabel('en')}</option>
            <option value="de">{getLocaleLabel('de')}</option>
            <option value="fr">{getLocaleLabel('fr')}</option>
            <option value="es">{getLocaleLabel('es')}</option>
          </select>
        </label>

        <label className="header-language-chip">
          <span className="sr-only">Currency</span>
          <select className="header-market-select" value={currency} onChange={(event) => applyCurrency(event.target.value as SitePreferences['currency'])} disabled={isPending}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>

        <label className="header-language-chip">
          <span className="sr-only">Units</span>
          <select className="header-market-select" value={unitSystem} onChange={(event) => applyUnitSystem(event.target.value as SitePreferences['unitSystem'])} disabled={isPending}>
            <option value="imperial">Imperial</option>
            <option value="metric">Metric</option>
          </select>
        </label>
      </div>

      {links.map((item) => {
        const className = ['header-utility-link', item.variant === 'pill' ? 'header-utility-pill' : '', item.variant === 'pill-secondary' ? 'header-utility-pill header-utility-pill-secondary' : '']
          .filter(Boolean)
          .join(' ');

        const count = item.label === 'cart' ? initialCartCount : item.label === 'Compare' ? compareCount : null;
        const content = (
          <>
            <span>{item.label}</span>
            {count !== null ? <span className="header-utility-count">{count}</span> : null}
          </>
        );

        if (item.external) {
          return (
            <a key={`${item.label}-${item.href}`} href={item.href} className={className} target="_blank" rel="noreferrer">
              {content}
            </a>
          );
        }

        return (
          <Link key={`${item.label}-${item.href}`} href={item.href.startsWith('/') ? withLocalePath(item.href, locale) : item.href} className={className}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}