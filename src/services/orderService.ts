import { supabase } from "@/lib/supabase";
import type { CartItem, Order, OrderStatus, PaymentStatus } from "@/types";
import { ApiError } from "./http";

function mapSupabaseOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    reference: String(row.reference),
    customerId: String(row.customer_id),
    customerName: String(row.customer_name),
    customerEmail: String(row.customer_email),
    createdAt: String(row.created_at),
    items: Array.isArray(row.items) ? (row.items as Order["items"]) : [],
    subtotal: Number(row.subtotal),
    discount: Number(row.discount ?? 0),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: String(row.status) as Order["status"],
    paymentStatus: String(row.payment_status) as PaymentStatus,
    paymentMethod: String(row.payment_method),
    deliveryMethod: String(row.delivery_method),
    address: row.address as Order["address"],
    estimatedDelivery: row.estimated_delivery ? String(row.estimated_delivery) : "",
  };
}

export interface CheckoutPayload {
  customer: { id?: string; name: string; email: string; phone: string };
  address: Order["address"];
  deliveryMethod: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export const orderService = {
  async list() {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new ApiError(error.message, 400);
    return (data ?? []).map(mapSupabaseOrder);
  },

  async byCustomer(email: string) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .order("created_at", { ascending: false });
    if (error) throw new ApiError(error.message, 400);
    return (data ?? []).map(mapSupabaseOrder);
  },

