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
    <div className="container-page py-8 md:py-14">
      <header className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1
          className="text-3xl md:text-5xl"
          style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
        >
          {title}
        </h1>
        {description && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </header>

      <div className="mt-8 flex items-center justify-between gap-4 border-y border-border py-3 md:mt-12">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-xs font-medium lg:hidden">
              <SlidersHorizontal className="size-4" />
              Filters
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-foreground text-[10px] text-background">
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
          <p className="text-xs text-muted-foreground">
            {query.data ? `${query.data.length} pieces` : ""}
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Sort</span>
          <select
            value={filters.sort ?? "featured"}
            onChange={(event) => change({ sort: event.target.value as SortKey })}
            className="h-10 rounded-none border-0 border-b border-border bg-transparent px-1 text-xs font-medium text-foreground outline-none"
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

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
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