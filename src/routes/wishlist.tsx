import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState, SectionHeading } from "@/components/shared/states";
import { productService } from "@/services/productService";
import { useWishlist } from "@/context/WishlistContext";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist - Selah" },
      { name: "description", content: "The Selah pieces you've saved for later, kept on this device." },
      { property: "og:title", content: "Your Wishlist - Selah" },
      { property: "og:description", content: "Saved Selah pieces, ready when you are." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids, clear } = useWishlist();
  const query = useQuery({ queryKey: ["products", "all"], queryFn: () => productService.list() });
  const saved = (query.data ?? []).filter((product) => ids.includes(product.id));

  return (
    <StoreLayout>
      <div className="container-page py-8 md:py-14">
        <SectionHeading
          eyebrow="Saved for later"
          title="Your wishlist"
          action={
            saved.length > 0 ? (
              <button
                onClick={clear}
                className="text-xs uppercase tracking-[0.14em] text-muted-foreground underline"
              >
                Clear all
              </button>
            ) : null
          }
        />
        {ids.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any piece to keep it here while you decide."
            actionLabel="Browse the collection"
            actionTo="/shop"
          />
        ) : (
          <ProductGrid products={saved} loading={query.isLoading} showRating />
        )}
      </div>
    </StoreLayout>
  );
}
