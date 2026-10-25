import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { SectionHeading } from "@/components/shared/states";
import { categoryService } from "@/services/categoryService";
import { Skeleton } from "@/components/ui/skeleton";
import editorial from "@/assets/editorial.jpg";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections - Selah Modest Fashion" },
      {
        name: "description",
        content:
          "Explore Selah by collection: dresses, tops, bottoms, shoes, bags and accessories, each cut for modest everyday elegance.",
      },
      { property: "og:title", content: "Collections - Selah Modest Fashion" },
      {
        property: "og:description",
        content: "Six edits, one quiet wardrobe. Explore Selah collections.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Collections,
});

function Collections() {
  const cats = useQuery({
    queryKey: ["categories", "counts"],
    queryFn: () => categoryService.withCounts(),
  });

  return (
    <StoreLayout>
      <div className="container-page py-8 md:py-14">
        <SectionHeading eyebrow="Curated edits" title="Collections" />

        {cats.isLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[16/10] w-full rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {(cats.data ?? []).map((category, index) => (
              <Link
                key={category.id}
                to="/category/$slug"
                params={{ slug: category.slug }}
                className={
                  "group relative overflow-hidden rounded-3xl bg-muted " +
                  (index % 3 === 0 ? "md:col-span-2" : "")
                }
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="aspect-[16/11] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] md:aspect-[16/9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-background md:p-8">
                  <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">
                    {category.count} pieces
                  </p>
                  <h2 className="mt-2 font-display text-2xl md:text-3xl">{category.name}</h2>
                  <p className="mt-1 max-w-md text-sm opacity-85">{category.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                    Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <section className="mt-16 grid items-center gap-8 rounded-3xl border border-border bg-surface p-6 md:grid-cols-2 md:p-12">
          <img src={editorial} alt="Selah atelier" loading="lazy" className="rounded-2xl" />
          <div>
            <p className="eyebrow mb-3">Made slowly</p>
            <h2 className="font-display text-3xl md:text-4xl">Small runs, natural fibres</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every Selah collection begins with fabric - crepe, linen, silk-touch viscose - chosen
              to drape rather than cling. We cut in limited quantities so each piece keeps its
              character.
            </p>
            <Link
              to="/shop"
              className="selah-button mt-7 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop the collection
            </Link>
          </div>
        </section>
      </div>
    </StoreLayout>
  );
}
