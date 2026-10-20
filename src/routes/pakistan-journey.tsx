import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ChromeOrnament } from "@/components/store/ChromeOrnament";

export const Route = createFileRoute("/pakistan-journey")({
  head: () => ({
    meta: [
      { title: "Inner City Mission: Freedom Pakistan | Selah Girl Society" },
      { name: "description", content: "Discover Selah Girl Society's partnership with Inner City Mission, Freedom Pakistan Mission." },
    ],
  }),
  component: PakistanJourney,
});

function PakistanJourney() {
  return <StoreLayout>
    <main className="bg-[#f7f4ef] text-[#292724]">
      <section className="relative flex min-h-[68vh] items-center justify-center overflow-hidden bg-cover bg-center px-6 text-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2940&auto=format&fit=crop")' }}>
        <div className="absolute inset-0 bg-[#292724]/45" />
        <div className="relative max-w-4xl py-24 text-white">
          <p className="mb-5 text-xs uppercase tracking-[0.28em]">Our faith in action</p>
          <h1 className="font-display text-4xl leading-tight md:text-7xl">Inner City Mission:<br />Freedom Pakistan</h1>
        </div>
      </section>
      <section className="container-page grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <figure className="relative mx-auto w-full max-w-xl rounded-[2rem] border border-[#b9b8b5] p-3 shadow-[0_18px_55px_rgba(41,39,36,.10)]">
          <img src="/selah-main.jpeg" alt="Selah Girl Society campaign portrait" className="aspect-[4/5] w-full rounded-[1.4rem] object-cover" />
          <figcaption className="absolute bottom-7 left-7 flex items-center gap-3 rounded-full border border-white/70 bg-[#f7f4ef]/95 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#292724] shadow-sm"><img src="/selah-girls-logo-2.png" alt="Selah Girl Society" className="h-8 w-8 rounded-full object-contain" />Inner City Mission · Freedom Pakistan</figcaption>
        </figure>
        <div className="relative max-w-2xl">
          <ChromeOrnament variant="star" className="chrome-ornament--pakistan" />
          <ChromeOrnament variant="heart" className="chrome-ornament--pakistan-heart" />
          <ChromeOrnament variant="star" className="chrome-ornament--pakistan-tiny" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#756354]">A purpose woven through every purchase</p>
          <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">A future shaped by freedom and dignity.</h2>
          <div className="mt-7 space-y-5 text-sm leading-7 text-[#635a56] md:text-base">
            <p>When we started Selah Girl Society, we knew that our commitment to honoring God had to extend far beyond the quality, designs and messages printed on our garments. True devotion must be woven into the very fabric of how we do business.</p>
            <p>That conviction led us on a remarkable journey to partner with Inner City Mission, Freedom Pakistan Mission.</p>
            <p>A percentage of every Selah purchase supports Christian families trapped in debt bondage in Pakistan through Inner City Mission: Freedom Pakistan. We are confirming the latest impact figures with our partners and will share verified updates here.</p>
            <p>Thank you for partnering with us when you shop.</p>
          </div>
          <Link to="/shop" className="pakistan-shop-pill mt-9 inline-flex rounded-full bg-[#e5348a] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#c92d76]">
            Shop Selah
            <ChromeOrnament variant="star" className="chrome-button-mark chrome-button-mark--bottom-right" />
          </Link>
        </div>
      </section>
    </main>
  </StoreLayout>;
}
