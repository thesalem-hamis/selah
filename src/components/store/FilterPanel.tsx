import { X } from "lucide-react";
import type { ProductFilters } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const ALL_COLORS = [
  { name: "Olive", hex: "#6a7449" },
  { name: "Cream", hex: "#efe7d8" },
  { name: "Terracotta", hex: "#b76b4b" },
  { name: "Black", hex: "#20211f" },
  { name: "Sand", hex: "#d9c7ab" },
  { name: "Ivory", hex: "#f6f2e9" },
  { name: "Sage", hex: "#a3b295" },
  { name: "Charcoal", hex: "#3c3d3a" },
];
export const PRICE_MAX = 250000;

const COLLECTIONS = [
  { name: "828", slug: "828" },
  { name: "Ask Me About Jesus", slug: "ask-me-about-jesus" },
  { name: "Babe, I Love Jesus", slug: "babe-i-love-jesus" },
  { name: "Pretty And Prayed Up", slug: "pretty-and-prayed-up" },
  { name: "Selah Girl Society", slug: "selah-girl-society" },
];

interface FilterPanelProps {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  onReset: () => void;
}

function toggle(list: string[] | undefined, value: string) {
  const current = list ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const { formatPrice } = useCurrency();
  return (
    <div className="space-y-10">
      {/* Collections / Categories */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">Collections</h2>
        <ul className="space-y-3">
          <li>
            <Link 
              to="/shop" 
              className={cn(
                "text-[13px] transition-colors hover:text-[#1A1A1A]",
                !filters.category ? "font-bold text-[#1A1A1A]" : "text-[#777777]"
              )}
            >
              All Pieces
            </Link>
          </li>
          {COLLECTIONS.map((collection) => (
            <li key={collection.slug}>
              <Link
                to="/category/$slug"
                params={{ slug: collection.slug }}
                className={cn(
                  "text-[13px] transition-colors hover:text-[#1A1A1A]",
                  filters.category === collection.name ? "font-bold text-[#1A1A1A]" : "text-[#777777]"
                )}
              >
                {collection.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px w-full bg-[#E5E5E5]" />

      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] transition-colors hover:text-[#1A1A1A]"
        >
          <X className="size-3" strokeWidth={1.5} /> Clear All
        </button>
      </div>

      <fieldset>
        <legend className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
          Size
        </legend>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => {
            const active = filters.sizes?.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ sizes: toggle(filters.sizes, size) })}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center border text-[12px] font-medium transition-colors",
                  active
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-[#E5E5E5] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* <fieldset>
        <legend className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
          Colour
        </legend>
        <div className="flex flex-wrap gap-3">
          {ALL_COLORS.map((color) => {
            const active = filters.colors?.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                aria-label={color.name}
                aria-pressed={active}
                onClick={() => onChange({ colors: toggle(filters.colors, color.name) })}
                className={cn(
                  "size-8 border transition-all",
                  active ? "border-[#1A1A1A] p-0.5" : "border-transparent p-0 hover:border-[#E5E5E5]",
                )}
                title={color.name}
              >
                <span 
                  className="block h-full w-full border border-[#E5E5E5]"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            );
          })}
        </div>
      </fieldset> */}

      <fieldset>
        <legend className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
          Max Price
        </legend>
        <input
          type="range"
          min={10000}
          max={PRICE_MAX}
          step={5000}
          value={filters.maxPrice ?? PRICE_MAX}
          onChange={(event) => onChange({ maxPrice: Number(event.target.value) })}
          className="w-full accent-[#1A1A1A]"
          aria-label="Maximum price"
        />
        <p className="mt-4 text-[13px] text-[#777777]">
          Up to <span className="font-medium text-[#1A1A1A]">{formatPrice(filters.maxPrice ?? PRICE_MAX)}</span>
        </p>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
          Availability
        </legend>
        {[
          { key: "inStockOnly" as const, label: "In Stock Only" },
          { key: "onSaleOnly" as const, label: "On Sale" },
        ].map((option) => (
          <label key={option.key} className="flex cursor-pointer items-center gap-3 text-[13px] text-[#444444] transition-colors hover:text-[#1A1A1A]">
            <input
              type="checkbox"
              checked={Boolean(filters[option.key])}
              onChange={(event) => onChange({ [option.key]: event.target.checked })}
              className="size-4 rounded-none border-[#E5E5E5] text-[#1A1A1A] focus:ring-[#1A1A1A]"
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
          Rating
        </legend>
        <div className="flex gap-2">
          {[4, 4.5].map((rating) => (
            <button
              key={rating}
              type="button"
              aria-pressed={filters.minRating === rating}
              onClick={() =>
                onChange({ minRating: filters.minRating === rating ? undefined : rating })
              }
              className={cn(
                "flex h-10 items-center justify-center border px-4 text-[12px] font-medium transition-colors",
                filters.minRating === rating
                  ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                  : "border-[#E5E5E5] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]",
              )}
            >
              {rating}+ Stars
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
