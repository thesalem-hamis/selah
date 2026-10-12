import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  PackageSearch,
  Search as SearchIcon,
  X as ClearIcon,
  LayoutGrid,
  Square,
} from "lucide-react";
import { useState, useEffect } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { ErrorState } from "@/components/shared/states";
import { productService } from "@/services/productService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Search - Selah Girl Society" },
      { name: "description", content: "Search the Selah catalogue by piece, fabric, colour or collection." },
      { property: "og:title", content: "Search - Selah Girl Society" },
      { property: "og:description", content: "Find your next Selah piece." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchResults,
});

function SearchResults() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();

  // Local state for the inline search input
  const [searchTerm, setSearchTerm] = useState(q);
  // Layout state: 'grid' vs 'single'
  const [columns, setColumns] = useState<"grid" | "single">("grid");

  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  const query = useQuery({
    queryKey: ["search", q],
    queryFn: () => productService.search(q),
    enabled: q.length > 0,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      void navigate({ to: "/search", search: { q: searchTerm.trim() } });
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    void navigate({ to: "/search", search: { q: "" } });
  };

  const resultCount = query.data?.length ?? 0;

  return (
    <StoreLayout>
      <div className="container-page py-10 md:py-16 font-['Alumni_Sans',sans-serif]">
        
        {/* 1. CENTERED PAGE TITLE */}
        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-wide text-center text-[#1A1A1A] mb-8">
          Search results
        </h1>

        {/* 2. INLINE SEARCH INPUT BAR */}
        <div className="max-w-xl mx-auto mb-10">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-gray-500"
          >
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] text-gray-400 leading-none uppercase tracking-wider mb-1">
                Search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-lg md:text-xl font-medium text-[#1A1A1A] outline-none placeholder:text-gray-400 leading-none"
              />
            </div>

            {/* Clear Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear input"
                className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors mr-2"
              >
                <ClearIcon className="size-5 stroke-[1.5]" />
              </button>
            )}

            {/* Divider & Search Icon Button */}
            <div className="h-6 w-[1px] bg-gray-200 mr-3" />
            <button
              type="submit"
              aria-label="Submit search"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <SearchIcon className="size-5 stroke-[1.5]" />
            </button>
          </form>
        </div>

        {/* 3. TOOLBAR ROW: Light Gray/Dark Gray Toggle on left, Results count on right */}
        {q && (
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-8 text-[#1A1A1A]">
            {/* Left: Icon View Switcher (Light Gray vs Dark Gray Active State) */}
            {resultCount > 0 ? (
              <div className="flex items-center gap-1 border border-gray-200 bg-gray-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setColumns("grid")}
                  aria-label="Grid view"
                  className={cn(
                    "p-1.5 transition-all duration-200",
                    columns === "grid"
                      ? "bg-gray-800 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-00"
                  )}
                >
                  <LayoutGrid className="size-4 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => setColumns("single")}
                  aria-label="Single column view"
                  className={cn(
                    "p-1.5 transition-all duration-200",
                    columns === "single"
                      ? "bg-gray-800 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Square className="size-4 stroke-[1.5]" />
                </button>
              </div>
            ) : (
              <div />
            )}

            {/* Right: Results Count */}
            <span className="text-base md:text-lg text-gray-500 tracking-wide font-normal">
              {query.isLoading
                ? "Searching..."
                : `${resultCount} ${resultCount === 1 ? "result" : "results"}`}
            </span>
          </div>
        )}

        {/* 4. PRODUCT CARDS GRID */}
        <div className="w-full flex justify-center">
          {!q ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 border border-gray-200 p-8 max-w-lg w-full mt-4">
              <PackageSearch className="size-12 text-gray-400 stroke-[1.25] mb-4" />
              <h2 className="text-2xl font-medium tracking-wide uppercase text-[#1A1A1A]">
                Start with a word
              </h2>
              <p className="mt-2 text-base md:text-lg text-gray-600 max-w-md">
                Try searching for “abaya”, “linen”, “satin”, or “dress”.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex h-11 items-center justify-center bg-gray-800 px-8 text-base font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-gray-700"
              >
                Browse Everything
              </Link>
            </div>
          ) : query.isError ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : !query.isLoading && resultCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 border border-gray-200 p-8 max-w-lg w-full mt-4">
              <PackageSearch className="size-12 text-gray-400 stroke-[1.25] mb-4" />
              <h2 className="text-2xl font-medium tracking-wide uppercase text-[#1A1A1A]">
                No matches yet
              </h2>
              <p className="mt-2 text-base md:text-lg text-gray-600 max-w-md">
                We couldn't find that piece. Browse our full collection instead.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex h-11 items-center justify-center bg-gray-800 px-8 text-base font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-gray-700"
              >
                Shop All
              </Link>
            </div>
          ) : (
            <div
              className={cn(
                "w-full max-w-7xl mx-auto transition-all duration-300",
                columns === "single"
                  ? "flex flex-col items-center gap-8 max-w-md"
                  : "flex flex-wrap justify-center gap-4 sm:gap-6"
              )}
            >
              {query.data?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={cn(
                    "transition-all duration-300",
                    columns === "single"
                      ? "w-full"
                      : "w-[calc(50%-8px)] sm:w-[260px] md:w-[280px] shrink-0"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Studio Footer Link */}
        <p className="mt-16 text-base text-gray-500 text-center tracking-wide">
          Looking for something custom?{" "}
          <Link to="/about" className="underline text-[#1A1A1A] font-medium hover:text-gray-700 transition-colors">
            Talk to the studio
          </Link>
          .
        </p>
      </div>
    </StoreLayout>
  );
}