'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { parseLocaleFromPathname, withLocalePath } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n-context';

type AddToWishlistButtonProps = {
  productId: string;
};

export function AddToWishlistButton({ productId }: AddToWishlistButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleWishlist() {
    startTransition(async () => {
      setMessage(null);
      const locale = parseLocaleFromPathname(pathname).locale;
      const response = await fetch('/api/front/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.status === 401) {
        const callbackUrl = withLocalePath('/account/wishlist', locale);
        router.push(`${withLocalePath('/login', locale)}?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      if (!response.ok) {
        setMessage(t('common.error'));
        return;
      }

      router.push(withLocalePath('/account/wishlist', locale));
      router.refresh();
    });
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button type="button" className="button-secondary" onClick={handleWishlist} disabled={isPending} style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
        {isPending ? t('common.loading') : t('product.addToWishlist')}
      </button>
      {message ? <span className="section-description">{message}</span> : null}
    </div>
  );
}
