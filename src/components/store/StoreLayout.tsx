import { useState, type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { useRouterState } from "@tanstack/react-router";
import { SearchOverlay } from "./SearchOverlay";
import { CartSidebar } from "./CartSidebar";
import { SiteFooter } from "./SiteFooter";
import "@/styles/store.css";

/**
 * Storefront chrome: sticky header on every breakpoint, fixed bottom navigation
 * on mobile, and the search overlay shared between the two.
 */
export function StoreLayout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locationHref = useRouterState({ select: (state) => state.location.href });
  const cleanProductChrome =
    pathname === "/shop" || pathname.startsWith("/product/") || pathname.startsWith("/category/") || pathname === "/new-arrivals";
  const is828Selection = locationHref.includes("collection=828-series") || /\/product\/[^/?]*828/i.test(locationHref);

  return (
      <div className={`storefront-shell flex min-h-screen flex-col bg-background${cleanProductChrome ? " storefront-shell--clean" : ""}${is828Selection ? " storefront-shell--828" : ""}`}>
        <SiteHeader onSearch={() => setSearchOpen(true)} />
        <main className={`storefront-main flex-1 ${pathname !== "/" ? "pt-16 md:pt-20" : ""}`}>
          {children}
          {!cleanProductChrome && (
            <div className="storefront-hearts" aria-hidden="true">
              {[
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
                  className={`storefront-heart storefront-heart--${index + 2}`}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          )}
        </main>
        <SiteFooter />
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        <CartSidebar />
      </div>
  );
}
