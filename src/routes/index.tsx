import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { NewsTicker } from "@/components/store/NewsTricker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Selah Girl Society — Everyday essentials for the modern believer" },
      {
        name: "description",
        content:
          "Faith and fashion, beautifully aligned. Discover soft everyday essentials for the modern believer at Selah Girl Society.",
      },
    ],
  }),
  component: Home,
});

const collections = [
  {
    eyebrow: "Romans 8:28 · limited edition",
    title: "the 828 collection",
    description: "Wear the promise. A considered collaboration with Saint Angelo.",
    image: "/sg2.jpg",
    href: "/shop?collection=828-series",
    className: "home-collection-828",
    action: "discover the drop",
  },
  {
    eyebrow: "the everyday edit",
    title: "white baby tees",
    description: "A little reminder of what matters, made for every day.",
    image: "/selah3.jpeg",
    href: "/shop?collection=white-baby-tees",
    className: "home-collection-tees",
    action: "shop the tees",
  },
  {
    eyebrow: "soft staples · made to be lived in",
    title: "everyday pieces",
    description: "Easy layers for days spent doing what matters.",
    image: "/selah4.jpeg",
    href: "/shop",
    className: "home-collection-everyday",
    action: "shop the edit",
  },
];

const heroImages = ["/selahmain.jpeg", "/selah7.jpeg", "/selah5.jpeg"];

function HomeHero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="home-hero">
      {heroImages.map((src, index) => (
        <div
          key={src}
          className={`home-hero-slide ${index === activeImage ? "is-active" : ""}`}
          aria-hidden="true"
        >
          <img src={src} alt="" />
        </div>
      ))}
      <div className="home-hero-shade" />
      <div className="home-hero-copy">
        {/* <span className="home-kicker">Selah Girl Society · Romans 8:28</span> */}
        <h1>the drop is here</h1>
        {/* <p>Wear the promise. Faith and fashion, beautifully aligned.</p> */}
        <Link to="/shop" className="home-metal-button">
          shop the collection 
        </Link>
      </div>
      <div className="home-hero-controls" aria-label="Hero slides">
        {heroImages.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`Show lookbook image ${index + 1}`}
            aria-current={index === activeImage}
            onClick={() => setActiveImage(index)}
          />
        ))}
      </div>
    </section>
  );
}

function Home() {
  return (
    <StoreLayout>
      <div className="home-shipping-note">Complimentary shipping on orders over £50</div>
      <HomeHero />
      <NewsTicker />

      <section id="collections" className="home-collections">
        <div className="home-section-heading">
          <span className="home-kicker">made for the life you lead</span>
          <h2>Pieces with a little more meaning.</h2>
        </div>
        <div className="home-collection-grid">
          {collections.map((item) => (
            <article key={item.title} className={`home-collection-card ${item.className}`}>
              <img src={item.image} alt="Selah Girl Society collection lookbook" />
              <div className="home-collection-shade" />
              <div className="home-collection-copy">
                <span className="home-kicker">{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={item.href} className="home-metal-button">
                  {item.action} <span>↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-editorial-feature">
        <div className="home-editorial-copy">
          <span className="home-kicker">Romans 8:28 · Saint Angelo x Selah</span>
          <h2>Wear the promise.</h2>
          <p>
            This season, we made something meaningful. Meet the limited 828 edition, created to
            remind you that all things work together for good.
          </p>
          <Link to="/shop?collection=828-series" className="home-outline-button">
            explore the 828 edition <span>↗</span>
          </Link>
        </div>
        <div className="home-editorial-image">
          <img src="/sg1.jpeg" alt="The 828 Edition campaign" />
        </div>
      </section>

      <section className="home-social">
        <div className="home-social-heading">
          <div>
            <span className="home-kicker">faith in every thread</span>
            <h2>Selah, in real life.</h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="home-outline-button"
          >
            find us on social <span>↗</span>
          </a>
        </div>
        <div className="home-social-rail">
          {["/selah2.jpeg", "/selah4.jpeg", "/sg2.jpg", "/selah6.jpeg"].map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Selah Girl Society lookbook ${index + 1}`}
              loading="lazy"
            />
          ))}
        </div>
      </section>

      <section className="home-story">
        <div className="home-story-image">
          <img
            src="/selah5.jpeg"
            alt="A moment from the Selah Girl Society lookbook"
            loading="lazy"
          />
        </div>
        <div className="home-story-copy">
          <span className="home-kicker">welcome to the society</span>
          <h2>For the trendy version of you, rooted in something deeper.</h2>
          <p>
            Founded by two women who love Jesus and believe style and devotion can coexist, Selah
            creates soft, premium everyday basics for women choosing to live intentionally, boldly,
            and unapologetically for Christ.
          </p>
          <Link to="/about" className="home-text-link">
            get to know us <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="home-manifesto">
        <span>“</span>
        <p>
          Everyday essentials
          <br />
          for the modern believer.
        </p>
        <small>SELAH GIRL SOCIETY</small>
      </section>

      <section className="home-bottom-cta">
        <img src="/selah7.jpeg" alt="Selah Girl Society collection" />
        <div>
          <span className="home-kicker">your new everyday</span>
          <h2>Welcome to the society.</h2>
          <Link to="/shop" className="home-metal-button">
            shop all <span>↗</span>
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}
