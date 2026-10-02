import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";
import editorial from "@/assets/editorial.jpg";
import promo from "@/assets/promo.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Selah Girl Society - Faith, Fashion and Community" },
      {
        name: "description",
        content:
          "Selah Girl Society is a faith-based fashion brand and community for women choosing to live intentionally, boldly, and unapologetically for Jesus.",
      },
      { property: "og:title", content: "About Selah Girl Society" },
      {
        property: "og:description",
        content: "Our story, our fabrics and the women who wear Selah.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const pillars = [
  {
    title: "FAITH IN EVERY THREAD",
    body: "We believe faith and fashion can exist beautifully together. Every piece is designed to help women wear what they believe.",
  },
  {
    title: "INTENTIONAL LIVING",
    body: "Selah is a moment to pause, reflect, and consider. Our clothing is a reminder to slow down and keep Christ at the centre.",
  },
  {
    title: "A SET-APART COMMUNITY",
    body: "We are creating space for women of God to look good, feel good, and encourage one another as they live boldly for Jesus.",
  },
];

function About() {
  return (
    <StoreLayout>
      <section className="container-page py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">
            Our Story
          </p>
          <h1
            className="text-4xl text-[#1A1A1A] md:text-6xl lg:text-7xl leading-[1.1]"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Fashion for the woman who chooses to live set apart.
          </h1>
          <p className="mx-auto mt-10 max-w-2xl text-[14px] leading-relaxed text-[#444444] md:text-[15px]">
            Selah Girl Society was founded by two women who love Jesus and believe faith and fashion
            can exist beautifully together. We create trendy Christian basics for women who want to
            live intentionally, boldly, and unapologetically for Jesus.
          </p>
          <blockquote
            className="mx-auto mt-16 max-w-2xl text-2xl text-[#1A1A1A] md:text-4xl leading-[1.3]"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            "Pause. Reflect. Wear. Declare."
          </blockquote>
        </div>
      </section>

      <section className="container-page pb-20 md:pb-32">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-[3/4] w-full bg-[#f4f4f4]">
            <img src={editorial} alt="Selah studio in UK" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-[3/4] w-full bg-[#f4f4f4]">
            <img src={promo} alt="Selah campaign imagery" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="container-page pb-20 md:pb-32">
        <div className="grid gap-12 md:grid-cols-3 md:gap-16 border-t border-[#E5E5E5] pt-16">
          {pillars.map((pillar, index) => (
            <article key={pillar.title}>
              <span className="text-[14px] font-bold text-[#1A1A1A]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-6 text-[12px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                {pillar.title}
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#444444]">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-24 md:pb-32">
        <div className="bg-[#1A1A1A] px-6 py-20 text-center text-white md:px-16 md:py-32">
          <h2
            className="text-4xl md:text-6xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Welcome to the society
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-[14px] leading-relaxed text-[#BBBBBB]">
            A community for the woman of God who wants to look good, feel good, and keep Christ at
            the centre. Pause, reflect, wear, and declare it with us.
          </p>
          <Link
            to="/shop"
            className="mt-12 inline-flex h-14 items-center justify-center bg-white px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:bg-[#E5E5E5]"
          >
            SHOP NEW SEASON
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}
