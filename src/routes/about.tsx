import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ChromeOrnament } from "@/components/store/ChromeOrnament";
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
          <div className="about-intro__content">
            <p className="about-eyebrow">Faith. Fashion. A little pause.</p>
            <h1 id="about-title">
              made for the
              <br />
              set-apart girl.
            </h1>
            <p className="about-intro__description">
              Everyday pieces. Eternal purpose. A society of women wearing what they believe.
            </p>
            <a href="#founders-note" className="about-intro__link">
              Get to know Selah <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <ChromeOrnament variant="heart" className="about-intro__ornament" />
          </div>
          <div className="about-intro__visual">
            <img
              className="about-intro__image"
              src="/selah14.png"
              alt="Selah Girl Society campaign portrait"
            />
            <span className="about-intro__caption">Wear what you believe.</span>
          </div>
        </section>

        <section className="about-founders" id="founders-note" aria-labelledby="founders-title">
          <div className="about-founders__text">
            <p className="about-eyebrow">01 / Our story</p>
            <h2 id="founders-title">
              two women.
              <br />
              one shared faith.
            </h2>
            <p>
              Selah Girl Society began with two women who love Jesus and a simple belief: faith and
              fashion can exist beautifully together.
            </p>
            <p>
              We create Christian basics for women choosing to live intentionally, boldly, and
              unapologetically for Jesus. Pieces to reach for every day, with a message that stays
              with you.
            </p>
            <blockquote className="about-founders__signoff">
              “Pause. Reflect. Wear. Declare.”
            </blockquote>
            <Link to="/collections" className="selah-button about-pill">
              Explore the collections <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <figure className="about-founders__portrait">
            <img
              src="/selah2.jpeg"
              alt="A look from the Selah Girl Society campaign"
              loading="lazy"
            />
            <figcaption className="about-photo-note">
              Faith and fashion, beautifully aligned.
            </figcaption>
          </figure>
        </section>

        <section className="about-values" aria-labelledby="values-title">
          <ChromeOrnament variant="star" className="chrome-ornament--values" />
          <ChromeOrnament variant="heart" className="chrome-ornament--values-heart" />
          <ChromeOrnament variant="star" className="chrome-ornament--values-drift" />
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
          <Link to="/shop" className="selah-button about-pill about-pill--light">
            Shop new season <ArrowUpRight aria-hidden="true" className="inline size-4" />
            <ChromeOrnament
              variant="heart"
              className="chrome-button-mark chrome-button-mark--top-right"
            />
          </Link>
        </section>

        <section id="faq" className="container-page py-20 md:py-28" aria-labelledby="faq-title">
          <ChromeOrnament variant="star" className="chrome-ornament--faq" />
          <ChromeOrnament variant="heart" className="chrome-ornament--faq-drift" />
          <p className="about-eyebrow">A few helpful things</p>
          <h2 id="faq-title" className="mb-8 text-3xl md:text-5xl">
            Frequently asked questions
          </h2>
          <div className="mx-auto max-w-3xl divide-y divide-[#B9B8B5]/60 border-y border-[#B9B8B5]/60">
            {[
              [
                "What is Selah Girl Society?",
                "A faith-based community and clothing label making soft, premium everyday essentials for the modern believer.",
              ],
              [
                "Where can I find the 828 collection?",
                "Explore the limited 828 edition in our shop. It is a separate collection from our white baby tees.",
              ],
              [
                "How do I get help with an order?",
                "Visit Support for shipping, order and payment, returns, and direct contact information.",
              ],
            ].map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="cursor-pointer list-none text-lg font-medium marker:hidden">
                  {question}
                  <span className="float-right text-[#E5348A] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#635A56]">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </StoreLayout>
  );
}
