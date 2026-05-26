'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type AddToWishlistButtonProps = {
  productId: string;
};

export function AddToWishlistButton({ productId }: AddToWishlistButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleWishlist() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch('/api/front/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.status === 401) {
        router.push(`/login?callbackUrl=/account/wishlist`);
        return;
      }

      if (!response.ok) {
        setMessage('Unable to save this item to your wishlist.');
        return;
      }

      router.push('/account/wishlist');
      router.refresh();
    });
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button type="button" className="button-secondary" onClick={handleWishlist} disabled={isPending} style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
        {isPending ? 'Saving...' : 'Add to Wishlist'}
      </button>
      {message ? <span className="section-description">{message}</span> : null}
    </div>
  );
}
