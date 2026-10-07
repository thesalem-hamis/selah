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
          className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[100] flex h-full w-full flex-col bg-white transition-transform duration-300 ease-in-out sm:w-[450px] border-l border-[#E5E5E5]",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 md:h-24 shrink-0 items-center justify-between border-b border-[#E5E5E5] px-6">
          <h2 className="text-[13px] font-bold tracking-[0.2em] text-[#1A1A1A]">SHOPPING BAG</h2>
          <button
            onClick={closeCart}
            className="flex items-center justify-center text-[#1A1A1A] hover:opacity-60 transition-opacity"
            aria-label="Close cart"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
              <p className="text-[13px] tracking-wide text-[#777777]">Your bag is currently empty.</p>
              <button
                onClick={closeCart}
                className="inline-flex h-12 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-32 w-24 shrink-0 bg-[#f4f4f4]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <Link
                          to="/product/$slug"
                          params={{ slug: item.slug }}
                          onClick={closeCart}
                          className="text-[13px] font-medium text-[#1A1A1A] hover:underline"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-[#777777] hover:text-[#1A1A1A] transition-colors"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] text-[#777777]">
                        Size: {item.size}
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="flex h-8 items-center border border-[#E5E5E5]">
                        <button
                          className="flex h-full w-8 items-center justify-center text-[#1A1A1A] hover:bg-[#f4f4f4] transition-colors"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-3" strokeWidth={1.5} />
                        </button>
                        <span className="flex h-full w-8 items-center justify-center text-[12px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="flex h-full w-8 items-center justify-center text-[#1A1A1A] hover:bg-[#f4f4f4] transition-colors"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
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

        {items.length > 0 && (
          <div className="border-t border-[#E5E5E5] bg-[#FDFDFD] p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[13px] font-bold tracking-[0.1em] text-[#1A1A1A]">SUBTOTAL</span>
              <span className="text-[14px] font-medium text-[#1A1A1A]">{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-6 text-[11px] text-[#777777]">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              to="/cart"
              onClick={closeCart}
              className="flex h-14 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

