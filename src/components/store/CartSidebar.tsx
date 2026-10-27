import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import * as Dialog from "@radix-ui/react-dialog";
import "@/styles/cart.css";

export function CartSidebar() {
  const { formatPrice } = useCurrency();
  const { isCartOpen, openCart, closeCart, items, count, remove, setQuantity } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <Dialog.Portal>
        <Dialog.Overlay className="cart-drawer__overlay" />
        <Dialog.Content className="cart-drawer" aria-describedby={undefined}>
          {/* Header with Logo + UPPERCASE CART Subtitle */}
          <div className="cart-drawer__header">
            <div className="flex flex-col items-start">
              <Link to="/" onClick={closeCart} className="block">
                <img
                  src="/selah-girls-logo.png"
                  alt="Selah Girl Society"
                  className="h-7 w-auto object-contain"
                />
              </Link>
              <Dialog.Title className="mt-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
                Cart ({count})
              </Dialog.Title>
            </div>

            <button
              onClick={closeCart}
              className="cart-drawer__icon-button"
              aria-label="Close cart"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable Items Container */}
          <div className="cart-drawer__items">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                <p className="text-[13px] tracking-wide text-gray-500">
                  Your bag is currently empty.
                </p>
                <button
                  onClick={closeCart}
                  className="selah-button selah-button--outline inline-flex h-12 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#E5348A]"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="cart-drawer__list">
                {items.map((item) => (
                  <div key={item.id} className="cart-drawer__item">
                    {/* Clean Product Image Frame */}
                    <div className="cart-drawer__image">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="cart-drawer__details">
                      <div>
                        <div className="flex justify-between items-start gap-3">
                          <Link
                            to="/product/$slug"
                            params={{ slug: item.slug }}
                            onClick={closeCart}
                            className="cart-drawer__name font-medium uppercase text-[#1A1A1A] hover:text-[#E5348A] transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => remove(item.id)}
                            className="cart-drawer__icon-button"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="size-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="cart-drawer__size text-gray-500 uppercase">
                          Size: <span className="text-[#1A1A1A] font-semibold">{item.size}</span>
                        </p>
                      </div>

                      {/* Quantity Controls & Price */}
                      <div className="cart-drawer__item-bottom">
                        <div className="cart-drawer__quantity">
                          <button
                            className="flex h-full w-8 items-center justify-center text-[#1A1A1A] hover:bg-black/5 transition-colors"
                            onClick={() => setQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="size-3" strokeWidth={1.5} />
                          </button>
                          <span className="flex h-full w-8 items-center justify-center text-[12px] font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-full w-8 items-center justify-center text-[#1A1A1A] hover:bg-black/5 transition-colors"
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.stock || 99)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="size-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="cart-drawer__price font-medium text-[#1A1A1A]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Checkout Section */}
          {items.length > 0 && (
            <div className="cart-drawer__footer">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-bold tracking-[0.1em] text-[#1A1A1A]">
                  SUBTOTAL
                </span>
                <span className="text-[14px] font-medium text-[#1A1A1A]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mb-6 text-[11px] text-gray-500">
                Shipping, taxes, and discounts calculated at checkout.
              </p>
              <Link
                to="/cart"
                onClick={closeCart}
                className="selah-button flex h-8 md:h-12 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#E5348A]"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="cart-drawer__continue selah-button selah-button--outline"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
