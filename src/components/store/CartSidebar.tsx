import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CartSidebar() {
  const { isCartOpen, closeCart, items, total, subtotal, remove, setQuantity } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Sidebar with Glassmorphism + Soft Pink tint */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[100] flex h-full w-full flex-col bg-[#FDF0F5]/85 backdrop-blur-xl text-[#1A1A1A] shadow-2xl transition-transform duration-300 ease-in-out sm:w-[450px]",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header with Logo + UPPERCASE CART Subtitle */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-6 py-4 bg-white/40">
          <div className="flex flex-col items-start">
            <Link to="/" onClick={closeCart} className="block">
              <img
                src="/selah-girls-logo.png"
                alt="Selah Girl Society"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mt-1">
              CART {items.length > 0 && `(${items.length})`}
            </span>
          </div>

          <button
            onClick={closeCart}
            className="flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition-colors p-1"
            aria-label="Close cart"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
              <p className="text-[13px] tracking-wide text-gray-500">
                Your bag is currently empty.
              </p>
              <button
                onClick={closeCart}
                className="selah-button inline-flex h-12 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#E5348A]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Clean Product Image Frame */}
                  <div className="h-36 w-28 shrink-0 bg-[#FDF0F5 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contai"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to="/product/$slug"
                          params={{ slug: item.slug }}
                          onClick={closeCart}
                          className="text-[13px] font-medium uppercase text-[#1A1A1A] hover:text-[#E5348A] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-gray-400 hover:text-[#E5348A] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500 uppercase">
                        Size: <span className="text-[#1A1A1A] font-semibold">{item.size}</span>
                      </p>
                    </div>

                    {/* Quantity Controls & Price */}
                    <div className="flex items-end justify-between mt-4">
                      <div className="flex h-8 items-center border border-black/10 bg-white/80">
                        <button
                          className="flex h-full w-8 items-center justify-center text-[#1A1A1A] hover:bg-black/5 transition-colors"
                          onClick={() => setQuantity(item.id, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" strokeWidth={1.5} />
                        </button>
                        <span className="flex h-full w-8 items-center justify-center text-[12px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="flex h-full w-8 items-center justify-center text-[#1A1A1A] hover:bg-black/5 transition-colors"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-[13px] font-medium text-[#1A1A1A]">
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
          <div className="border-t border-[#E5E5E5] bg-[#FDFDFD] p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[13px] font-bold tracking-[0.1em] text-[#1A1A1A]">SUBTOTAL</span>
              <span className="text-[14px] font-medium text-[#1A1A1A]">{formatPrice(total)}</span>
            </div>
            <p className="mb-6 text-[11px] text-gray-500">
              Shipping, taxes, and discounts calculated at checkout.
            </p>
            <Link
              to="/cart"
              onClick={closeCart}
              className="selah-button flex h-12 md:h-14 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#E5348A]"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}