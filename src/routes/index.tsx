import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ArrowRight, Clock, Globe2, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services/productService";
import { useProductReviewSummary } from "@/hooks/useProductReviews";
import { products } from "@/data/catalog";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Selah Girl Society - Modest Fashion" },
      {
        name: "description",
        content: "Faith-led modest fashion for women choosing to live intentionally.",
      },
    ],
  }),
  component: Home,
});

/** Shares react-query's cache with /shop, so the drop is whatever the shop page returns. */
const firstDropFilters = { sort: "featured" as const };

const moreCollection = [p4, p5, p6, p7].map((image, index) => ({
  image,
  ...products[index + 3],
}));

const shippingStandards = [
  { icon: Globe2, title: "Worldwide delivery", copy: "Tracked courier to 40+ countries, Pakistan included." },
  { icon: Clock, title: "5–7 working days", copy: "UK next day, Karachi, Lahore and Islamabad in a week." },
  { icon: ShieldCheck, title: "Duties at checkout", copy: "No surprise fees on delivery - calculated before you pay." },
  { icon: PackageCheck, title: "14-day returns", copy: "Unworn, tags on, return shipping on us within 14 days." },
];

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
      <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-foreground md:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)]">
        <div className="absolute inset-0">
          <video
            className="size-full object-cover object-center"
            src="/selah-vid.mp4"
            poster="/h1.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Selah Girl Society campaign film"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.35)_100%)]" />
        </div>

        <div className="container-page relative px-6 py-16 md:py-24">
          <div className="max-w-3xl text-white">
            <div className="animate-fade-up mb-6 inline-flex items-center gap-3">
              <span className="relative text-xs uppercase tracking-widest text-white/85">
                The First Drop · 2026
                <span className="absolute bottom-[-4px] left-0 h-px w-full bg-white/40" />
              </span>
            </div>

            <h1
              className="animate-fade-up mb-6 text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300, letterSpacing: "-0.02em", animationDelay: "100ms" }}
            >
              <span className="block">Dressed in faith,</span>
              <span className="block">worn with grace.</span>
            </h1>

            <p
              className="animate-fade-up mb-10 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl"
              style={{ fontFamily: "var(--font-selah)", fontStyle: "italic", fontWeight: 300, animationDelay: "200ms" }}
            >
              Modest silhouettes for the woman who moves with quiet confidence.
            </p>

            <div
              className="animate-fade-up flex flex-col items-center gap-4 sm:flex-row"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                to="/shop"
                className="group inline-flex h-14 items-center justify-center gap-3 bg-white px-8 text-sm font-medium tracking-wide text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                <span>Shop the drop</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to="/new-arrivals"
                className="inline-flex h-14 items-center justify-center gap-3 border border-white/45 px-8 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                New arrivals
              </Link>
            </div>
          </div>
        </div>

        <a
          href="#first-drop"
          className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white md:flex"
        >
          Scroll
          <span className="animate-bounce-slow block h-8 w-px bg-white/50" aria-hidden="true" />
        </a>
      </section>

      {/* First Drop */}
      <section id="first-drop" className="container-page scroll-mt-24 py-16 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="eyebrow mb-2">Exclusive</p>
            <h2 className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-selah)", fontWeight: 400 }}>
              The First Drop
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Four pieces, cut once and never repeated. When a size goes, it is gone for good.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium underline underline-offset-4 md:inline-flex"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {firstDropQuery.isError ? (
          <ErrorState onRetry={() => void firstDropQuery.refetch()} />
        ) : firstDropQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="aspect-4/5 w-full" />
                <Skeleton className="mt-3.5 h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {firstDrop.map((product) => {
              const review = firstDropReviews.data?.[product.id];
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  showRating
                  {...(review && { review })}
                />
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Selah Girl Society */}
      <section className="bg-sand/40 py-16 md:py-24">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/sg1.jpeg"
                alt="The Selah Girl Society studio"
                loading="lazy"
                className="aspect-4/5 w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 hidden rounded-2xl border border-border bg-surface px-6 py-5 shadow-lift sm:block">
              <p className="text-2xl font-display" style={{ fontFamily: "var(--font-selah)" }}>
                UK
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Designed &amp; made
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow mb-4">Selah Girl Society</p>
            <h2
              className="text-3xl leading-tight md:text-5xl"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300, letterSpacing: "-0.01em" }}
            >
              Modesty is not a limitation. It is a language.
            </h2>
            <p
              className="mt-5 text-base leading-relaxed text-foreground/75 md:text-lg"
              style={{ fontFamily: "var(--font-selah)", fontStyle: "italic", fontWeight: 300 }}
            >
              Selah Girl Society was born for women who choose to dress with intention - pieces
              that honour your values without compromising on beauty.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Every piece is cut generously, finished by hand and produced in small batches. No
              restocks, no shortcuts, no trend-chasing. Just clothing that lets you move through
              the world the way you actually live in it.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                { value: "40+", label: "Countries served" },
                { value: "16", label: "Sizes per style" },
                { value: "100%", label: "Small batch" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-selah)" }}>
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              to="/about"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
            >
              Read our story
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Worldwide shipping */}
      <section className="container-page py-16 md:py-24">
        <div className="grid items-center gap-8 rounded-3xl bg-foreground px-6 py-12 text-background md:px-14 md:py-16 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-background/70">
              <Truck className="size-4" aria-hidden="true" />
              Worldwide shipping
            </p>
            <h2
              className="text-3xl leading-tight md:text-4xl"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300, letterSpacing: "-0.01em" }}
            >
              Now delivering to Pakistan.
            </h2>
            <p
              className="mt-4 max-w-lg text-base leading-relaxed text-background/75"
              style={{ fontFamily: "var(--font-selah)", fontStyle: "italic", fontWeight: 300 }}
            >
              From our studio in UK to Karachi, Lahore and Islamabad - tracked, duty-cleared and
              packed the same way we pack every order that leaves the door.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link
                to="/shop"
                className="group inline-flex h-12 items-center justify-center gap-2 bg-background px-7 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
              >
                Shop from Pakistan
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <p className="text-xs uppercase tracking-[0.18em] text-background/60">
                Duties &amp; taxes shown at checkout
              </p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {shippingStandards.map(({ icon: Icon, title, copy }) => (
              <li key={title} className="rounded-2xl border border-background/15 bg-background/5 p-5">
                <Icon className="size-5 text-background/80" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-3 text-sm font-medium">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-background/65">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* More collection */}
      <section className="container-page pb-16 pt-4 md:pb-24">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-2">More from the collection</p>
          <h2 className="text-2xl md:text-4xl" style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}>
            Worn with intention
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {moreCollection.map((item) => (
            item.slug ? (
              <Link key={item.slug} to="/product/$slug" params={{ slug: item.slug }} className="group">
                <div className="overflow-hidden rounded-2xl bg-sand/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p
                  className="mt-3 px-1 text-xs leading-snug md:text-sm"
                  style={{ fontFamily: "var(--font-selah)", fontWeight: 400 }}
                >
                  {item.name}
                </p>
              </Link>
            ) : null
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-foreground/20 px-8 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            Shop everything
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}