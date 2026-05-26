'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type AddToCartButtonProps = {
  productId: string;
};

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAddToCart() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch('/api/front/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        setMessage('This product could not be added to the cart.');
        return;
      }

      router.push('/cart');
      router.refresh();
    });
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button type="button" className="button-primary" onClick={handleAddToCart} disabled={isPending}>
        {isPending ? 'Adding...' : 'Add to Cart'}
      </button>
      {message ? <span className="section-description">{message}</span> : null}
    </div>
  );
}
