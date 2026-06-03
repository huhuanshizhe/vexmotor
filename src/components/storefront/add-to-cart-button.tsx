'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { useToast } from '@C/toast';
import { parseLocaleFromPathname, withLocalePath } from '@/lib/i18n';

type AddToCartButtonProps = {
  productId: string;
  showQuantitySelector?: boolean;
  redirectToCart?: boolean;
  showBuyNow?: boolean;
};

export function AddToCartButton({ productId, showQuantitySelector = false, redirectToCart = true, showBuyNow = false }: AddToCartButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { pushToast } = useToast();
  const [message, setMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  function updateQuantity(nextQuantity: number) {
    setQuantity(Math.max(1, nextQuantity));
  }

  function handleAddToCart() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch('/api/front/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        setMessage('This product could not be added to the cart.');
        return;
      }

      const locale = parseLocaleFromPathname(pathname).locale;

      if (redirectToCart) {
        router.push(withLocalePath('/cart', locale));
      } else {
        pushToast({
          title: 'Added to cart',
          description: `Quantity ${quantity} is now in your cart.`,
          tone: 'success',
        });
      }

      router.refresh();
    });
  }

  function handleBuyNow() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch('/api/front/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        setMessage('Unable to add this product to cart.');
        return;
      }

      const locale = parseLocaleFromPathname(pathname).locale;
      router.push(withLocalePath('/checkout', locale));
      router.refresh();
    });
  }

  return (
    <div className="add-to-cart-stack">
      {showQuantitySelector ? (
        <div className="quantity-cart-row">
          <label className="quantity-control">
            <span className="summary-label">Qty</span>
            <div className="quantity-stepper">
              <button type="button" className="quantity-stepper-button" onClick={() => updateQuantity(quantity - 1)} disabled={isPending || quantity <= 1}>
                -
              </button>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                className="quantity-stepper-input"
                value={quantity}
                onChange={(event) => updateQuantity(Number(event.target.value) || 1)}
                aria-label="Quantity"
                disabled={isPending}
              />
              <button type="button" className="quantity-stepper-button" onClick={() => updateQuantity(quantity + 1)} disabled={isPending}>
                +
              </button>
            </div>
          </label>

          <button type="button" className="button-primary quantity-cart-button" onClick={handleAddToCart} disabled={isPending}>
            {isPending ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      ) : (
        <button type="button" className="button-primary" onClick={handleAddToCart} disabled={isPending}>
          {isPending ? 'Adding...' : 'Add to Cart'}
        </button>
      )}

      {message ? <span className="section-description">{message}</span> : null}

      {showBuyNow ? (
        <button type="button" className="button-secondary buy-now-button" onClick={handleBuyNow} disabled={isPending}>
          {isPending ? 'Redirecting...' : 'Buy Now'}
        </button>
      ) : null}
    </div>
  );
}
