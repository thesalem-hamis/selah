// import { Link, useRouterState } from "@tanstack/react-router";
// import { useEffect, useState } from "react";
// import { Icon } from "@iconify/react";
// import { cn } from "@/lib/utils";
// import { useCart } from "@/context/CartContext";
// import { useWishlist } from "@/context/WishlistContext";
// import { SidebarNav } from "./SidebarNav";

// interface SiteHeaderProps {
//   onSearch: () => void;
// }

// export function SiteHeader({ onSearch }: SiteHeaderProps) {
//   const pathname = useRouterState({ select: (state) => state.location.pathname });
//   const { count, openCart } = useCart();
//   const { count: wishlistCount } = useWishlist();
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [bump, setBump] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     setMenuOpen(false);
//   }, [pathname]);

//   useEffect(() => {
//     if (count === 0) return;
//     setBump(true);
//     const handle = setTimeout(() => setBump(false), 360);
//     return () => clearTimeout(handle);
//   }, [count]);

//   const isHome = pathname === "/";

//   return (
//     <>
//       <header
//         className={cn(
//         "fixed top-0 inset-x-0 z-40 transition-all duration-300",
//         scrolled || !isHome
//           ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] text-[#1a1a1a]"
//           : "bg-transparent text-[#1a1a1a]",
//       )}
//     >
//       <div className="container-page">
//         <div
//           className="flex items-center justify-between h-14 md:h-20 transition-all duration-300"
//         >
//           {/* Left - Menu */}
//           <div className="flex w-1/5 items-center">
//             <button
//               type="button"
//               onClick={() => setMenuOpen(true)}
//               aria-label="Open menu"
//               aria-expanded={menuOpen}
//               className="grid size-9 place-items-center transition-colors hover:opacity-60"
//             >
//               <Icon icon="ph:list-light" className="size-6" />
//             </button>
//           </div>

//           {/* Center - Logo */}
//           <div className="flex w-3/5 items-center justify-center">
//             <Link to="/" className="relative flex items-center justify-center h-16 w-full md:w-48">

//               {/* Image Logo */}
//               <img
//                 src="/selah-girls-logo.png"
//                 alt="Selah Girl Society"
//                 className={cn(
//                   "absolute h-14 w-auto md:h-20 object-contain transition-opacity duration-300"
//                 )}
//               />
//             </Link>
//           </div>

//           {/* Right - Icons */}
//           <div className="flex w-1/5 items-center justify-end gap-2 md:gap-4">
//             {/* Search */}
//             <button
//               type="button"
//               onClick={onSearch}
//               aria-label="Search"
//               className="grid size-9 place-items-center transition-colors hover:opacity-60"
//             >
//               <Icon icon="ph:magnifying-glass-light" className="size-5 md:size-[22px]" />
//             </button>

//             {/* Account - hidden on mobile */}
//             <Link
//               to="/account"
//               aria-label="Account"
//               className="hidden md:grid size-9 place-items-center transition-colors hover:opacity-60"
//             >
//               <Icon icon="ph:user-light" className="size-5 md:size-[22px]" />
//             </Link>

//             {/* Wishlist - hidden on mobile */}
//             <Link
//               to="/wishlist"
//               aria-label="Wishlist"
//               className="relative hidden md:grid size-9 place-items-center transition-colors hover:opacity-60"
//             >
//               <Icon icon="ph:heart-light" className="size-5 md:size-[22px]" />
//               {wishlistCount > 0 && (
//                 <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-[#1a1a1a]" />
//               )}
//             </Link>

//             {/* Cart */}
//             <button
//               type="button"
//               onClick={openCart}
//               aria-label={`Bag, ${count} items`}
//               className={cn(
//                 "group relative grid size-9 place-items-center transition-colors hover:opacity-60",
//               )}
//             >
//               <Icon
//                 icon="ph:tote-light"
//                 className={cn(
//                   "size-5 md:size-[22px] transition-transform duration-300 group-hover:-rotate-3",
//                   bump && "animate-pop"
//                 )}
//               />
//               {count > 0 && (
//                 <span
//                   className={cn(
//                     "absolute -right-0.5 -top-0.5 grid min-w-[16px] place-items-center rounded-full bg-[#1a1a1a] px-1 text-[9px] font-semibold leading-4 text-white",
//                     bump && "animate-pop",
//                   )}
//                 >
//                   {count}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//       </header>

