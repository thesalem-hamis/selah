import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categories } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/context/CartContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "About", to: "/about" },
];

interface SiteHeaderProps {
  onSearch: () => void;
}

export function SiteHeader({ onSearch }: SiteHeaderProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    setBannerVisible(window.sessionStorage.getItem("selah.delivery-banner-dismissed") !== "1");
  }, []);

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

  return (
    <>
      {bannerVisible && <div className="relative bg-primary py-2 pl-10 pr-12 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground">
        <span>Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
        <button type="button" aria-label="Dismiss delivery announcement" onClick={() => { setBannerVisible(false); window.sessionStorage.setItem("selah.delivery-banner-dismissed", "1"); }} className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-primary-foreground/75 transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground"><X className="size-3.5" /></button>
      </div>}
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-border bg-background/90 backdrop-blur-md"
            : "border-transparent bg-background",
        )}
      >
        <div className="container-page">
          <div
            className={cn(
              "flex items-center justify-between gap-4 transition-all duration-300",
              scrolled ? "h-16" : "h-16 md:h-20",
            )}
          >
            <div className="flex items-center gap-3 md:gap-10">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              <Link to="/" className="flex items-center">
                <img
                  src="/selah-girls-logo.png"
                  alt="Selah"
                  className="h-12 w-auto md:h-16 object-contain"
                />
              </Link>
              <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
                {navLinks.map((link) => {
                  const active =
                    link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        "relative py-1 text-[13px] font-medium tracking-wide transition-colors",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {link.label}
                      <span
                        className={cn(
                          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-foreground transition-transform duration-300",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  );
                })}
                {categories.length > 1 && (
                <div className="group relative">
                  <button className="py-1 text-[13px] font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground">
                    Categories
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-1 rounded-2xl border border-border bg-surface p-2 opacity-0 shadow-lift transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to="/category/$slug"
                        params={{ slug: category.slug }}
                        className="block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                      >
                        {category.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {category.description.split(" ").slice(0, 3).join(" ")}…
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-0.5 md:gap-1">
              <button
                type="button"
                onClick={onSearch}
                aria-label="Search"
                className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Search className="size-5" strokeWidth={1.75} />
              </button>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative hidden size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:grid"
              >
                <Heart className="size-5" strokeWidth={1.75} />
                {wishlistCount > 0 && (
                  <span className="absolute right-1 top-1 size-2 rounded-full bg-accent" />
                )}
              </Link>
              <Link
                to="/account"
                aria-label="Account"
                className="hidden size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:grid"
              >
                <User className="size-5" strokeWidth={1.75} />
              </Link>
              <Link
                to="/cart"
                aria-label={`Bag, ${count} items`}
                className={cn(
                  "group relative grid size-11 place-items-center rounded-full border border-border/80 bg-surface text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-soft active:translate-y-0",
                  count > 0 && "border-primary/30",
                )}
              >
                <ShoppingBag
                  className={cn(
                    "size-[1.15rem] transition-transform duration-300 group-hover:-rotate-6",
                    bump && "animate-pop",
                  )}
                  strokeWidth={1.8}
                />
                {count > 0 && (
                  <span
                    className={cn(
                      "absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full border-2 border-background bg-accent px-1 text-[10px] font-bold leading-4 text-accent-foreground shadow-sm",
                      bump && "animate-pop",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="animate-fade border-t border-border bg-surface md:hidden">
            <nav aria-label="Mobile" className="container-page py-4">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="block rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {categories.length > 1 && (
                <>
                  <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Categories
                  </p>
                  <ul className="mt-2 grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          to="/category/$slug"
                          params={{ slug: category.slug }}
                          className="block rounded-xl border border-border px-3 py-2.5 text-sm"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
