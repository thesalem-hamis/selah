import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { categories } from "@/data/catalog";
import { productService } from "@/services/productService";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

const RECENT_KEY = "selah.recent-searches";
const SUGGESTED = ["Satin maxi", "Abaya", "Linen set", "Chiffon scarf", "Leather tote"];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!term.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      productService
        .search(term)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 220);
    return () => clearTimeout(handle);
  }, [term]);

  const matchingCategories = useMemo(() => {
    if (!term.trim()) return [];
    return categories.filter((category) =>
      category.name.toLowerCase().includes(term.trim().toLowerCase()),
    );
  }, [term]);

  function commit(value: string) {
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 5);
    setRecent(next);
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    onClose();
    void navigate({ to: "/search", search: { q: value } });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#1a1a1a] text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Header with close */}
      <div className="flex items-center justify-end px-6 py-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="grid size-10 place-items-center text-gray-400 transition-colors hover:text-white"
        >
          <Icon icon="ph:x-light" className="size-6" />
        </button>
      </div>

      {/* Search input area */}
      <div className="mx-auto w-full max-w-3xl px-6 pt-8">
        <form
          className="flex items-center gap-4 border-b border-gray-600 pb-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (term.trim()) commit(term.trim());
          }}
        >
          <Icon icon="ph:magnifying-glass-light" className="size-6 shrink-0 text-gray-500" />
          <input
            autoFocus
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search"
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent text-2xl font-light tracking-wide text-white outline-none placeholder:text-gray-500"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              className="text-[13px] tracking-wide text-gray-400 transition-colors hover:text-white"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          {!term.trim() ? (
            <div className="space-y-12">
              {recent.length > 0 && (
                <section>
                  <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Recent Searches
                  </h2>
                  <div className="space-y-3">
                    {recent.map((item) => (
                      <button
                        key={item}
                        onClick={() => commit(item)}
                        className="flex w-full items-center justify-between py-2 text-[15px] tracking-wide text-gray-300 transition-colors hover:text-white"
                      >
                        <span>{item}</span>
                        <Icon icon="ph:arrow-right-light" className="size-4 text-gray-600" />
                      </button>
                    ))}
                  </div>
                </section>
              )}
              <section>
                <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Popular Searches
                </h2>
                <div className="space-y-3">
                  {SUGGESTED.map((item) => (
                    <button
                      key={item}
                      onClick={() => commit(item)}
                      className="flex w-full items-center justify-between py-2 text-[15px] tracking-wide text-gray-300 transition-colors hover:text-white"
                    >
                      <span>{item}</span>
                      <Icon icon="ph:arrow-right-light" className="size-4 text-gray-600" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((key) => (
                <div key={key} className="flex gap-4 animate-pulse">
                  <div className="size-20 rounded bg-gray-700" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-3 w-2/3 rounded bg-gray-700" />
                    <div className="h-3 w-1/3 rounded bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-xl font-light tracking-wide">No results for "{term}"</p>
              <p className="mt-3 text-[13px] text-gray-500">
                Try a different search term, or browse the full collection.
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                className="mt-8 inline-flex h-12 items-center border border-gray-600 px-8 text-[13px] font-medium tracking-[0.15em] text-white transition-colors hover:border-white"
              >
                BROWSE EVERYTHING
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {matchingCategories.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {matchingCategories.map((category) => (
                    <Link
                      key={category.id}
                      to="/category/$slug"
                      params={{ slug: category.slug }}
                      onClick={onClose}
                      className="border border-gray-600 px-4 py-2 text-[11px] font-medium tracking-[0.15em] text-gray-300 transition-colors hover:border-white hover:text-white"
                    >
                      {category.name.toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {results.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="overflow-hidden bg-[#2a2a2a]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 text-[13px] font-medium tracking-wide text-gray-200 group-hover:text-white">
                      {product.name}
                    </p>
                    <p className="mt-1 text-[12px] text-gray-500">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => commit(term.trim())}
                className="w-full border border-gray-600 py-4 text-[13px] font-medium tracking-[0.15em] text-white transition-colors hover:border-white"
              >
                VIEW ALL {results.length} RESULTS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
