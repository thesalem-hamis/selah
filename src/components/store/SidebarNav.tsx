import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons";
import { productService } from "@/services/productService";
import { formatProductPrice } from "@/lib/format";
import type { Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const shopTabs = [
  { id: "828", label: "828", href: "/shop?collection=828-series" },
  { id: "tees", label: "White baby tees", href: "/shop?collection=white-baby-tees" },
] as const;

const storyLinks = [
  { label: "About us", to: "/about" },
  { label: "Our Pakistan journey", to: "/pakistan-journey" },
  { label: "Our story", to: "/about#founders-note" },
  { label: "Rewards", to: "/rewards" },
  { label: "Support", to: "/support" },
  { label: "FAQ", to: "/about#faq" },
  { label: "Account", to: "/account" },
] as const;

function belongsToCollection(product: Product, collectionId: (typeof shopTabs)[number]["id"]) {
  const text = [product.name, product.subcategory, ...product.tags]
    .join(" ")
    .toLowerCase()
    .replace(/[_-]+/g, " ");

  return collectionId === "828"
    ? /\b828\b/.test(text)
    : /babe.{0,12}i.{0,12}love.{0,12}jesus.{0,12}/.test(text) || /white.{0,12}baby.{0,12}tee|baby.{0,12}tee.{0,12}white/.test(text);
}

export function SidebarNav({ isOpen, onClose }: SidebarNavProps) {
  const { currency, setCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<(typeof shopTabs)[number]["id"]>("828");
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const productQuery = useQuery({
    queryKey: ["mobile-menu-products"],
    queryFn: () => productService.list({ sort: "featured" }),
    enabled: isOpen,
    staleTime: 60_000,
  });
  const activeCollection = shopTabs.find((tab) => tab.id === activeTab) ?? shopTabs[0];
  const products = (productQuery.data ?? []).filter((product) =>
    belongsToCollection(product, activeCollection.id),
  ).slice(0, 5);
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="selah-menu-backdrop"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside
        id="store-menu"
        className={`selah-mobile-menu${isOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="selah-mobile-menu__topline">
          <span className="selah-mobile-menu__heading">Shop Selah</span>
          <button type="button" className="selah-mobile-menu__close" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <div className="selah-mobile-menu__scroll">
          <div className="selah-mobile-menu__tabs" role="tablist" aria-label="Shop Selah collections">
            {shopTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`mobile-shop-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls="mobile-shop-products"
                className={activeTab === tab.id ? "is-active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            id="mobile-shop-products"
            className="selah-mobile-menu__products"
            role="tabpanel"
            aria-labelledby={`mobile-shop-tab-${activeCollection.id}`}
          >
            {productQuery.isLoading ? (
              <p className="selah-mobile-menu__message">Loading the collection…</p>
            ) : productQuery.isError ? (
              <p className="selah-mobile-menu__message">The collection is unavailable right now.</p>
            ) : products.length ? (
              products.map((product) => (
                <Link
                  key={product.id}
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  className="selah-mobile-product"
                  onClick={onClose}
                >
                  <img src={product.images[0]} alt="" loading="lazy" />
                  <span className="selah-mobile-product__copy">
                    <strong>{product.name}</strong>
                    <span>{formatProductPrice(product, currency)}</span>
                  </span>
                  {product.newArrival && <span className="selah-mobile-product__badge">new</span>}
                </Link>
              ))
            ) : (
              <p className="selah-mobile-menu__message">New pieces are coming soon.</p>
            )}
          </div>

          <a
            href={activeCollection.href}
            className="selah-mobile-menu__shop-all"
            onClick={onClose}
          >
            Shop {activeCollection.label}
          </a>

          <nav className="selah-mobile-menu__links" aria-label="More from Selah">
            {storyLinks.map((link) => (
              <a key={link.label} href={link.to} onClick={onClose}>
                {link.label}
              </a>
            ))}
          </nav>

        </div>
        <div className="selah-mobile-menu__footer">
          <div className="selah-mobile-menu__currency">
            <label htmlFor="mobile-currency">Currency</label>
            <select
              id="mobile-currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as typeof currency)}
            >
              <option value="GBP">United Kingdom (GBP £)</option>
              <option value="USD">United States (USD $)</option>
              <option value="NGN">Nigeria (NGN ₦)</option>
              <option value="ESPEES">Espees</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  );
}
