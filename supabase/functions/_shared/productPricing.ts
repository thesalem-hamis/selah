
export type ProductPriceFields = {
  name: string;
  category: string;
  subcategory: string;
  tags: readonly string[];
};

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
  return isTeeProduct(product) ? 15 : product.price;
}
