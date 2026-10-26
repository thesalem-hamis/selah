import { readFileSync } from "node:fs";
import { transpileModule, ModuleKind } from "typescript";
import { test } from "node:test";
import assert from "node:assert/strict";
const moduleUrl = (source) =>
  `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext } }).outputText).toString("base64")}`;
const pricingUrl = moduleUrl(
  readFileSync(new URL("../src/lib/pricing.ts", import.meta.url), "utf8"),
);
const pricing = await import(pricingUrl);
const formattingSource = readFileSync(
  new URL("../src/lib/format.ts", import.meta.url),
  "utf8",
).replace("./pricing", pricingUrl);
const { formatPrice, formatProductPrice, formatTotal } = await import(moduleUrl(formattingSource));

test("published tee prices agree with cart base amounts in every currency", () => {
  const product = { name: "Pretty and Prayed Up", category: "Tops", tags: [], price: 5000 };
  const expected = { GBP: "£15", USD: "$15", NGN: "₦21,000", ESPEES: "15 Espees" };
  for (const [currency, display] of Object.entries(expected)) {
    assert.equal(formatProductPrice(product, currency), display);
    assert.equal(formatPrice(pricing.productPriceNgn(product), currency), display);
  }
});
test("quantities, discount and each delivery choice add up", () => {
  for (const [method, shipping] of Object.entries(pricing.DELIVERY_COSTS)) {
    const totals = pricing.cartTotals([{ price: 21000, quantity: 2 }], 4200, method);
    assert.deepEqual(totals, {
      subtotal: 42000,
      discount: 4200,
      shipping,
      total: 37800 + shipping,
    });
  }
});
test("delivery converts rather than merely changing its currency symbol", () => {
  assert.equal(formatPrice(7000, "GBP"), "£5");
  assert.equal(formatPrice(7000, "USD"), "$5");
  assert.equal(formatPrice(7000, "NGN"), "₦7,000");
  assert.equal(formatPrice(7000, "ESPEES"), "5 Espees");
  assert.equal(formatPrice(5000, "GBP"), "£3.57");
});
test("empty carts, pickup and the free delivery boundary", () => {
  assert.equal(pricing.cartTotals([], 0, "London Standard Delivery").total, 0);
  assert.equal(pricing.deliveryCost("London Standard Delivery", 99999), 5000);
  assert.equal(pricing.deliveryCost("London Standard Delivery", 100000), 0);
  assert.equal(pricing.deliveryCost("London Boutique Pickup", 21000), 0);
});
test("discount cannot exceed subtotal or create a negative total", () => {
  assert.deepEqual(
    pricing.cartTotals([{ price: 21000, quantity: 1 }], 99000, "London Boutique Pickup"),
    { subtotal: 21000, discount: 21000, shipping: 0, total: 0 },
  );
  assert.equal(
    pricing.cartTotals([{ price: 21000, quantity: 1 }], -500, "London Boutique Pickup").discount,
    0,
  );
});
test("non-tee prices retain their base value and cents are not discarded", () => {
  assert.equal(pricing.productPriceNgn({ name: "Scarf", price: 3500 }), 3500);
  assert.equal(formatPrice(3500, "GBP"), "£2.5");
});

test("converted total sums the displayed components without a one-cent drift", () => {
  assert.equal(formatPrice(36000, "GBP"), "£25.71");
  assert.equal(formatPrice(5000, "GBP"), "£3.57");
  assert.equal(formatTotal(36000, 0, 5000, "GBP"), "£29.28");
});
