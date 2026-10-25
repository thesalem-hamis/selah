import type { Product } from "@/types";
import type { StoreCurrency } from "@/context/CurrencyContext";
import { isTeeProduct } from "../../supabase/functions/_shared/productPricing";

export { isTeeProduct };

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

export function is828Product(product: Pick<Product, "name" | "category" | "subcategory" | "tags">) {
  return /\b828\b/i.test([product.name, product.category, product.subcategory, ...product.tags].join(" "));
}

export function formatProductPrice(product: Product, currency: StoreCurrency) {
  if (isTeeProduct(product)) {
    if (currency === "NGN") return "₦21,000";
    if (currency === "ESPEES") return "15 Espees";
    if (currency === "USD") return "$15";
    return "£15";
  }

  if (currency === "ESPEES") return `${product.price} Espees`;
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : currency === "USD" ? "en-US" : "en-GB", {
    style: "currency",
    currency: currency === "ESPEES" ? "GBP" : currency,
    maximumFractionDigits: 0,
  }).format(product.price);
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
