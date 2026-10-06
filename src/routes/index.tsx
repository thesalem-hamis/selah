import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services/productService";
import { useProductReviewSummary } from "@/hooks/useProductReviews";
import { products } from "@/data/catalog";
import { Hero } from "@/components/store/Hero";
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

      {/* First Drop - Clean White Grid */}
      <section id="first-drop" className="bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2
              className="text-4xl md:text-5xl text-[#1a1a1a]"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
            >
              Daughters of the King
            </h2>
            <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-[#444444]">
              Each piece is a declaration: modest, intentional, and unapologetically beautiful. 
              Limited garments, crafted with prayer and purpose.
            </p>
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

          <div className="mt-16 flex justify-center">
            <Link
              to="/shop"
              className="flex h-12 md:h-14 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story - 50/50 Split Pink Block */}
      <section className="border-t border-b border-[#E5E5E5] bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center bg-[#FFF5F7] px-8 py-20 lg:px-20 lg:py-32">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]">
              Our Philosophy
            </p>
            <h2
              className="text-4xl leading-tight text-[#1A1A1A] md:text-5xl"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
            >
              Created to Glorify. <br/>Designed to Inspire.
            </h2>
            <div className="mt-8 space-y-5 text-[14px] leading-relaxed text-[#1A1A1A]/80">
              <p>
                Selah Girl Society was born from a simple conviction: that godly women deserve clothing that reflects the beauty of their faith. Not loud, not flashy, but quietly powerful.
              </p>
              <p>
                We design for the woman who prays before she plans, who serves before she speaks, and who knows that true beauty is found in a heart surrendered to God.
              </p>
            </div>
            
            <div className="mt-10">
              <Link
                to="/about"
                className="inline-flex h-12 md:h-14 items-center justify-center border border-[#1A1A1A] bg-transparent px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
              >
                Read Our Story
              </Link>
            </div>
          </div>
          
          <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:h-full">
            <img
              src="/sg1.jpeg"
              alt="Selah Girl Society Editorial"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pakistan Journey - 50/50 Split Black Block */}
      <section className="bg-[#1A1A1A]">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-20 lg:px-20 lg:py-32 order-1 lg:order-2">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#BBBBBB]">
              Our Craftsmanship
            </p>
            <h2
              className="text-4xl leading-tight text-white md:text-5xl"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
            >
              The Pakistan Journey
            </h2>
            <div className="mt-8 space-y-5 text-[14px] leading-relaxed text-[#BBBBBB]">
              <p>
                True luxury is found in the dignity of the hands that make it. We travelled to Pakistan to build direct relationships with family-owned facilities that prioritize ethical labor.
              </p>
              <p>
                Every piece is cut, sewn, and finished by skilled artisans working in safe conditions and earning fair wages. 
              </p>
            </div>
            
            <div className="mt-10">
              <Link
                to="/pakistan-journey"
                className="inline-flex h-12 md:h-14 items-center justify-center border border-white bg-transparent px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[#1A1A1A]"
              >
                Read The Journey
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:h-full order-2 lg:order-1 bg-[#f4f4f4]">
            <img 
              src="/sg2.jpg"
              alt="Artisan Craftsmanship"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}