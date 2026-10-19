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
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader onSearch={() => setSearchOpen(true)} />
      <main className={`flex-1 ${pathname !== "/" ? "pt-16 md:pt-20" : ""}`}>{children}</main>
      <SiteFooter />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartSidebar />
    </div>
  );
}
