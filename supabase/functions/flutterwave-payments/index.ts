import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getStorefrontProductPrice } from "../_shared/productPricing.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const flutterwaveSecret = Deno.env.get("FLW_SECRET_KEY")!;
const webhookHash = Deno.env.get("FLW_WEBHOOK_HASH")!;
const siteUrl = Deno.env.get("SITE_URL")!;
const admin = createClient(supabaseUrl, serviceRoleKey);
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, verif-hash",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

type OrderItem = {
  product_id: string;
  name?: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
};

type ProductForPayment = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  tags: string[];
  price: number;
  stock: number;
  status: string;
  sizes: string[];
  colors: Array<{ name?: string } | string> | null;
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function redirect(path: string) {
  return Response.redirect(new URL(path, siteUrl), 303);
}

async function customerIdFromRequest(request: Request) {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  return error ? null : data.user.id;
}

function calculateDiscount(code: string | null, subtotal: number) {
  if (!code) return 0;
  const coupons: Record<string, { kind: "percentage" | "fixed"; value: number; minimum: number; cap?: number; expires: string }> = {
    SELAH10: { kind: "percentage", value: 10, minimum: 30_000, cap: 15_000, expires: "2026-12-31" },
    NEWSEASON: { kind: "fixed", value: 5_000, minimum: 50_000, expires: "2026-10-31" },
  };
  const coupon = coupons[code.toUpperCase()];
  if (!coupon || coupon.expires < new Date().toISOString().slice(0, 10) || subtotal < coupon.minimum) {
    return null;
  }
  const discount = coupon.kind === "percentage" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  return Math.min(discount, coupon.cap ?? discount);
}

async function setPaid(orderId: string, reference: string) {
  const { error } = await admin
    .from("orders")
    .update({ payment_status: "paid", status: "confirmed", reference })
    .eq("id", orderId)
    .eq("payment_status", "unpaid");
  if (error) throw error;
}

