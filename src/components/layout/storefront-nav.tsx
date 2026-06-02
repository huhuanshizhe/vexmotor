'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';

import type { Locale } from '@/lib/i18n';
import { withLocalePath } from '@/lib/i18n';
import type { StorefrontLink } from '@/server/storefront/types';

type StorefrontNavProps = {
  items: StorefrontLink[];
  locale: Locale;
};

type NavLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
  locale: Locale;
  external?: boolean;
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  onFocus?: () => void;
  ariaExpanded?: boolean;
  ariaHaspopup?: boolean;
};

function resolveHref(href: string, locale: Locale) {
  return href.startsWith('/') ? withLocalePath(href, locale) : href;
}

function NavLink({ href, className, children, locale, external, onClick, onFocus, ariaExpanded, ariaHaspopup }: NavLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        onFocus={onFocus}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHaspopup ? 'menu' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={resolveHref(href, locale)}
      className={className}
      onClick={onClick}
      onFocus={onFocus}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup ? 'menu' : undefined}
    >
      {children}
    </Link>
  );
}

export function StorefrontNav({ items, locale }: StorefrontNavProps) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeSignature = `${pathname}?${searchParams?.toString() ?? ''}`;

  useEffect(() => {
    setOpenLabel(null);
  }, [routeSignature]);

  useEffect(() => {
    function handlePointerDown(event: globalThis.MouseEvent) {
      if (!navRef.current || navRef.current.contains(event.target as Node)) {
        return;
      }

      setOpenLabel(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenLabel(null);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <nav ref={navRef} className="storefront-nav">
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const hasNestedChildren = item.children?.some((child) => child.children?.length);
        const isOpen = openLabel === item.label;

        function handleTriggerClick(event: ReactMouseEvent<HTMLAnchorElement>) {
          if (!hasChildren) {
            return;
          }

          if (!isOpen) {
            event.preventDefault();
            setOpenLabel(item.label);
            return;
          }

          setOpenLabel(null);
        }

        if (!hasChildren) {
          return <NavLink key={item.label} href={item.href} className="storefront-nav-link nav-link-inverse" external={item.external} locale={locale}>{item.label}</NavLink>;
        }

        return (
          <div
            key={item.label}
            className={`nav-dropdown${hasNestedChildren ? ' nav-dropdown-mega' : ''}${isOpen ? ' is-open' : ''}`}
            onMouseEnter={() => setOpenLabel(item.label)}
            onMouseLeave={() => setOpenLabel((current) => (current === item.label ? null : current))}
          >
            <NavLink
              href={item.href}
              className="storefront-nav-link nav-link-inverse nav-dropdown-trigger"
              external={item.external}
              locale={locale}
              onClick={handleTriggerClick}
              onFocus={() => setOpenLabel(item.label)}
              ariaExpanded={isOpen}
              ariaHaspopup
            >
              {item.label}
            </NavLink>

            {hasNestedChildren ? (
              <div className="nav-mega-panel">
                {item.children?.map((child) => (
                  <article key={`${item.label}-${child.label}`} className={`nav-mega-column${child.children?.length ? ' is-primary' : ''}`}>
                    <NavLink
                      href={child.href}
                      className="nav-mega-heading"
                      external={child.external}
                      locale={locale}
                      onClick={() => setOpenLabel(null)}
                      onFocus={() => setOpenLabel(item.label)}
                    >
                      {child.label}
                    </NavLink>

                    {child.children?.length ? (
                      <div className="nav-mega-links">
                        {child.children.map((grandchild) => (
                          <NavLink
                            key={`${child.label}-${grandchild.label}`}
                            href={grandchild.href}
                            className="nav-mega-link"
                            external={grandchild.external}
                            locale={locale}
                            onClick={() => setOpenLabel(null)}
                            onFocus={() => setOpenLabel(item.label)}
                          >
                            {grandchild.label}
                          </NavLink>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="nav-dropdown-panel">
                {item.children?.map((child) => (
                  <NavLink
                    key={`${item.label}-${child.label}`}
                    href={child.href}
                    className="nav-dropdown-link"
                    external={child.external}
                    locale={locale}
                    onClick={() => setOpenLabel(null)}
                    onFocus={() => setOpenLabel(item.label)}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
