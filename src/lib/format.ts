import type { Product } from "@/types";
import type { StoreCurrency } from "@/context/CurrencyContext";

import {
  NGN_PER_UNIT,
  isStoreTee,
  productPriceNgn,
  roundMoney,
} from "./pricing";
export const CURRENCY = "GBP";
export const BASE_UNITS_PER_GBP = NGN_PER_UNIT.GBP;

export function formatPrice(value: number, currency: StoreCurrency = "GBP") {
  const amount = value / NGN_PER_UNIT[currency];
  if (currency === "ESPEES")
    return `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(amount)} Espees`;
  return new Intl.NumberFormat(
    currency === "NGN" ? "en-NG" : currency === "USD" ? "en-US" : "en-GB",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  ).format(amount);
}
// Add the displayed components after rounding to avoid a one-cent discrepancy.
export function formatTotal(
  subtotal: number,
  discount: number,
  shipping: number,
  currency: StoreCurrency = "GBP",
) {
  const rate = NGN_PER_UNIT[currency];
  const total = roundMoney(
    roundMoney(subtotal / rate) - roundMoney(discount / rate) + roundMoney(shipping / rate),
  );
  return formatPrice(total * rate, currency);
}

export const isTeeProduct = isStoreTee;
export { productPriceNgn };

export function is828Product(product: Pick<Product, "name" | "category" | "subcategory" | "tags">) {
  return /\b828\b/i.test(
    [product.name, product.category, product.subcategory, ...product.tags].join(" "),
  );
}

export function formatProductPrice(product: Product, currency: StoreCurrency) {
  return formatPrice(productPriceNgn(product), currency);
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
