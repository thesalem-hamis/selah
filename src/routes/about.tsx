import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";
import "@/styles/about.css";

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
      <main className="about-page">
        <section className="about-intro" aria-labelledby="about-title">
          <img
            className="about-intro__image"
            src="/selahmain.jpeg"
            alt="Selah Girl Society campaign portrait"
          />
          <div className="about-intro__shade" />
          <div className="about-intro__content">
            <h1 id="about-title">Fashion for the woman who chooses to live set apart.</h1>
          </div>
          <span className="about-intro__caption">Selah Girl Society</span>
        </section>

        <section className="about-founders" id="founders-note" aria-labelledby="founders-title">
          <div className="about-founders__portrait">
            <img src="/selah-main.jpeg" alt="Selah Girl Society campaign imagery" loading="lazy" />
            <span className="about-photo-note">Selah Girl Society</span>
          </div>
          <div className="about-founders__text">
            <p className="about-eyebrow">Our Story</p>
            <h2 id="founders-title">Selah, where faith and fashion beautifully align.</h2>
            <p>
              Selah Girl Society was founded by two women who love Jesus and believe faith and
              fashion can exist beautifully together. We create trendy Christian basics for women
              who want to live intentionally, boldly, and unapologetically for Jesus.
            </p>
            <blockquote className="about-founders__signoff">
              “Pause. Reflect. Wear. Declare.”
            </blockquote>
            <Link to="/collections" className="about-pill">
              Explore the collections <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="about-values" aria-labelledby="values-title">
          <div className="about-values__heading">
            <p className="about-eyebrow">The heart of Selah</p>
            <h2 id="values-title">Welcome to the society.</h2>
          </div>
          <div className="about-values__grid">
            {pillars.map((pillar, index) => (
              <article className="about-value" key={pillar.title}>
                <span className="about-value__number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-invite" aria-labelledby="invite-title">
          <img
            className="about-invite__image"
            src="/selah7.jpeg"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <div className="about-invite__shade" />
          <h2 id="invite-title">Welcome to the society</h2>
          <p>
            A community for the woman of God who wants to look good, feel good, and keep Christ at
            the centre. Pause, reflect, wear, and declare it with us.
          </p>
          <Link to="/shop" className="about-pill about-pill--light">
            Shop new season <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </StoreLayout>
  );
}
