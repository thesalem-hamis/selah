import { createFileRoute } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";
import { CatalogPage } from "@/components/store/CatalogPage";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All - Selah Modest Fashion" },
      {
        name: "description",
        content:
          "Browse every Selah piece: modest dresses, tailored sets, abayas, knitwear, shoes and accessories. Filter by size, colour and price.",
      },
      { property: "og:title", content: "Shop All - Selah Modest Fashion" },
      {
        property: "og:description",
        content: "Filter the full Selah collection by size, colour, price and availability.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <StoreLayout>
      <CatalogPage
        title="All pieces"
        baseFilters={{}}
      />
    </StoreLayout>
  );
}
