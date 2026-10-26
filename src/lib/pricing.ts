// Store prices and order amounts are NGN. These are the store's fixed selling
// rates (not live FX), preserving the published £15 / $15 / 15 Espees tee price.
export const NGN_PER_UNIT = { NGN: 1, GBP: 1400, USD: 1400, ESPEES: 1400 } as const;
export const TEE_PRICE_NGN = 21000;
export const FREE_SHIPPING_THRESHOLD = 100000;
export const DELIVERY_COSTS = {
  "London Boutique Pickup": 0,
  "London Standard Delivery": 5000,
  "Lekki Phase 1 / Island Axis": 7000,
  "Lagos Mainland": 9000,
} as const;
export type DeliveryMethod = keyof typeof DELIVERY_COSTS;
export function deliveryCost(method: DeliveryMethod, subtotal: number) {
  return subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_COSTS[method];
}
export function isStoreTee(product: {
  name: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
}) {
  const text = [product.name, product.category, product.subcategory, ...(product.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return (
    /\b(tees?|t-?shirts?|828)\b/.test(text) ||
    /selah girls|selah girl society|pretty and prayed up|babe,? i love jesus|ask me about jesus/i.test(
      product.name,
    )
  );
}
export function productPriceNgn(product: {
  name: string;
  price: number;
  category?: string;
  subcategory?: string;
  tags?: string[];
}) {
  return isStoreTee(product) ? TEE_PRICE_NGN : product.price;
}
export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function cartTotals(
  items: Array<{ price: number; quantity: number }>,
  discountAmount: number,
  method: DeliveryMethod,
) {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const discount = roundMoney(Math.min(subtotal, Math.max(0, discountAmount)));
  const shipping = deliveryCost(method, subtotal);
  return { subtotal, discount, shipping, total: roundMoney(subtotal - discount + shipping) };
}
