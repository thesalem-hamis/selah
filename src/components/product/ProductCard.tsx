// import { Link } from "@tanstack/react-router";
// import type { Product } from "@/types";
// import { formatPrice } from "@/lib/format";
// import { cn } from "@/lib/utils";

// interface ProductCardProps {
//   product: Product;
//   className?: string;
// }

// export function ProductCard({ product, className }: ProductCardProps) {
//   return (
//     <article className={cn("group flex flex-col gap-3", className)}>
//       <Link
//         to="/product/$slug"
//         params={{ slug: product.slug }}
//         className="block"
//       >
//         <div className="bg-[#f4f4f4] w-full flex items-center justify-center p-0 md:p-6 aspect-[4/5]">
//           <img
//             src={product.images[0]}
//             alt={product.name}
//             loading="lazy"
//             className="w-full h-full object-cover md:object-contain transition-opacity duration-300 hover:opacity-80"
//           />
//         </div>
//       </Link>

//       <div className="flex items-start justify-between gap-3 text-[11px] text-[#1A1A1A]">
//         <Link to="/product/$slug" params={{ slug: product.slug }} className="truncate hover:text-[#777777] transition-colors">
//           {product.name}
//         </Link>
//         <span className="shrink-0">{formatPrice(product.price)}</span>
//       </div>
//     </article>
//   );
// }

import { Link } from "@tanstack/react-router";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react"; // or your preferred icon import

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article className={cn("group flex flex-col gap-3", className)}>
      {/* IMAGE CONTAINER WITH LIGHT PINK BACKGROUND */}
      <div className="relative overflow-hidden bg-[#FDF0F5] w-full p-3 md:p-6 aspect-[4/5] flex items-center justify-center">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block w-full h-full"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* QUICK ADD PLUS BUTTON */}
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 flex items-center justify-center size-9 md:size-10 bg-white/95 backdrop-blur-sm border border-black/5 text-[#1a1a1a] shadow-sm transition-all duration-300 hover:bg-[#1a1a1a] hover:text-white hover:scale-105 active:scale-95 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Trigger cart function here
          }}
        >
          <Plus className="size-5 md:size-6 stroke-[1.5]" />
        </button>
      </div>

      {/* TEXT CONTENT - ALIGNED LEFT */}
      <div className="flex flex-col items-start gap-1 text-[#1A1A1A] font-['Alumni_Sans',sans-serif]">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="uppercase text-sm md:text-base font-medium tracking-widest hover:text-[#777777] transition-colors leading-tight"
        >
          {product.name}
        </Link>
        <span className="text-sm md:text-base font-normal tracking-wide text-[#555555]">
          {formatPrice(product.price)}
        </span>
      </div>
    </article>
  );
}