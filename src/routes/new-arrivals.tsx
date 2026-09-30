import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading, ErrorState } from "@/components/shared/states";
import { productService } from "@/services/productService";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals - Selah" },
      {
        name: "description",
        content:
          "The latest Selah drops: fresh modest dresses, sets and accessories added to the atelier this season.",
      },
      { property: "og:title", content: "New Arrivals - Selah" },
      { property: "og:description", content: "Fresh modest pieces, added weekly in small runs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewArrivals,
});

function NewArrivals() {
  const query = useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: () => productService.newArrivals(),
  });

  return (
    <StoreLayout>
      <div className="container-page py-8 md:py-14">
        <SectionHeading eyebrow="Just landed" title="New arrivals" />
        {query.isError ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : (
          <ProductGrid products={query.data ?? []} loading={query.isLoading} showRating />
        )}
      </div>
    </StoreLayout>
  );
}
