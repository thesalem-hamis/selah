import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { OrderSummary } from "@/components/shared/OrderSummary";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const cart = useCart();

  return (
    <StoreLayout>
      <div className="container-page py-12 md:py-20 font-['Alumni_Sans',sans-serif]">
        <header className="mb-12 flex flex-col items-center text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#E5348A]">
            Your Selection
          </p>
          <h1 className="text-3xl md:text-5xl font-light uppercase tracking-wide text-[#1A1A1A]">
            Shopping Bag
          </h1>
        </header>

        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center border-y border-black/10 py-32 text-center bg-[#FDF0F5]/30">
            <p className="mb-8 text-lg md:text-xl tracking-wide text-gray-600 font-sans">
              Your bag is waiting for something considered.
            </p>
            <Link
              to="/shop"
              className="inline-flex h-12 items-center justify-center bg-[#1A1A1A] px-10 text-base font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#E5348A]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
            <div className="border-t border-black/10">
              {cart.items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-6 border-b border-black/10 py-8"
                >
                  <Link to="/product/$slug" params={{ slug: item.slug }} className="shrink-0">
                    <div className="h-40 w-32 bg-[#FDF0F5] p-1 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <Link
                          to="/product/$slug"
                          params={{ slug: item.slug }}
                          className="text-lg md:text-xl font-medium uppercase tracking-wide text-[#1A1A1A] hover:text-[#E5348A] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          aria-label={`Remove ${item.name}`}
                          onClick={() => cart.remove(item.id)}
                          className="text-gray-400 transition-colors hover:text-[#E5348A]"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-2 text-sm md:text-base text-gray-500 uppercase tracking-wide">
                        Size: <span className="text-[#1A1A1A] font-semibold">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex h-10 w-28 items-center border border-black/10 bg-white">
                        <button
                          className="flex h-full w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-black/5"
                          onClick={() => cart.setQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="size-3" strokeWidth={1.5} />
                        </button>
                        <span className="flex-1 text-center text-base font-semibold text-[#1A1A1A]">
                          {item.quantity}
                        </span>
                        <button
                          className="flex h-full w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-black/5"
                          onClick={() => cart.setQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <span className="text-base md:text-lg font-semibold tracking-wide text-[#1A1A1A]">
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
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}