import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SidebarNav } from "./SidebarNav";

interface SiteHeaderProps {
  onSearch: () => void;
}

export function SiteHeader({ onSearch }: SiteHeaderProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { count, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const handle = setTimeout(() => setBump(false), 360);
    return () => clearTimeout(handle);
  }, [count]);

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] text-[#1a1a1a]"
          : "bg-transparent text-[#1a1a1a]",
      )}
    >
      <div className="container-page">
        <div
          className="flex items-center justify-between h-14 md:h-20 transition-all duration-300"
        >
          {/* Left - Menu */}
          <div className="flex w-1/5 items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid size-9 place-items-center transition-colors hover:opacity-60"
            >
              <Icon icon="ph:list-light" className="size-6" />
            </button>
          </div>

          {/* Center - Logo */}
          <div className="flex w-3/5 items-center justify-center">
            <Link to="/" className="relative flex items-center justify-center h-16 w-full md:w-48">
              
              {/* Image Logo */}
              <img
                src="/selah-girls-logo.png"
                alt="Selah Girl Society"
                className={cn(
                  "absolute h-14 w-auto md:h-20 object-contain transition-opacity duration-300"
                )}
              />
            </Link>
          </div>

          {/* Right - Icons */}
          <div className="flex w-1/5 items-center justify-end gap-2 md:gap-4">
            {/* Search */}
            <button
              type="button"
              onClick={onSearch}
              aria-label="Search"
              className="grid size-9 place-items-center transition-colors hover:opacity-60"
            >
              <Icon icon="ph:magnifying-glass-light" className="size-5 md:size-[22px]" />
            </button>

            {/* Account - hidden on mobile */}
            <Link
              to="/account"
              aria-label="Account"
              className="hidden md:grid size-9 place-items-center transition-colors hover:opacity-60"
            >
              <Icon icon="ph:user-light" className="size-5 md:size-[22px]" />
            </Link>

            {/* Wishlist - hidden on mobile */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hidden md:grid size-9 place-items-center transition-colors hover:opacity-60"
            >
              <Icon icon="ph:heart-light" className="size-5 md:size-[22px]" />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-[#1a1a1a]" />
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Bag, ${count} items`}
              className={cn(
                "group relative grid size-9 place-items-center transition-colors hover:opacity-60",
              )}
            >
              <Icon 
                icon="ph:tote-light" 
                className={cn(
                  "size-5 md:size-[22px] transition-transform duration-300 group-hover:-rotate-3",
                  bump && "animate-pop"
                )} 
              />
              {count > 0 && (
                <span
                  className={cn(
                    "absolute -right-0.5 -top-0.5 grid min-w-[16px] place-items-center rounded-full bg-[#1a1a1a] px-1 text-[9px] font-semibold leading-4 text-white",
                    bump && "animate-pop",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      </header>

      <SidebarNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
