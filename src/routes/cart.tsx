import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { OrderSummary } from "@/components/shared/OrderSummary";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const cart = useCart();

  return (
    <StoreLayout>
      <div className="container-page py-12 md:py-20">
        <header className="mb-12 flex flex-col items-center text-center">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">
            Your Selection
          </p>
          <h1
            className="text-4xl text-[#1A1A1A] md:text-5xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Shopping Bag
          </h1>
        </header>

        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center border-y border-[#E5E5E5] py-32 text-center">
            <p className="mb-8 text-[13px] leading-relaxed text-[#444444]">
              Your bag is waiting for something considered.
            </p>
            <Link
              to="/shop"
              className="inline-flex h-14 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
            <div className="border-t border-[#E5E5E5]">
              {cart.items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-6 border-b border-[#E5E5E5] py-8"
                >
                  <Link to="/product/$slug" params={{ slug: item.slug }} className="shrink-0">
                    <div className="h-40 w-32 bg-[#f4f4f4]">
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
                          className="text-[14px] font-medium text-[#1A1A1A] hover:underline hover:decoration-[#E5E5E5] underline-offset-4"
                        >
                          {item.name}
                        </Link>
                        <button
                          aria-label={`Remove ${item.name}`}
                          onClick={() => cart.remove(item.id)}
                          className="text-[#777777] transition-colors hover:text-[#1A1A1A]"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-2 text-[12px] text-[#777777]">
                        Color: <span className="text-[#1A1A1A]">{item.color}</span> / Size: <span className="text-[#1A1A1A]">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex h-12 w-32 items-center border border-[#E5E5E5]">
                        <button
                          className="flex h-full w-10 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#f4f4f4]"
                          onClick={() => cart.setQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-3" strokeWidth={1.5} />
                        </button>
                        <span className="flex-1 text-center text-[13px] font-medium text-[#1A1A1A]">
                          {item.quantity}
                        </span>
                        <button
                          className="flex h-full w-10 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#f4f4f4]"
                          onClick={() => cart.setQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <span className="text-[14px] font-medium tracking-wide text-[#1A1A1A]">
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
