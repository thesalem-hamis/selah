import { Link } from "@tanstack/react-router";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article className={cn("group flex flex-col gap-3", className)}>
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block"
      >
        <div className="bg-[#f4f4f4] w-full flex items-center justify-center p-0 md:p-6 aspect-[4/5]">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover md:object-contain transition-opacity duration-300 hover:opacity-80"
          />
        </div>
      </Link>

      <div className="flex items-start justify-between gap-3 text-[11px] text-[#1A1A1A]">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="truncate hover:text-[#777777] transition-colors">
          {product.name}
        </Link>
        <span className="shrink-0">{formatPrice(product.price)}</span>
      </div>
    </article>
  );
}