import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, PackageSearch } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterPanel } from "./FilterPanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { productService } from "@/services/productService";
import { useProductReviewSummary } from "@/hooks/useProductReviews";
import type { ProductFilters, SortKey } from "@/types";
import { useRouterState } from "@tanstack/react-router";
import { is828Product, isTeeProduct } from "@/lib/format";
import "@/styles/catalog.css";

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
  const locationHref = useRouterState({ select: (state) => state.location.href });
  const collectionFromUrl = locationHref.includes("collection=828-series")
    ? "828"
    : locationHref.includes("collection=white-baby-tees")
      ? "white-tees"
      : "all";
  const [activeTab, setActiveTab] = useState(collectionFromUrl);
  const [filters, setFilters] = useState<ProductFilters>({ sort: "featured" });

  useEffect(() => setActiveTab(collectionFromUrl), [collectionFromUrl]);

  const merged = useMemo<ProductFilters>(
    () => ({ ...filters, ...baseFilters }),
    [filters, baseFilters],
  );

  const query = useQuery({
    queryKey: ["products", merged],
    queryFn: () => productService.list(merged),
  });

  const tabProductsQuery = useQuery({
    queryKey: ["products", { sort: "featured" }],
    queryFn: () => productService.list({ sort: "featured" }),
    enabled: !baseFilters?.category,
    staleTime: 60_000,
  });

  const productIds = query.data?.map((p) => p.id) ?? [];
  const reviewsQuery = useProductReviewSummary(productIds);

  const change = (patch: Partial<ProductFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));
  const reset = () => setFilters({ sort: filters.sort ?? "featured" });

  const categories = [...new Set((tabProductsQuery.data ?? []).map((product) => product.category))]
    .filter((category) => category && !/828|tee/i.test(category))
    .sort();
  const tabs = [
    { id: "all", label: "All" },
    { id: "828", label: "828" },
    { id: "white-tees", label: "White baby tees" },
    ...categories.map((category) => ({
      id: `category:${category}`,
      label: category.replace(/[-_]+/g, " "),
    })),
  ];
  const visibleProducts = (query.data ?? []).filter((product) => {
    if (activeTab === "828") return is828Product(product);
    if (activeTab === "white-tees") {
      const text = [product.name, product.category, product.subcategory, ...product.tags]
        .join(" ")
        .toLowerCase();
      return /white.{0,14}baby.{0,14}tee|baby.{0,14}tee.{0,14}white/.test(text) ||
        (/white|selah girls|pretty and prayed up|babe,? i love jesus|ask me about jesus/i.test(product.name) && isTeeProduct(product) && !is828Product(product));
    }
    if (activeTab.startsWith("category:")) {
      return product.category === activeTab.slice("category:".length);
    }
    return true;
  });
  const is828Selection = activeTab === "828";

  const activeCount = [
    filters.sizes?.length,
    filters.colors?.length,
    filters.inStockOnly ? 1 : 0,
    filters.onSaleOnly ? 1 : 0,
    filters.minRating ? 1 : 0,
    filters.maxPrice ? 1 : 0,
  ].reduce<number>((sum, value) => sum + (value ?? 0), 0);

  return (
    <div className={`catalog-page mx-auto w-full max-w-[1600px] px-3 py-10 sm:px-6 md:py-16 lg:px-10${is828Selection ? " catalog-page--828" : ""}`}>
      {!baseFilters?.category && (
        <nav className="catalog-tabs mb-7 -mx-3 overflow-x-auto border-b border-[#d8d2ca] px-3 sm:mx-0 sm:px-0" role="tablist" aria-label="Shop categories">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`catalog-tabs__tab${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}
      {/* <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 mb-8 text-[12px]">
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
      </div> */}

      <div>
        {query.isError ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : !query.isLoading && visibleProducts.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Nothing matches those filters"
            description="Try widening your price range or clearing a filter or two."
            actionLabel="Clear filters"
            onAction={reset}
          />
        ) : (
          <ProductGrid
            products={visibleProducts}
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
