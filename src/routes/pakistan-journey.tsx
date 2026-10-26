import { StoreLayout } from "@/components/store/StoreLayout";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, TreePalm } from "lucide-react";

export const Route = createFileRoute("/pakistan-journey")({
  head: () => ({
    meta: [
      { title: "InnerCity Mission: Freedom Pakistan | Selah Girl Society" },
      {
        name: "description",
        content:
          "Discover Selah Girl Society's partnership with InnerCity Mission, Freedom Pakistan Mission.",
      },
    ],
  }),
  component: PakistanJourney,
});

function PakistanJourney() {
  return (
    <StoreLayout>
      <main className="bg-[#f7f3e7] text-[#123e32]">
        <section className="relative isolate overflow-hidden bg-[#123e32] px-6 py-16 md:py-24">
          <img
            src="/paki.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#123e32]/70 via-[#123e32]/52 to-[#123e32]/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_top_left,_#76a87555_0%,_transparent_65%)]"
          />
          {/* <TreePalm
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-20 z-[3] h-80 w-80 -rotate-12 text-[#d4e3ac]/20 md:h-[32rem] md:w-[32rem]"
            strokeWidth={0.7}
          />
          <TreePalm
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-16 z-[3] h-80 w-80 rotate-[155deg] text-[#d4e3ac]/20"
            strokeWidth={0.7}
          /> */}
          <div className="container-page relative z-[4] grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div className="max-w-3xl text-center text-[#fff9e9] lg:text-left">
              <p className="mb-5 text-xs uppercase tracking-[0.28em] text-[#d4e3ac]">
                Our faith in action
              </p>
              <h1 className="font-display text-4xl leading-tight md:text-6xl">
                InnerCity Mission:
                <br />
                Freedom Pakistan
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[#e0ead5] lg:mx-0">
                Discover the mission woven into every Selah purchase.
              </p>
              <a
                href="#mission-film"
                className="mt-8 inline-flex rounded-full bg-[#e5edbc] px-7 py-3 text-sm font-medium text-[#123e32] transition hover:bg-white"
              >
                Watch the mission film{" "}
                <span aria-hidden="true" className="ml-3 -rotate-45">
                  <ArrowDown />
                </span>
              </a>
            </div>
            <div className="mx-auto w-full max-w-sm rounded-t-[45%] rounded-b-3xl border border-[#d5dfb8] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,.15)] sm:p-8">
              <img
                src="/pakistan-logo.png"
                alt="Freedom Mission Pakistan — InnerCity Mission"
                className="aspect-[4/3] w-full object-contain"
              />
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-[#41654b]">
                A partnership with purpose
              </p>
            </div>
          </div>
        </section>
        <section className="container-page grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
          <figure
            id="mission-film"
            className="w-full scroll-mt-28 self-start overflow-hidden rounded-[2rem] border border-[#c5d4b8] bg-[#e9eedc] p-3 shadow-[0_18px_55px_rgba(18,62,50,.10)] lg:sticky lg:top-28"
          >
            <div className="flex items-center justify-between gap-4 px-3 py-4 text-[#315b44]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                Inside the mission
              </p>
              <TreePalm aria-hidden="true" className="h-6 w-6" strokeWidth={1.3} />
            </div>
            <video
              controls
              playsInline
              preload="metadata"
              aria-label="InnerCity Mission Pakistan film"
              className="aspect-video w-full rounded-[1.4rem] bg-[#123e32] object-contain"
            >
              <source src="/icm.mp4" type="video/mp4" />
              Your browser does not support embedded video.{" "}
              <a href="/icm.mp4">Watch the mission film</a>.
            </video>
            <figcaption className="px-3 pb-3 pt-5 text-sm leading-6 text-[#41654b]">
              InnerCity Mission · Freedom Pakistan
            </figcaption>
          </figure>
          <div className="relative max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] sm:text-lef text-center text-[#52734c]">
              A purpose woven through every purchase
            </p>
            <h2 className="mt-4 font-display sm:text-lef text-center text-2xl font-semibold leading-tight md:text-5xl">
              A future shaped by freedom and dignity.
            </h2>
            <div className="mt-7 space-y-5 text-xs md:text-sm text-center leading-7 text-[#4d6555] ">
              <p>
                When we started Selah Girl Society, we knew that our commitment to honoring God had
                to extend far beyond the quality, designs and messages printed on our garments. True
                devotion must be woven into the very fabric of how we do business.
              </p>
              <p>
                That conviction led us on a remarkable journey to partner with InnerCity Mission,
                Freedom Pakistan Mission.
              </p>
              <p>
                A dedicated percentage of every single purchase you make with Selah goes directly
                toward securing freedom for Christian families trapped in brutal debt bondage. In
                Pakistan, the marginalized minority Christian community faces extreme hardship, with
                generations enslaved across more than 20,000 brick kilns. To date, InnerCity Mission
                Mission cessfully freed thousands (to be confirmed) of families from these harsh
                harsh tions restoring their dignity, their freedom, and their future.
              </p>
              <p>Thank you for partnering with us when you shop.</p>
            </div>
            <Link
              to="/shop"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#24664a] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#123e32]"
            >
              Shop Selah
              <span aria-hidden="true" className="rotate-45">
                <ArrowUp />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </StoreLayout>
  );
}
