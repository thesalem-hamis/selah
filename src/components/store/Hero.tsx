import { Link } from "@tanstack/react-router";
import { Sparkles, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#FFF5F7]">
      {/* Background Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.06] overflow-hidden select-none">
        <h1 
          className="text-[25vw] md:text-[20vw] leading-[0.8] text-[#1A1A1A] whitespace-nowrap -ml-[10vw]"
          style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
        >
          SELAH
        </h1>
        <h1 
          className="text-[25vw] md:text-[20vw] leading-[0.8] text-[#1A1A1A] whitespace-nowrap ml-[15vw]"
          style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
        >
          SOCIETY
        </h1>
      </div>

      {/* Luxury Icons Floating */}
      <div className="absolute top-[25%] left-[10%] md:left-[25%] text-[#1A1A1A]/20 pointer-events-none hidden sm:block">
        <Sparkles className="size-8 md:size-12" strokeWidth={0.75} />
      </div>
      <div className="absolute bottom-[20%] right-[10%] md:right-[25%] text-[#1A1A1A]/20 pointer-events-none hidden sm:block">
        <Star className="size-6 md:size-10" strokeWidth={0.75} />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 pt-24 pb-8 group">
        <Link to="/shop" className="relative block">
          <img
            src="/hero-image.png"
            alt="Shop the Collection"
            className="h-[75vh] md:h-[85vh] w-auto max-w-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 md:opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] bg-white/95 px-8 py-4 shadow-xl">
              Discover the Collection
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