//       <SidebarNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
//     </>
//   );
// }

// import { Link, useRouterState } from "@tanstack/react-router";
// import { useEffect, useState } from "react";
// import { Icon } from "@iconify/react";
// import { cn } from "@/lib/utils";
// import { useCart } from "@/context/CartContext";
// import { useWishlist } from "@/context/WishlistContext";
// import { SidebarNav } from "./SidebarNav";

// interface SiteHeaderProps {
//   onSearch: () => void;
// }

// export function SiteHeader({ onSearch }: SiteHeaderProps) {
//   const pathname = useRouterState({ select: (state) => state.location.pathname });
//   const { count, openCart } = useCart();
//   const { count: wishlistCount } = useWishlist();
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [bump, setBump] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     setMenuOpen(false);
//   }, [pathname]);

//   useEffect(() => {
//     if (count === 0) return;
//     setBump(true);
//     const handle = setTimeout(() => setBump(false), 360);
//     return () => clearTimeout(handle);
//   }, [count]);

//   const isHome = pathname === "/";
//   const isTransparent = !scrolled && isHome;

//   return (
//     <>
//       <header
//         className={cn(
//           "fixed top-0 inset-x-0 z-40 transition-all duration-300",
//           isTransparent
//             ? "bg-transparent text-white drop-shadow-sm"
//             : "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] text-[#1a1a1a]"
//         )}
//       >
//         <div className="container-page">
//           <div className="flex items-center justify-between h-14 md:h-20 transition-all duration-300">
//             {/* Left - Menu */}
//             <div className="flex w-1/5 items-center">
//               <button
//                 type="button"
//                 onClick={() => setMenuOpen(true)}
//                 aria-label="Open menu"
//                 aria-expanded={menuOpen}
//                 className="grid size-9 place-items-center transition-colors hover:opacity-60"
//               >
//                 <Icon icon="ph:list-light" className="size-6" />
//               </button>
//             </div>

//             {/* Center - Logo (Always Normal Color) */}
//             <div className="flex w-3/5 items-center justify-center">
//               <Link to="/" className="relative flex items-center justify-center h-16 w-full md:w-48">
//                 <img
//                   src="/selah-girls-logo.png"
//                   alt="Selah Girl Society"
//                   className="absolute h-14 w-auto md:h-20 object-contain transition-opacity duration-300"
//                 />
//               </Link>
//             </div>

//             {/* Right - Icons */}
//             <div className="flex w-1/5 items-center justify-end gap-2 md:gap-4">
//               {/* Search */}
//               <button
//                 type="button"
//                 onClick={onSearch}
//                 aria-label="Search"
//                 className="grid size-9 place-items-center transition-colors hover:opacity-60"
//               >
//                 <Icon icon="ph:magnifying-glass-light" className="size-5 md:size-[22px]" />
//               </button>

//               {/* Account - hidden on mobile */}
//               <Link
//                 to="/account"
//                 aria-label="Account"
//                 className="hidden md:grid size-9 place-items-center transition-colors hover:opacity-60"
//               >
//                 <Icon icon="ph:user-light" className="size-5 md:size-[22px]" />
//               </Link>

//               {/* Wishlist - hidden on mobile */}
//               <Link
//                 to="/wishlist"
//                 aria-label="Wishlist"
//                 className="relative hidden md:grid size-9 place-items-center transition-colors hover:opacity-60"
//               >
//                 <Icon icon="ph:heart-light" className="size-5 md:size-[22px]" />
//                 {wishlistCount > 0 && (
//                   <span
//                     className={cn(
//                       "absolute right-0.5 top-0.5 size-1.5 rounded-full transition-colors",
//                       isTransparent ? "bg-white" : "bg-[#1a1a1a]"
//                     )}
//                   />
//                 )}
//               </Link>

