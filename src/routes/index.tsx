import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { Collections } from "@/components/store/Collection";
// import { Showcase } from "@/components/store/Showcase";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services/productService";
import { useProductReviewSummary } from "@/hooks/useProductReviews";
import { products } from "@/data/catalog";
import { Hero } from "@/components/store/Hero";
import { NewsTicker } from "@/components/store/NewsTricker";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Selah Girl Society - Modest Fashion for Women of Faith" },
      {
        name: "description",
        content: "Faith-led modest fashion for women choosing to live intentionally. Designed for daughters of the King.",
      },
    ],
  }),
  component: Home,
});

const firstDropFilters = { sort: "featured" as const };

const moreCollection = [p4, p5, p6, p7].map((image, index) => ({
  image,
  ...products[index + 3],
}));

function Home() {
  const firstDropQuery = useQuery({
    queryKey: ["products", firstDropFilters],
    queryFn: () => productService.list(firstDropFilters),
  });

  const firstDrop = useMemo(
    () => (firstDropQuery.data ?? []).slice(0, 4),
    [firstDropQuery.data],
  );
  const firstDropReviews = useProductReviewSummary(firstDrop.map((product) => product.id));

  return (
    <StoreLayout>
      {/* Hero */}
      <Hero />

      {/* News Ticker */}
      <NewsTicker />

      {/* First Drop - Clean White Grid */}
      <section id="first-drop" className="bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2
              className="text-4xl md:text-5xl text-[#1a1a1a]"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 400 }}
            >
              NEW ARRIVALS
            </h2>
            {/* <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-[#444444]">
              Each piece is a declaration: modest, intentional, and unapologetically beautiful. 
              Limited garments, crafted with prayer and purpose.
            </p> */}
          </div>

          {firstDropQuery.isError ? (
            <ErrorState onRetry={() => void firstDropQuery.refetch()} />
          ) : firstDropQuery.isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="aspect-[3/4] w-full bg-[#f4f4f4]" />
                  <Skeleton className="mt-4 h-4 w-3/4 bg-[#eaeaea]" />
                  <Skeleton className="mt-2 h-3 w-1/3 bg-[#eaeaea]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {firstDrop.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          <div className="mt-12 md:mt-16 flex justify-center">
            <Link
              to="/shop"
              className="flex h-9 md:h-10 items-center justify-center border border-transparent bg-[#1A1A1A] px-6 md:px-8 text-base md:text-lg font-light uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-black font-['Alumni_Sans',sans-serif]"
            >
              VIEW ALL
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <Collections />

      {/* Interactive Rail Showcase Section */}
      {/* <Showcase /> */}
    </StoreLayout>
  );
}