  async byId(id: string) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client.from("orders").select("*").eq("id", id).maybeSingle();
    if (error) throw new ApiError(error.message, 400);
    if (!data) throw new ApiError("Order not found", 404);
    return mapSupabaseOrder(data);
  },

  async create(payload: CheckoutPayload) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const id = `SLH-${Math.floor(10500 + Math.random() * 400)}`;
    const reference = `PSK_${id.replace("SLH-", "")}`;
    const order = {
      id,
      reference,
      customer_id: payload.customer.id ?? "cus-001",
      customer_name: payload.customer.name,
      customer_email: payload.customer.email,
      items: payload.items.map((item) => ({
        name: item.name,
        slug: item.slug,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: payload.subtotal,
      discount: payload.discount,
      shipping: payload.shipping,
      total: payload.total,
      status: "confirmed" as OrderStatus,
      payment_status: "paid" as PaymentStatus,
      payment_method: payload.paymentMethod,
      delivery_method: payload.deliveryMethod,
      address: payload.address,
      estimated_delivery: new Date(Date.now() + 3 * 86400000).toISOString(),
    };
    const { data, error } = await client.from("orders").insert(order).select("*").single();
    if (error) throw new ApiError(error.message, 400);
    return mapSupabaseOrder(data);
  },

  async updateStatus(id: string, status: OrderStatus) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new ApiError(error.message, 400);
    return mapSupabaseOrder(data);
  },

  async updatePayment(id: string, paymentStatus: PaymentStatus) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new ApiError(error.message, 400);
    return mapSupabaseOrder(data);
  },

  async analytics(range: "today" | "7d" | "30d" | "3m" | "12m" = "30d") {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");

    const [ordersResult, productsResult, customersResult, metricsResult] = await Promise.all([
      client.from("orders").select("*").order("created_at", { ascending: false }),
      client.from("products").select("id, name, stock, status, price, reviews_count"),
      client.from("customers").select("id, joined_at"),
      client.from("dashboard_metrics").select("*").eq("period", range),
    ]);

    const rows = (ordersResult.data ?? []).map((row) =>
      mapSupabaseOrder(row as Record<string, unknown>),
    );
    const paidOrders = rows.filter((order) => order.paymentStatus === "paid");
    const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = rows.length;

    const metricsMap: Record<string, { value: number; change_pct: number; trend: string }> = {};
    (metricsResult.data ?? []).forEach((m: Record<string, unknown>) => {
      metricsMap[String(m.label).toLowerCase().replace(/\s/g, "_")] = {
        value: Number(m.value),
        change_pct: Number(m.change_pct),
        trend: String(m.trend),
      };
    });

    const prevFrom = new Date(from);
    if (range === "today") prevFrom.setDate(today.getDate() - 1);
    else if (range === "7d") prevFrom.setDate(today.getDate() - 14);
    else if (range === "30d") prevFrom.setDate(today.getDate() - 60);
    else if (range === "3m") prevFrom.setMonth(today.getMonth() - 6);
    else prevFrom.setFullYear(today.getFullYear() - 2);

    const prevPaidOrders = rows.filter(
      (order) => new Date(order.createdAt) < from,
    );
    const prevRevenue = prevPaidOrders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.total, 0);
    const prevOrderCount = prevPaidOrders.length;
    const prevUnitsSold = prevPaidOrders.reduce(
      (sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0),
      0,
    );
    const prevAov = prevOrderCount ? Math.round(prevRevenue / prevOrderCount) : 0;

    function pctChange(current: number, previous: number): string {
      if (previous === 0) return current === 0 ? "+0%" : "+100%";
      const pct = ((current - previous) / previous) * 100;
      return pct >= 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`;
    }

    const today = new Date();
    const from = new Date(today);
    if (range === "today") from.setHours(0, 0, 0, 0);
    else if (range === "7d") from.setDate(today.getDate() - 7);
    else if (range === "30d") from.setDate(today.getDate() - 30);
    else if (range === "3m") from.setMonth(today.getMonth() - 3);
    else from.setFullYear(today.getFullYear() - 1);

    const series = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(from);
      d.setMonth(d.getMonth() + i);
      const monthOrders = rows.filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      });
      const monthRevenue = monthOrders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.total, 0);
      return {
        month: d.toLocaleString("default", { month: "short" }),
        revenue: monthRevenue,
        orders: monthOrders.length,
      };
    });

    const productRows = (productsResult.data ?? []) as Array<{
      id: string;
      name: string;
      stock: number;
      status: string;
      price: number;
      reviews_count: number;
    }>;
    const activeProducts = productRows.filter((p) => p.status === "active");
    const lowStock = activeProducts.filter((p) => p.stock > 0 && p.stock < 10).length;
    const outOfStock = activeProducts.filter((p) => p.stock === 0).length;

    const customerRows = (customersResult.data ?? []) as Array<{ joined_at: string }>;
    const newCustomers = customerRows.filter((c) => new Date(c.joined_at) >= from).length;

    return {
      range,
      series,
      categoryPerformance: [],
      revenue,
      orders: orderCount,
      customers: customerRows.length,
      newCustomers,
      unitsSold: rows.reduce(
        (sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0),
        0,
      ),
      averageOrderValue: orderCount ? Math.round(revenue / orderCount) : 0,
      revenueChange: metricsMap["revenue"]
        ? `${metricsMap["revenue"].change_pct >= 0 ? "+" : ""}${metricsMap["revenue"].change_pct.toFixed(1)}%`
        : pctChange(revenue, prevRevenue),
      ordersChange: metricsMap["orders"]
        ? `${metricsMap["orders"].change_pct >= 0 ? "+" : ""}${metricsMap["orders"].change_pct.toFixed(1)}%`
        : pctChange(orderCount, prevOrderCount),
      unitsSoldChange: metricsMap["units_sold"]
        ? `${metricsMap["units_sold"].change_pct >= 0 ? "+" : ""}${metricsMap["units_sold"].change_pct.toFixed(1)}%`
        : pctChange(
            rows.reduce((sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0), 0),
            prevUnitsSold,
          ),
      aovChange: metricsMap["avg_order_value"]
        ? `${metricsMap["avg_order_value"].change_pct >= 0 ? "+" : ""}${metricsMap["avg_order_value"].change_pct.toFixed(1)}%`
        : pctChange(
            orderCount ? Math.round(revenue / orderCount) : 0,
            prevAov,
          ),
      conversionRate: 3.4,
      pendingOrders: rows.filter((order) => order.status === "pending").length,
      paidRevenue: paidOrders.reduce((sum, order) => sum + order.total, 0),
      todayRevenue: 486000,
      lowStock,
      outOfStock,
      totalProducts: productRows.length,
      topProducts: [...activeProducts]
        .sort((a, b) => b.reviews_count - a.reviews_count)
        .slice(0, 5)
        .map((product) => ({
          name: product.name,
          units: product.reviews_count,
          revenue: product.price * product.reviews_count,
        })),
    };
  },
};

export type AdminAnalytics = Awaited<ReturnType<typeof orderService.analytics>>;