async function verifyTransaction(transactionId: string, expectedReference: string, expectedAmount: number) {
  const result = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${flutterwaveSecret}` },
  });
  if (!result.ok) return null;
  const payload = await result.json();
  const transaction = payload?.data;
  if (
    payload?.status !== "success" ||
    transaction?.status !== "successful" ||
    transaction?.tx_ref !== expectedReference ||
    transaction?.currency !== "GBP" ||
    Number(transaction?.amount) !== expectedAmount
  ) return null;
  return transaction;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(request.url);
  if (request.method === "GET" && url.searchParams.get("action") === "callback") {
    const transactionId = url.searchParams.get("transaction_id");
    const reference = url.searchParams.get("tx_ref");
    const { data: order } = reference
      ? await admin.from("orders").select("id,total,reference").eq("reference", reference).maybeSingle()
      : { data: null };
    if (transactionId && order) {
      const verified = await verifyTransaction(transactionId, order.reference, Number(order.total));
      if (verified) {
        await setPaid(order.id, order.reference);
        return redirect(`/order/${encodeURIComponent(order.id)}?payment=success`);
      }
    }
    return redirect(order ? `/order/${encodeURIComponent(order.id)}?payment=failed` : "/checkout?payment=failed");
  }

  if (request.method === "POST" && request.headers.has("verif-hash")) {
    if (!webhookHash || request.headers.get("verif-hash") !== webhookHash) return response({ error: "Unauthorized" }, 401);
    const event = await request.json();
    const transactionId = String(event?.data?.id ?? "");
    const reference = String(event?.data?.tx_ref ?? "");
    const { data: order } = reference
      ? await admin.from("orders").select("id,total,reference").eq("reference", reference).maybeSingle()
      : { data: null };
    if (transactionId && order) {
      const verified = await verifyTransaction(transactionId, order.reference, Number(order.total));
      if (verified) await setPaid(order.id, order.reference);
    }
    return response({ received: true });
  }

  if (request.method !== "POST") return response({ error: "Method not allowed" }, 405);
  const customerId = await customerIdFromRequest(request);
  if (!customerId) return response({ error: "Sign in to continue" }, 401);

  const { orderId } = await request.json();
  if (typeof orderId !== "string") return response({ error: "Invalid order" }, 400);
  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("customer_id", customerId)
    .maybeSingle();
  if (orderError || !order || order.payment_status !== "unpaid") return response({ error: "Order is not available for payment" }, 400);

  const items = order.items as OrderItem[];
  if (!Array.isArray(items) || !items.length || items.some((item) => !item.product_id || !Number.isInteger(item.quantity) || item.quantity < 1)) {
    return response({ error: "Order items are invalid" }, 400);
  }
  const productIds = [...new Set(items.map((item) => item.product_id))];
  const { data: productRows, error: productError } = await admin
    .from("products")
    .select("id,name,category,subcategory,tags,price,stock,status,sizes,colors")
    .in("id", productIds);
  if (productError || !productRows || productRows.length !== productIds.length) return response({ error: "Some items are unavailable" }, 400);
  const products = productRows as ProductForPayment[];

  let subtotal = 0;
  for (const item of items) {
    const itemName = item.name || "This item";
    const product = products.find((candidate) => candidate.id === item.product_id);
    if (!product || product.status !== "active") {
      return response({ error: "An item in your bag is no longer available. Remove it and try again." }, 409);
    }
    if (item.quantity > product.stock) {
      return response({ error: `Only ${product.stock} of ${itemName} are currently available.` }, 409);
    }
    if (!product.sizes.includes(item.size)) {
      return response({ error: `The selected size for ${itemName} is no longer available. Update your bag and try again.` }, 409);
    }
    const colors = Array.isArray(product.colors)
      ? product.colors
          .map((color: { name?: string } | string) => typeof color === "string" ? color : color.name)
          .filter((color): color is string => typeof color === "string")
          .map((color) => color.trim().toLowerCase())
      : [];
    const selectedColor = item.color.trim().toLowerCase();
    const colorIsValid = colors.length === 0 ? selectedColor === "default" : colors.includes(selectedColor);
    if (!colorIsValid) {
      return response({ error: `The selected color for ${itemName} is no longer available. Update your bag and try again.` }, 409);
    }
    const currentPrice = getStorefrontProductPrice(product);
    if (Number(item.price) !== currentPrice) {
      return response({ error: `The price for ${itemName} has changed. Refresh your bag and check the new total.` }, 409);
    }
    subtotal += currentPrice * item.quantity;
  }

  const discount = calculateDiscount(order.coupon_code ?? null, subtotal);
  const deliveryCosts: Record<string, number> = {
    "London Boutique Pickup": 0,
    "London Standard Delivery": 5_000,
    "Lekki Phase 1 / Island Axis": 7_000,
    "Lagos Mainland": 9_000,
  };
  const shipping = deliveryCosts[order.delivery_method];
  if (discount === null || shipping === undefined || Number(order.subtotal) !== subtotal || Number(order.discount) !== discount || Number(order.shipping) !== shipping || Number(order.total) !== subtotal - discount + shipping) {
    return response({ error: "Order total could not be verified. Please refresh checkout." }, 409);
  }

  const { data: profile } = await admin.from("profiles").select("name").eq("id", customerId).maybeSingle();
  if (!flutterwaveSecret) {
    return response({ error: "Payment processing is not configured. Ask the store team to check the Flutterwave server key." }, 503);
  }
  const callback = `${supabaseUrl}/functions/v1/flutterwave-payments?action=callback`;
  const paymentResponse = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: { Authorization: `Bearer ${flutterwaveSecret}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      tx_ref: order.reference,
      amount: Number(order.total),
      currency: "GBP",
      redirect_url: callback,
      customer: { email: profile?.email ?? order.customer_email, name: profile?.name ?? order.customer_name },
      meta: { order_id: order.id },
      customizations: { title: "Selah", description: `Order ${order.reference}` },
    }),
  });
  const payment = await paymentResponse.json().catch(() => null) as {
    status?: string;
    message?: string;
    data?: { link?: string };
  } | null;
  if (!payment || !paymentResponse.ok || payment.status !== "success" || !payment.data?.link) {
    const providerMessage = typeof payment?.message === "string" ? payment.message.trim().slice(0, 240) : "";
    console.error("Flutterwave payment initialization failed", {
      httpStatus: paymentResponse.status,
      providerStatus: payment?.status ?? "unavailable",
      providerMessage: providerMessage || "No provider message returned",
    });
    return response({
      error: providerMessage
        ? `Flutterwave could not start this payment: ${providerMessage}`
        : `Flutterwave could not start this payment (HTTP ${paymentResponse.status}).`,
    }, 502);
  }
  return response({ authorizationUrl: payment.data.link, reference: order.reference, provider: "flutterwave" });
});