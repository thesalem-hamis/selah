import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { productService } from "@/services/productService";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Search - Selah" },
      { name: "description", content: "Search the Selah catalogue by piece, fabric, colour or collection." },
      { property: "og:title", content: "Search - Selah" },
      { property: "og:description", content: "Find your next Selah piece." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchResults,
});

function SearchResults() {
  const { q } = Route.useSearch();
  const query = useQuery({
    queryKey: ["search", q],
    queryFn: () => productService.search(q),
    enabled: q.length > 0,
  });

  return (
    <StoreLayout>
      <div className="container-page py-8 md:py-14">
        <p className="eyebrow mb-3">Search results</p>
        <h1 className="font-display text-3xl md:text-4xl">
          {q ? `“${q}”` : "What are you looking for?"}
        </h1>
        {q && (
          <p className="mt-3 text-sm text-muted-foreground">
            {query.data ? `${query.data.length} matching pieces` : "Searching the atelier…"}
          </p>
        )}

        <div className="mt-10">
          {!q ? (
            <EmptyState
              icon={PackageSearch}
              title="Start with a word"
              description="Try “abaya”, “linen”, “olive” or “kaftan”."
              actionLabel="Browse everything"
              actionTo="/shop"
            />
          ) : query.isError ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : !query.isLoading && query.data?.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No matches yet"
              description="We couldn't find that piece. Browse the full collection instead."
              actionLabel="Shop all"
              actionTo="/shop"
            />
          ) : (
            <ProductGrid products={query.data ?? []} loading={query.isLoading} showRating />
          )}
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          Looking for something bespoke?{" "}
          <Link to="/about" className="underline">
            Talk to the studio
          </Link>
          .
        </p>
      </div>
    </StoreLayout>
  );
}
