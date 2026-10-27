
export type ProductPriceFields = {
  name: string;
  category: string;
  subcategory: string;
  tags: readonly string[];
};

export const NGN_PER_GBP = 1400;
export const TEE_PRICE_NGN = 21_000;

export function isTeeProduct(product: ProductPriceFields) {
  const productText = [
    product.name,
    product.category,
    product.subcategory,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();

  return (
    /\b(tees?|t-?shirts?|828)\b/.test(productText) ||
    /selah girls|pretty and prayed up|babe,? i love jesus|ask me about jesus/i.test(
      product.name,
    )
  );
}

export function getStorefrontProductPrice(
  product: ProductPriceFields & { price: number },
) {
  return isTeeProduct(product) ? TEE_PRICE_NGN : product.price;
}

export function toGbpAmount(amountNgn: number) {
  return Math.round((amountNgn / NGN_PER_GBP + Number.EPSILON) * 100) / 100;
}
