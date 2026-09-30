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
    title: "Faith in every thread",
    body: "We believe faith and fashion can exist beautifully together. Every piece is designed to help women wear what they believe.",
  },
  {
    title: "Intentional living",
    body: "Selah is a moment to pause, reflect, and consider. Our clothing is a reminder to slow down and keep Christ at the centre.",
  },
  {
    title: "A set-apart community",
    body: "We are creating space for women of God to look good, feel good, and encourage one another as they live boldly for Jesus.",
  },
];

function About() {
  return (
    <StoreLayout>
      <section className="container-page py-10 md:py-16">
        <p className="eyebrow mb-4">Our story</p>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">
          Fashion for the woman who chooses to live set apart.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Selah Girl Society was founded by two women who love Jesus and believe faith and fashion
          can exist beautifully together. We create trendy Christian basics for women who want to
          live intentionally, boldly, and unapologetically for Jesus.
        </p>
        <blockquote className="mt-8 max-w-2xl border-l-2 border-accent pl-5 font-display text-2xl leading-tight md:text-3xl">
          Pause. Reflect. Wear. Declare.
        </blockquote>
      </section>

      <section className="container-page grid gap-6 pb-6 md:grid-cols-2">
        <img src={editorial} alt="Selah studio in UK" loading="lazy" className="rounded-3xl" />
        <img src={promo} alt="Selah campaign imagery" loading="lazy" className="rounded-3xl" />
      </section>

      <section className="container-page py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <article key={pillar.title}>
              <span className="font-display text-2xl text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 font-display text-xl">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 md:pb-24">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-16 md:py-16">
          <h2 className="font-display text-3xl md:text-4xl">Welcome to the society</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-85">
            A community for the woman of God who wants to look good, feel good, and keep Christ at
            the centre. Pause, reflect, wear, and declare it with us.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-background px-8 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            Shop new season
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}
