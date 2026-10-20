import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { AnnouncementSlider } from "@/components/store/AnnouncementSlider";
import { ChromeOrnament } from "@/components/store/ChromeOrnament";

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
    eyebrow: "the everyday edit",
    title: "white baby tees",
    description: "A little reminder of what matters, made for every day.",
    image: "/selah3.jpeg",
    href: "/shop?collection=white-baby-tees",
    className: "home-collection-tees",
    action: "shop the tees",
  },
  {
    eyebrow: "Romans 8:28 · limited edition",
    title: "the 828 collection",
    description: "Wear the promise. A considered collaboration with Saint Angelo.",
    image: "/sg2.jpg",
    href: "/shop?collection=828-series",
    className: "home-collection-828",
    action: "discover the drop",
  },
];

const heroImages = ["/selah8.png", "/selah9.png", "/selah7.jpeg"];

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
          shop Selah
          <ChromeOrnament variant="star" className="chrome-button-mark chrome-button-mark--top-right" />
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

const homeStories = [
  {
    eyebrow: "about selah",
    title: "Faith and fashion, beautifully aligned.",
    description:
      "Founded by two women who love Jesus, Selah Girl Society makes soft, premium everyday basics for women choosing to live intentionally, boldly, and unapologetically for Christ.",
    image: "/selah5.jpeg",
    imageAlt: "A moment from the Selah Girl Society lookbook",
    href: "/about",
    action: "our story",
  },
  {
    eyebrow: "our purpose · pakistan",
    title: "A future shaped by freedom and dignity.",
    description:
      "A percentage of every Selah purchase supports Christian families trapped in debt bondage through our partnership with Inner City Mission: Freedom Pakistan. Thank you for being part of this work when you shop.",
    image: "/selah-main.jpeg",
    imageAlt: "Selah Girl Society campaign portrait",
    href: "/pakistan-journey",
    action: "our Pakistan journey",
  },
];

function HomeStories() {
  const [activeStory, setActiveStory] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveStory((current) => (current + 1) % homeStories.length);
    }, 20_000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="home-purpose" aria-label="About Selah and our Pakistan partnership">
      <div className="home-purpose-copy">
        <ChromeOrnament variant="star" className="chrome-ornament--purpose" />
        <ChromeOrnament variant="heart" className="chrome-ornament--purpose-drift" />
        <ChromeOrnament variant="star" className="chrome-ornament--purpose-tiny" />
        <div className="home-purpose-story-stack">
          {homeStories.map((story, index) => (
            <article
              key={story.eyebrow}
              className={`home-purpose-story ${activeStory === index ? "is-active" : ""}`}
              aria-hidden={activeStory !== index}
            >
              <span className="home-kicker">{story.eyebrow}</span>
              <h2>{story.title}</h2>
              <p>{story.description}</p>
              <Link to={story.href} className="home-outline-button">
                {story.action} <span>↗</span>
                <ChromeOrnament
                  variant={index === 0 ? "heart" : "star"}
                  className="chrome-button-mark chrome-button-mark--bottom-right"
                />
              </Link>
            </article>
          ))}
        </div>
        <nav
          className="home-purpose-tabs"
          aria-label="Explore Selah stories"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {homeStories.map((story, index) => (
            <button
              key={story.eyebrow}
              type="button"
              aria-pressed={activeStory === index}
              onMouseEnter={() => setActiveStory(index)}
              onFocus={() => setActiveStory(index)}
              onClick={() => setActiveStory(index)}
            >
              {index === 0 ? "About" : "Our Pakistan journey"}
            </button>
          ))}
        </nav>
      </div>
      <div className="home-purpose-image">
        {homeStories.map((story, index) => (
          <img
            key={story.image}
            className={activeStory === index ? "is-active" : ""}
            src={story.image}
            alt={story.imageAlt}
            loading="eager"
            decoding="async"
            aria-hidden={activeStory !== index}
          />
        ))}
      </div>
    </section>
  );
}

function Home() {
  return (
    <StoreLayout>
      <AnnouncementSlider />
      <HomeHero />

      <section id="collections" className="home-collections">
        <ChromeOrnament variant="star" className="chrome-ornament--collections" />
        <ChromeOrnament variant="heart" className="chrome-ornament--collections-drift" />
        <ChromeOrnament variant="star" className="chrome-ornament--collections-tiny" />
        <div className="home-section-heading">
          <span className="home-kicker">made for the life you lead</span>
          <h2>Pieces with a little more meaning.</h2>
        </div>
        <div className="home-collection-grid">
          {collections.map((item) => (
            <article key={item.title} className={`home-collection-card shadow-sm ${item.className}`}>
              <img src={item.image} alt="Selah Girl Society collection lookbook" />
              <div className="home-collection-shade" />
              <div className="home-collection-copy">
                <span className="home-kicker">{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={item.href} className="home-metal-button">
                  {item.action} <span>↗</span>
                  <ChromeOrnament
                    variant={item.title === "white baby tees" ? "star" : "heart"}
                    className={item.title === "white baby tees"
                      ? "chrome-button-mark chrome-button-mark--bottom-left"
                      : "chrome-button-mark chrome-button-mark--top-left"}
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-editorial-feature">
        <ChromeOrnament variant="heart" className="chrome-ornament--editorial" />
        <div className="home-editorial-copy">
          <ChromeOrnament variant="star" className="chrome-ornament--editorial-tiny" />
          <span className="home-kicker">Romans 8:28 · Saint Angelo x Selah</span>
          <h2>Wear the promise.</h2>
          <p>
            This season, we made something meaningful. Meet the limited 828 edition, created to
            remind you that all things work together for good.
          </p>
          <Link to="/shop?collection=828-series" className="home-outline-button">
            explore the 828 edition <span>↗</span>
            <ChromeOrnament variant="star" className="chrome-button-mark chrome-button-mark--top-right" />
          </Link>
        </div>
        <div className="home-editorial-image">
          <img src="/sg1.jpeg" alt="The 828 Edition campaign" />
        </div>
      </section>

      <HomeStories />
    </StoreLayout>
  );
}
