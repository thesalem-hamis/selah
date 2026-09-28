import { X } from "lucide-react";
import type { ProductFilters } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

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
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          <X className="size-3" /> Clear all
        </button>
      </div>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Size
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => {
            const active = filters.sizes?.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ sizes: toggle(filters.sizes, size) })}
                className={cn(
                  "h-9 min-w-11 border px-3 text-xs font-medium transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-transparent hover:border-foreground/50",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Colour
        </legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
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
                  "size-8 rounded-full border-2 transition-transform",
                  active ? "border-foreground scale-110" : "border-border",
                )}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Max price
        </legend>
        <input
          type="range"
          min={10000}
          max={PRICE_MAX}
          step={5000}
          value={filters.maxPrice ?? PRICE_MAX}
          onChange={(event) => onChange({ maxPrice: Number(event.target.value) })}
          className="mt-4 w-full accent-foreground"
          aria-label="Maximum price"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Up to {formatPrice(filters.maxPrice ?? PRICE_MAX)}
        </p>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Availability
        </legend>
        {[
          { key: "inStockOnly" as const, label: "In stock only" },
          { key: "onSaleOnly" as const, label: "On sale" },
        ].map((option) => (
          <label key={option.key} className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(filters[option.key])}
              onChange={(event) => onChange({ [option.key]: event.target.checked })}
              className="size-4 border-border accent-foreground"
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Rating
        </legend>
        <div className="mt-3 flex gap-2">
          {[4, 4.5].map((rating) => (
            <button
              key={rating}
              type="button"
              aria-pressed={filters.minRating === rating}
              onClick={() =>
                onChange({ minRating: filters.minRating === rating ? undefined : rating })
              }
              className={cn(
                "h-9 border px-3 text-xs font-medium transition-colors",
                filters.minRating === rating
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-transparent hover:border-foreground/50",
              )}
            >
              {rating}+ stars
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
