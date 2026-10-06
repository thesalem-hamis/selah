import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, PackageSearch } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterPanel } from "./FilterPanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { productService } from "@/services/productService";
import { useProductReviewSummary } from "@/hooks/useProductReviews";
import type { ProductFilters, SortKey } from "@/types";

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

interface CatalogPageProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Filters that can't be changed by the shopper (e.g. the current category). */
  baseFilters?: ProductFilters;
  viewMode?: "grid" | "list";
}

export function CatalogPage({ eyebrow, title, description, baseFilters, viewMode = "grid" }: CatalogPageProps) {
  const [filters, setFilters] = useState<ProductFilters>({ sort: "featured" });

  const merged = useMemo<ProductFilters>(
    () => ({ ...filters, ...baseFilters }),
    [filters, baseFilters],
  );

  const query = useQuery({
    queryKey: ["products", merged],
    queryFn: () => productService.list(merged),
  });

  const productIds = query.data?.map((p) => p.id) ?? [];
  const reviewsQuery = useProductReviewSummary(productIds);

  const change = (patch: Partial<ProductFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));
  const reset = () => setFilters({ sort: filters.sort ?? "featured" });

  const activeCount = [
    filters.sizes?.length,
    filters.colors?.length,
    filters.inStockOnly ? 1 : 0,
    filters.onSaleOnly ? 1 : 0,
    filters.minRating ? 1 : 0,
    filters.maxPrice ? 1 : 0,
  ].reduce<number>((sum, value) => sum + (value ?? 0), 0);

  return (
    <div className="container-page py-12 md:py-16">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 mb-8 text-[12px]">
        <div className="font-medium text-[#1A1A1A]">
          {title} {!baseFilters?.category && "+"}
        </div>
        <div className="flex items-center gap-6 text-[#1A1A1A]">
          <label className="flex items-center gap-2">
            <span className="text-[#777777]">Sort:</span>
            <select
              value={filters.sort ?? "featured"}
              onChange={(event) => change({ sort: event.target.value as SortKey })}
              className="bg-transparent outline-none font-medium cursor-pointer"
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Sheet>
            <SheetTrigger className="font-medium hover:text-[#777777] transition-colors">
              Refine
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] overflow-y-auto p-6 sm:max-w-sm">
              <div className="mt-6">
                <FilterPanel filters={filters} onChange={change} onReset={reset} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div>
        {query.isError ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : !query.isLoading && query.data?.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Nothing matches those filters"
            description="Try widening your price range or clearing a filter or two."
            actionLabel="Clear filters"
            onAction={reset}
          />
        ) : (
          <ProductGrid
            products={query.data ?? []}
            reviews={reviewsQuery.data ?? {}}
            loading={query.isLoading || reviewsQuery.isLoading}
            columns={4}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
}