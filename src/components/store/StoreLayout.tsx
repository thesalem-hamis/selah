import { useState, type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { useRouterState } from "@tanstack/react-router";
import { SearchOverlay } from "./SearchOverlay";
import { CartSidebar } from "./CartSidebar";
import { SiteFooter } from "./SiteFooter";
import "@/styles/home.css";

/**
 * Storefront chrome: sticky header on every breakpoint, fixed bottom navigation
 * on mobile, and the search overlay shared between the two.
 */
export function StoreLayout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="storefront-shell flex min-h-screen flex-col bg-background">
      <SiteHeader onSearch={() => setSearchOpen(true)} />
      <main className={`storefront-main flex-1 ${pathname !== "/" ? "pt-16 md:pt-20" : ""}`}>
        {children}
        <div className="storefront-hearts" aria-hidden="true">
          {[
            "/chrome1.png",
            "/chrome2.png",
            "/chrome2.png",
            "/chrome5.png",
            "/chrome5.png",
            "/heart.png",
          ].map((src, index) => (
            <img
              key={index}
              src={src}
              alt=""
              className={`storefront-heart storefront-heart--${index + 1}`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </main>
      <SiteFooter />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartSidebar />
    </div>
  );
}
