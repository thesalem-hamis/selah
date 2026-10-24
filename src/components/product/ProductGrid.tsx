import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  reviews?: Record<string, { rating: number; reviewsCount: number }>;
  loading?: boolean;
  showRating?: boolean | undefined;
  columns?: 3 | 4;
  skeletonCount?: number;
  viewMode?: "grid" | "list";
}

export function ProductGridSkeleton({
  count = 8,
  columns = 4,
}: {
  count?: number;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 md:gap-x-6",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        "md:grid-cols-3",
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-4/5 w-full rounded-2xl" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  products,
  reviews,
  loading,
  showRating,
  columns = 4,
  skeletonCount = 8,
  viewMode = "grid",
}: ProductGridProps) {
  if (loading) return <ProductGridSkeleton count={skeletonCount} columns={columns} />;

  return (
    <div
      className={cn(
        viewMode === "list"
          ? "grid grid-cols-1 gap-6"
          : "grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 md:grid-cols-3 md:gap-x-6",
        viewMode === "grid" && (columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"),
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
