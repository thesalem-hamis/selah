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
    <div className="container-page py-12 md:py-20">
      <header className="mb-16 flex flex-col items-center text-center">
        {eyebrow && <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFC0CB]">{eyebrow}</p>}
        <h1
          className="text-4xl text-[#1A1A1A] md:text-6xl"
          style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
        >
          {title}
        </h1>
        {description && <p className="mt-6 max-w-xl text-[14px] leading-relaxed text-[#444444]">{description}</p>}
      </header>

      <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-y border-[#E5E5E5] py-4">
        <div className="flex items-center justify-between md:justify-start gap-4">
          <Sheet>
            <SheetTrigger className="inline-flex h-12 items-center gap-2 border border-[#1A1A1A] bg-white px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white lg:hidden">
              <SlidersHorizontal className="size-4" />
              Filters
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center bg-[#FFC0CB] text-[10px] text-[#1A1A1A]">
                  {activeCount}
                </span>
              )}
            </SheetTrigger>
            <SheetContent side="left" className="w-[86vw] overflow-y-auto p-6 sm:max-w-sm">
              <div className="mt-6">
                <FilterPanel filters={filters} onChange={change} onReset={reset} />
              </div>
            </SheetContent>
          </Sheet>
          <p className="text-[12px] font-medium tracking-wide text-[#777777]">
            {query.data ? `${query.data.length} PIECES` : ""}
          </p>
        </div>

        <label className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
          <span className="hidden sm:inline">Sort By</span>
          <select
            value={filters.sort ?? "featured"}
            onChange={(event) => change({ sort: event.target.value as SortKey })}
            className="h-10 border-0 border-b border-[#1A1A1A] bg-transparent px-1 text-[13px] font-medium text-[#1A1A1A] outline-none"
            aria-label="Sort products"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <FilterPanel filters={filters} onChange={change} onReset={reset} />
          </div>
        </aside>

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
              columns={3}
              showRating
              viewMode={viewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}