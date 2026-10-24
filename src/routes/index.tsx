import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { AnnouncementSlider } from "@/components/store/AnnouncementSlider";
import { ChromeOrnament } from "@/components/store/ChromeOrnament";
import "@/styles/home.css";

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
    eyebrow: "Core basics // the everyday edit",
    title: "The White Baby Tees",
    description: "A little reminder of what matters, made for every day.",
    image: "/selah15.png",
    imageAlt: "Selah Girl Society white baby tee outside a fruit shop",
    href: "/shop?collection=white-baby-tees",
    action: "Shop the tees",
  },
  {
    eyebrow: "limited edition // Romans 8:28",
    title: "The 828 Collection Drop",
    description: "Wear the promise. A considered collaboration with Saint Angelo.",
    image: "/828girls.png",
    imageAlt: "Selah Girl Society café lookbook",
    href: "/shop?collection=828-series",
    action: "Discover the drop",
  },
];

const heroImages = ["/selah11.png", "/selah12.png", "/selah10.png"];

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
        {/* <h1>the drop is here</h1> */}
        {/* <p>Wear the promise. Faith and fashion, beautifully aligned.</p> */}
        <Link to="/shop" className="home-metal-button">
          shop Selah
          <ChromeOrnament
            variant="star"
            className="chrome-button-mark chrome-button-mark--top-right"
          />
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
      "A percentage of every Selah purchase supports Christian families trapped in debt bondage through our partnership with InnerCity Mission: Freedom Pakistan. Thank you for being part of this work when you shop.",
    image: "/selah13.png",
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
                {story.action} <ArrowUpRight aria-hidden="true" className="inline size-4" />
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

      <section
        id="collections"
        className="home-collections collection-feature"
        aria-label="Shop the Selah collections"
      >
        <div className="collection-feature__grid">
          {collections.map((item) => (
            <article key={item.title} className="collection-feature__panel">
              <img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" />
              <div className="collection-feature__shade" />
              <div className="collection-feature__copy">
                <span className="collection-feature__eyebrow">{item.eyebrow}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <Link to={item.href} className="collection-feature__link">
                  {item.action} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* <section className="home-editorial-feature">
        <ChromeOrnament variant="heart" className="chrome-ornament--editorial" />
        <div className="home-editorial-copy">
          <ChromeOrnament variant="star" className="chrome-ornament--editorial-tiny" />
          <span className="home-kicker">Romans 8:28 · The 828 Collection Drop</span>
          <h2>Wear the promise.</h2>
          <p>
            This season, limited edition in collaboration with Saint Angelo.
          </p>
          <Link to="/shop?collection=828-series" className="home-outline-button">
            explore the 828 edition <ArrowUpRight aria-hidden="true" className="inline size-4" />
            <ChromeOrnament variant="star" className="chrome-button-mark chrome-button-mark--top-right" />
          </Link>
        </div>
        <div className="home-editorial-image">
          <img src="/828girls.png" alt="The 828 Edition campaign" />
        </div>
      </section> */}

      <HomeStories />
    </StoreLayout>
  );
}
