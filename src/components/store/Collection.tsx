import { Link } from "@tanstack/react-router";

interface CollectionItem {
  id: string;
  title: string;
  buttonText: string;
  href: string;
  imageSrc: string;
}

const collections: CollectionItem[] = [
  {
    id: "828-series",
    title: "828 SERIES",
    buttonText: "SHOP",
    href: "/shop?collection=828-series",
    imageSrc: "/sg2.jpg",
  },
  {
    id: "selah-girls",
    title: "SELAH GIRLS",
    buttonText: "SHOP NOW",
    href: "/shop?collection=selah-girls",
    imageSrc: "/selah3.jpeg",
  },
];

export function Collections() {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      {/* Container with horizontal padding and max-width */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid with explicit gaps between collection cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {collections.map((item) => (
            <div
              key={item.id}
              className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[#1A1A1A]"
            >
              {/* Background Image with subtle zoom hover effect */}
              <img
                src={item.imageSrc}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/40" />

              {/* Centered Content */}
              <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center text-white">
                <h2 className="mb-4 font-sans text-3xl md:text-4xl lg:text-5xl font-semibold uppercase tracking-wider text-white drop-shadow-sm">
                  {item.title}
                </h2>

                <Link
                  to={item.href}
                  className="selah-button inline-flex h-9 md:h-10 items-center justify-center border border-white bg-transparent px-8 md:px-10 font-sans text-base md:text-lg font-light uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#FFF5F7] hover:text-[#1A1A1A] hover:border-[#FFF5F7]"
                >
                  {item.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
