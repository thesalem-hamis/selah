import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { OrderSummary } from "@/components/shared/OrderSummary";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

import "@/styles/cart-page.css";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { formatPrice } = useCurrency();
  const cart = useCart();

  return (
    <StoreLayout>
      <div className="container-page cart-page">
        <header className="cart-page__heading">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#E5348A]">
            Your Selection
          </p>
          <h1 className="cart-page__title">Shopping Bag</h1>
        </header>

        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center border-y border-black/10 py-32 text-center bg-[#FDF0F5]/30">
            <p className="mb-8 text-lg md:text-xl tracking-wide text-gray-600 font-sans">
              Your bag is waiting for something considered.
            </p>
            <Link
              to="/shop"
              className="selah-button selah-button--outline inline-flex h-12 items-center justify-center bg-[#1A1A1A] px-10 text-base font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#E5348A]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-page__layout">
            <div className="border-t border-black/10">
              {cart.items.map((item) => (
                <article key={item.id} className="cart-page__item">
                  <Link to="/product/$slug" params={{ slug: item.slug }} className="shrink-0">
                    <div className="cart-page__image">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full bg-transparent object-contain mix-blend-multiply"
                      />
                    </div>
                  </Link>

                  <div className="cart-page__details">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <Link
                          to="/product/$slug"
                          params={{ slug: item.slug }}
                          className="cart-page__name"
                        >
                          {item.name}
                        </Link>
                        <button
                          aria-label={`Remove ${item.name}`}
                          onClick={() => cart.remove(item.id)}
                          className="cart-page__remove"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="cart-page__size">
                        Size: <span className="text-[#1A1A1A] font-semibold">{item.size}</span>
                      </p>
                    </div>

                    <div className="cart-page__item-bottom">
                      <div className="cart-page__quantity">
                        <button
                          className="flex h-full w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-black/5"
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={item.quantity <= 1}
                          onClick={() => cart.setQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="size-3" strokeWidth={1.5} />
                        </button>
                        <span className="flex-1 text-center text-xs font-medium text-[#292724]">
                          {item.quantity}
                        </span>
                        <button
                          className="flex h-full w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-black/5"
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.quantity >= (item.stock || 99)}
                          onClick={() => cart.setQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <span className="cart-page__price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 h-fit">
              <OrderSummary
                subtotal={cart.subtotal}
                discount={cart.discount}
                shipping={cart.shipping}
                total={cart.total}
                actionLabel="PROCEED TO CHECKOUT"
                actionTo="/checkout"
              />
              <Link to="/shop" className="cart-page__continue selah-button selah-button--outline">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
