import type { Product } from "@/types";

const whiteTeeCollections = new Set([
  "ask-me-about-jesus",
  "babe-i-love-jesus",
  "pretty-and-prayed-up",
  "selah-girl-society",
]);

export function productDetails(
  product: Pick<Product, "name" | "category" | "subcategory" | "details" | "colors">,
): string[] {
  const is828 = product.category === "828" || /\b828\b/.test(product.name);
  const isWhiteTee =
    (whiteTeeCollections.has(product.category) &&
      (!product.subcategory || product.subcategory === "tops")) ||
    (/\b(tee|t-shirt|tshirt)\b/i.test(product.name) &&
      (/\bwhite\b/i.test(product.name) ||
        product.colors.some((color) => color.name.toLowerCase() === "white")));

  if (!is828 && !isWhiteTee) return product.details;

  const composition = is828
    ? "Fabric composition: 95% cotton 5% elastin"
    : "Fabric composition: 90% cotton 10% elastin";
  const care = "Wash on low temperature with similar colours and fabrics";

  return [
    ...product.details.filter(
      (detail) =>
        detail !== "Designed for everyday wear" &&
        !/^Fabric composition:/i.test(detail) &&
        detail !== care,
    ),
    composition,
    care,
  ];
}
