export const CURRENCY = "GBP";
export const BASE_UNITS_PER_GBP = 2000;

const nf = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return nf.format(value);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
