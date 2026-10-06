import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF5F7]">
      <div

        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 pt-20 pb-8 transition-opacity hover:opacity-95"
      >
        <Link
          to="/collections"
        >
          <img
            src="/hero-image.png"
            alt="Shop the Collection"
            className="h-[80vh] md:h-[88vh] w-auto max-w-full object-contain drop-shadow-2xl"
          />
        </Link>
      </div>
    </section>
  );
}
