import { cookies, headers } from 'next/headers';

import {
  CURRENCY_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
  LOCALE_REQUEST_HEADER,
  UNIT_SYSTEM_COOKIE_NAME,
  getMarketDefaults,
  normalizeCurrency,
  normalizeLocale,
  normalizeUnitSystem,
  type SitePreferences,
} from '@/lib/i18n';

export async function getServerSitePreferences(): Promise<SitePreferences> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const locale = normalizeLocale(headerStore.get(LOCALE_REQUEST_HEADER) ?? cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const defaults = getMarketDefaults(locale);

  return {
    locale,
    currency: normalizeCurrency(cookieStore.get(CURRENCY_COOKIE_NAME)?.value) ?? defaults.currency,
    unitSystem: normalizeUnitSystem(cookieStore.get(UNIT_SYSTEM_COOKIE_NAME)?.value) ?? defaults.unitSystem,
  };
}