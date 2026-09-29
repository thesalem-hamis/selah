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
      <section className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)] flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/h1.jpg"
            alt="Selah Girl Society"
            className="h-full w-full object-cover object-center"
            style={{ transform: "translateZ(0)" }}
          />
          {/* Layered gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.15)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent md:hidden" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-foreground/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>

        {/* Content */}
        <div className="relative w-full container-page px-6 pt-6 md:pt-10 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
          <div className="max-w-3xl mx-auto text-center md:text-left">
            {/* Eyebrow with animated underline */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="eyebrow text-xs tracking-widest uppercase relative">
                The First Drop · 2026
                <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-foreground/40" />
              </span>
            </div>

            {/* Main Headline with staggered animation */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300, letterSpacing: "-0.02em" }}
            >
              <span className="block animate-fade-up">Dressed in faith,</span>
              <span className="block animate-fade-up" style={{ animationDelay: "100ms" }}>worn with grace.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground/90 max-w-xl mb-10 animate-fade-up"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300, fontStyle: "italic", animationDelay: "200ms" }}
            >
              Modest silhouettes for the woman who moves with quiet confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-4 mb-12 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <Link
                to="/shop"
                className="group inline-flex h-14 px-8 items-center justify-center gap-3 bg-foreground text-background text-sm font-medium tracking-wide relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
              >
                <span className="relative z-10">Shop the drop</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                <span className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" aria-hidden="true" />
              </Link>
              <Link
                to="/new-arrivals"
                className="inline-flex h-14 px-8 items-center justify-center gap-3 border border-foreground/30 text-sm font-medium tracking-wide text-foreground transition-all duration-300 hover:bg-foreground/5 hover:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
              >
                New arrivals
              </Link>
            </div>

            {/* Brand mark with subtle animation */}
            <div className="flex items-center justify-center gap-4 animate-fade-up pb-6 md:pb-0" style={{ animationDelay: "400ms" }}>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground/70 font-medium">
                Selah Girl Society
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Small writeup */}
      <section className="container-page pt-4 md:py-20 max-w-3xl mx-auto text-center">
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