//               {/* Cart */}
//               <button
//                 type="button"
//                 onClick={openCart}
//                 aria-label={`Bag, ${count} items`}
//                 className="group relative grid size-9 place-items-center transition-colors hover:opacity-60"
//               >
//                 <Icon
//                   icon="ph:tote-light"
//                   className={cn(
//                     "size-5 md:size-[22px] transition-transform duration-300 group-hover:-rotate-3",
//                     bump && "animate-pop"
//                   )}
//                 />
//                 {count > 0 && (
//                   <span
//                     className={cn(
//                       "absolute -right-0.5 -top-0.5 grid min-w-[16px] place-items-center rounded-full px-1 text-[9px] font-semibold leading-4 transition-colors",
//                       isTransparent
//                         ? "bg-white text-[#1a1a1a]"
//                         : "bg-[#1a1a1a] text-white",
//                       bump && "animate-pop"
//                     )}
//                   >
//                     {count}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <SidebarNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
//     </>
//   );
// }

import { Link, useRouterState } from "@tanstack/react-router";
import type { SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { SidebarNav } from "./SidebarNav";
import { MenuIcon, SearchIcon, UserIcon, BagIcon } from "../store/Icons";
import "@/styles/header.css";

interface SiteHeaderProps {
  onSearch: () => void;
}

export function SiteHeader({ onSearch }: SiteHeaderProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const previousPathname = useRef(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 12);
      setHidden(currentY > 150 && currentY > lastScrollY.current + 3);
      if (currentY < 40 || currentY < lastScrollY.current - 3) setHidden(false);
      lastScrollY.current = currentY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setHidden(false);
    const currentY = window.scrollY;
    lastScrollY.current = currentY;
    setScrolled(currentY > 12);
  }, [pathname]);

  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const handle = setTimeout(() => setBump(false), 360);
    return () => clearTimeout(handle);
  }, [count]);

  const isHome = pathname === "/";
  const isTransparent = !scrolled && isHome;
  const syncMobileMenu = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const open = event.currentTarget.open;
    setMenuOpen(open);
    if (open) setHidden(false);
  };
  const closeMobileMenu = () => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
    setMenuOpen(false);
  };

  useEffect(() => {
    setMenuOpen(mobileMenuRef.current?.open ?? false);
  }, []);

  return (
    <>
      <header
        className={`selah-header${isTransparent ? " is-transparent" : " is-scrolled"}${isHome && !scrolled ? " is-home-top" : ""}${hidden ? " is-hidden" : ""}`}
      >
        <div className="selah-header__inner">
          <div className="selah-header__row">
            <div className="selah-header__mobile-menu">
              <details
                ref={mobileMenuRef}
                className="selah-menu-details"
                onToggle={syncMobileMenu}
              >
                <summary
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-controls="store-menu"
                  aria-expanded={menuOpen}
                  // className="selah-header__menu-button"
                >
                  <MenuIcon className="size-8 stroke-[2]" />
                </summary>
                <SidebarNav isOpen={menuOpen} onClose={closeMobileMenu} />
              </details>
            </div>

            <nav aria-label="Main navigation" className="selah-header__nav">
              <Link to="/shop">Shop Selah</Link>
              <Link to="/about">About</Link>
              <Link to="/rewards">Rewards</Link>
              <Link to="/support">Support</Link>
            </nav>

            <div className="selah-header__brand">
              <Link to="/" className="selah-header__brand-link">
                <img
                  src="/selah-girls-logo.png"
                  alt="Selah Girl Society"
                  className="selah-header__logo"
                />
              </Link>
            </div>

            {/* Right - Header Action Icons */}
            <div className="selah-header__actions">
              {/* Search Icon */}
              <button
                type="button"
                onClick={onSearch}
                aria-label="Search"
                className="selah-header__action selah-header__search"
              >
                <SearchIcon className="selah-header__icon sm:hidden" />
                <span>Search</span>
              </button>

              {/* Account Icon - Hidden on Mobile */}
              <Link
                to="/account"
                aria-label="Account"
                className="selah-header__action selah-header__account"
              >
                <UserIcon className="selah-header__icon sm:hidden" />
                <span>Account</span>
              </Link>

              {/* Shopping Bag Icon */}
              <button
                type="button"
                onClick={openCart}
                aria-label={`Bag, ${count} items`}
                className="selah-header__action  selah-header__cart"
              >
                <BagIcon className={`selah-header__icon${bump ? " is-bumping" : ""} sm:hidden`} />
                <span>Cart ({count})</span>
                {count > 0 && (
                  <span className={`selah-header__count${bump ? " is-bumping" : ""}`}>{count}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
