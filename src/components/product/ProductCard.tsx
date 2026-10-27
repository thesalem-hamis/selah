import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatProductPrice, is828Product } from "@/lib/format";
import { cn } from "@/lib/utils";
import "@/styles/catalog.css";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { currency } = useCurrency();
  const { add } = useCart();

  return (
    <article
      className={cn(
        "product-card group flex min-w-0 flex-col gap-2 sm:gap-3",
        is828Product(product) && "product-card--828",
        className,
      )}
    >
      <div className="  relative flex aspect-[1/1.12] w-full items-center justify-center overflow-hidden bg-transparet p-0 sm:aspect-4/5 sm:p-[7%]">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block h-full w-full">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500"
          />
        </Link>
        {/* <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          title={`Quick add ${product.name}`}
          className="absolute bottom-2 right-2 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-[#292724] shadow-[0_2px_12px_rgba(41,39,36,.12)] transition hover:bg-[#e5348a] hover:text-white active:scale-95 sm:bottom-3 sm:right-3"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            add(product, {
              size: product.sizes[0] ?? "One Size",
              color: product.colors[0]?.name ?? "Default",
              quantity: 1,
            });
          }}
        >
          <Plus aria-hidden="true" className="size-5" strokeWidth={1.7} />
        </button> */}
      </div>

      <div className="flex flex-col items-center gap-1 px-1 text-center text-[#292724] font-sans">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="text-xs font-medium uppercase leading-snug tracking-[0.06em] transition-colors hover:text-[#777777] sm:text-xs md:text-sm"
        >
          {product.name}
        </Link>
        <span className="text-sm font-semibold tracking-wide text-[#4b4742] sm:text-sm">
          {formatProductPrice(product, currency)}
        </span>
      </div>
    </article>
  );
}
