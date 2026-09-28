import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Selah Girl Society - Modest Fashion" },
      { name: "description", content: "Faith-led modest fashion for women choosing to live intentionally." },
    ],
  }),
  component: Home,
});

const firstDrop = [
  { name: "Amara Satin Maxi Dress", price: "£68,500", image: p1, slug: "amara-satin-maxi-dress" },
  { name: "Noor Pleated Open Abaya", price: "£74,000", image: p2, slug: "noor-pleated-open-abaya" },
  { name: "Zahra Balloon-Sleeve Blouse", price: "£32,500", image: p3, slug: "zahra-balloon-sleeve-blouse" },
  { name: "Amina Linen Two-Piece Set", price: "£59,000", image: p8, slug: "amina-linen-two-piece-set" },
];

const galleryImages = [p4, p5, p6, p7, p3, p2];

function Home() {
  return (
    <StoreLayout>

      {/* Hero */}
      <section className="relative flex flex-col md:grid md:grid-cols-2 min-h-[70vh] md:min-h-[80vh]">
        {/* Image side */}
        <div className="relative w-full md:order-1">
          <div className="aspect-video md:aspect-auto md:h-full">
            <img
              src="/h1.jpg"
              alt="Selah Girl Society"
              className="h-full w-full object-cover object-center object-[center_top]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:hidden" />
        </div>

        {/* Text side */}
        <div className="flex flex-col items-center justify-center gap-6 px-6 py-12 text-center md:items-stretch md:text-left md:px-8 md:py-16 lg:px-20">
          <p className="eyebrow text-xs tracking-wider">The First Drop · 2026</p>
          <h1
            className="text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300, letterSpacing: "-0.01em" }}
          >
            Dressed in faith,<br />worn with grace.
          </h1>
          <p
            className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300, fontStyle: "italic" }}
          >
            Modest silhouettes for the woman who moves with quiet confidence.
          </p>
          <div className="flex w-full flex-wrap justify-center gap-3 sm:justify-start">
            <Link
              to="/shop"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 bg-foreground px-7 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Shop the drop
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/new-arrivals"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center border border-foreground/25 px-7 text-sm font-medium transition-colors hover:border-foreground"
            >
              New arrivals
            </Link>
          </div>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Selah Girl Society
          </p>
        </div>
      </section>

      {/* Small writeup */}
      <section className="container-page py-12 md:py-20 max-w-3xl mx-auto text-center">
        <p className="eyebrow mb-3">Who we are</p>
        <h2
          className="text-2xl md:text-4xl leading-snug"
          style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
        >
          We believe modesty is not a limitation - it is a language.
        </h2>
        <p
          className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground"
          style={{ fontFamily: "var(--font-selah)", fontStyle: "italic" }}
        >
          Selah Girl Society was born for women who choose to dress with intention,
          crafting pieces that honour your values without compromising on beauty.
        </p>
      </section>

      {/* First Drop */}
      <section className="container-page pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="eyebrow mb-2">Exclusive</p>
            <h2
              className="text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 400 }}
            >
              The First Drop
            </h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {firstDrop.map((item) => (
            <Link
              key={item.slug}
              to="/product/$slug"
              params={{ slug: item.slug }}
              className="group"
            >
              <div className="overflow-hidden rounded-2xl bg-sand/30">
                <img
                  src={item.image}
                  alt={item.name}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 px-1">
                <p
                  className="text-xs md:text-sm leading-snug"
                  style={{ fontFamily: "var(--font-selah)", fontWeight: 400 }}
                >
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Freedom Mission */}
      <section className="bg-sand/40 py-16 md:py-24">
        <div className="container-page max-w-2xl mx-auto text-center">
          <p className="eyebrow mb-4">Our Mission</p>
          <h2
            className="text-3xl md:text-5xl leading-tight"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300, letterSpacing: "-0.01em" }}
          >
            Freedom looks like this.
          </h2>
          <p
            className="mt-4 text-lg md:text-xl leading-relaxed text-foreground/75"
            style={{ fontFamily: "var(--font-selah)", fontStyle: "italic", fontWeight: 300 }}
          >
            To dress modestly is to choose yourself - your values, your story, your freedom.
            We exist to make that choice beautiful.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
          >
            Read our story
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Product gallery */}
      <section className="container-page py-12 md:py-20">
        <p className="eyebrow mb-2 text-center">The Collection</p>
        <h2
          className="text-center text-2xl md:text-4xl mb-8"
          style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
        >
          Worn with intention
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl ${i === 0 || i === 3 ? "row-span-2" : ""}`}
            >
              <img
                src={img}
                alt={`Selah collection ${i + 1}`}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 hover:scale-105 ${
                  i === 0 || i === 3 ? "h-full" : "aspect-square"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
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