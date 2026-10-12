import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { categories } from "@/data/catalog";
import { productService } from "@/services/productService";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

const RECENT_KEY = "selah.recent-searches";

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

  // Dynamically generate suggested terms from catalog categories
  const suggestedSearches = useMemo(() => {
    return categories.map((cat) => cat.name).slice(0, 5);
  }, []);

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
      className="fixed inset-0 z-[100] flex flex-col bg-[#FDF0F5]/90 backdrop-blur-xl text-[#1A1A1A] font-['Alumni_Sans',sans-serif]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Header with close button */}
      <div className="flex items-center justify-end px-6 py-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="grid size-10 place-items-center text-gray-500 transition-colors hover:text-[#1A1A1A]"
        >
          <Icon icon="ph:x-light" className="size-7" />
        </button>
      </div>

      {/* Search Input Area */}
      <div className="mx-auto w-full max-w-3xl px-6 pt-4 md:pt-8">
        <form
          className="flex items-center gap-4 border-b border-black/20 pb-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (term.trim()) commit(term.trim());
          }}
        >
          <Icon icon="ph:magnifying-glass-light" className="size-7 shrink-0 text-gray-500" />
          <input
            autoFocus
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search"
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent text-2xl md:text-3xl font-light tracking-wide text-[#1A1A1A] outline-none placeholder:text-gray-400"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              className="text-base tracking-wide text-gray-500 transition-colors hover:text-[#E5348A]"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          {!term.trim() ? (
            <div className="space-y-12">
              {recent.length > 0 && (
                <section>
                  <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#E5348A]">
                    Recent Searches
                  </h2>
                  <div className="space-y-2">
                    {recent.map((item) => (
                      <button
                        key={item}
                        onClick={() => commit(item)}
                        className="flex w-full items-center justify-between py-2 text-lg md:text-xl font-medium tracking-wide text-[#1A1A1A] transition-colors hover:text-[#E5348A]"
                      >
                        <span>{item}</span>
                        <Icon icon="ph:arrow-right-light" className="size-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {suggestedSearches.length > 0 && (
                <section>
                  <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#E5348A]">
                    Popular Categories
                  </h2>
                  <div className="space-y-2">
                    {suggestedSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => commit(item)}
                        className="flex w-full items-center justify-between py-2 text-lg md:text-xl font-medium tracking-wide text-[#1A1A1A] transition-colors hover:text-[#E5348A]"
                      >
                        <span>{item}</span>
                        <Icon icon="ph:arrow-right-light" className="size-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((key) => (
                <div key={key} className="flex gap-4 animate-pulse">
                  <div className="size-20 rounded bg-white/50" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 w-2/3 rounded bg-white/50" />
                    <div className="h-4 w-1/3 rounded bg-white/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-2xl font-light tracking-wide text-[#1A1A1A]">No results for "{term}"</p>
              <p className="mt-2 text-base text-gray-600 font-sans">
                Try a different search term, or browse the full collection.
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                className="mt-8 inline-flex h-11 items-center border border-black/20 bg-white/80 px-8 text-base font-semibold tracking-[0.15em] uppercase text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
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
                      className="border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium tracking-[0.15em] uppercase text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
                    >
                      {category.name}
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
                    className="group flex flex-col gap-2"
                  >
                    <div className="overflow-hidden bg-white/60 p-2 aspect-[3/4] flex items-center justify-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <p className="text-base md:text-lg font-medium tracking-wide uppercase text-[#1A1A1A] group-hover:text-[#E5348A] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-sm md:text-base text-gray-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => commit(term.trim())}
                className="w-full border border-black/20 bg-white/80 py-3 text-base font-semibold tracking-[0.15em] uppercase text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
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