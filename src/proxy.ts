import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { CURRENCY_COOKIE_NAME, DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALE_REQUEST_HEADER, UNIT_SYSTEM_COOKIE_NAME, getMarketDefaults, normalizeCurrency, normalizeUnitSystem, parseLocaleFromPathname, withLocalePath } from '@/lib/i18n';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, pathname: normalizedPathname, hadPrefix } = parseLocaleFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_REQUEST_HEADER, locale);

  const syncPreferenceCookies = (response: NextResponse) => {
    const localeDefaults = getMarketDefaults(locale);
    const currentCurrency = normalizeCurrency(request.cookies.get(CURRENCY_COOKIE_NAME)?.value);
    const currentUnitSystem = normalizeUnitSystem(request.cookies.get(UNIT_SYSTEM_COOKIE_NAME)?.value);

    response.cookies.set(LOCALE_COOKIE_NAME, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });

    if (!currentCurrency) {
      response.cookies.set(CURRENCY_COOKIE_NAME, localeDefaults.currency, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    }

    if (!currentUnitSystem) {
      response.cookies.set(UNIT_SYSTEM_COOKIE_NAME, localeDefaults.unitSystem, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    }
  };

  const protectedPath = normalizedPathname.startsWith('/admin') || normalizedPathname.startsWith('/account');

  if (protectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL(withLocalePath('/login', locale), request.url);
      const callbackPath = `${withLocalePath(normalizedPathname, locale)}${request.nextUrl.search}`;
      loginUrl.searchParams.set('callbackUrl', callbackPath);
      const redirectResponse = NextResponse.redirect(loginUrl);
      syncPreferenceCookies(redirectResponse);
      return redirectResponse;
    }
  }

  const response = hadPrefix
    ? NextResponse.rewrite(new URL(normalizedPathname === '/' ? '/' : normalizedPathname, request.url), {
        request: {
          headers: requestHeaders,
        },
      })
    : NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

  if (!request.cookies.get(LOCALE_COOKIE_NAME)?.value && DEFAULT_LOCALE === locale) {
    response.cookies.set(LOCALE_COOKIE_NAME, DEFAULT_LOCALE, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  }

  syncPreferenceCookies(response);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
