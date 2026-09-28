import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Product, Order, Address } from "@/types";

const tables = ["products", "orders", "customers", "reviews"] as const;

export function RealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const channel = client.channel("selah-store-updates");
    for (const table of tables) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, (payload) => {
        const newRow = payload.new as Record<string, unknown> | null;
        const oldRow = payload.old as Record<string, unknown> | null;
        const recordId = String(newRow?.id ?? oldRow?.id ?? "");

        if (payload.eventType === "DELETE" && oldRow) {
          queryClient.setQueriesData<Record<string, unknown>[]>(
            { queryKey: ["admin-products"] },
            (prev) => (prev ?? []).filter((item) => item.id !== recordId),
          );
          queryClient.setQueriesData<Record<string, unknown>[]>(
            { queryKey: ["admin-orders"] },
            (prev) => (prev ?? []).filter((item) => item.id !== recordId),
          );
          queryClient.setQueriesData<Record<string, unknown>[]>(
            { queryKey: ["admin-customers"] },
            (prev) => (prev ?? []).filter((item) => item.id !== recordId),
          );
          return;
        }

        if (!newRow) return;

        if (table === "products") {
          const mapped = mapSupabaseProduct(newRow);
          queryClient.setQueriesData<Product[]>({ queryKey: ["admin-products"] }, (prev) => {
            const list = prev ?? [];
            const index = list.findIndex((item) => item.id === recordId);
            if (index >= 0) {
              const updated = [...list];
              updated[index] = mapped;
              return updated;
            }
            return list;
          });
          queryClient.setQueriesData<Product>({ queryKey: ["product"] }, () => mapped);
          queryClient.setQueriesData<Product[]>({ queryKey: ["products"] }, (prev) => {
            if (!prev) return prev;
            const index = prev.findIndex((item) => item.id === recordId);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = mapped;
              return updated;
            }
            return prev;
          });
        }

        if (table === "orders") {
          queryClient.setQueriesData<Record<string, unknown>[]>(
            { queryKey: ["admin-orders"] },
            (prev) => {
              const list = prev ?? [];
              const index = list.findIndex((item) => item.id === recordId);
              if (index >= 0) {
                const updated = [...list];
                updated[index] = mapSupabaseOrder(newRow);
                return updated;
              }
              return list;
            },
          );
          queryClient.setQueriesData<Record<string, unknown>[]>(
            { queryKey: ["account-orders"] },
            (prev) => {
              const list = prev ?? [];
              const index = list.findIndex((item) => item.id === recordId);
              if (index >= 0) {
                const updated = [...list];
                updated[index] = mapSupabaseOrder(newRow);
                return updated;
              }
              return list;
            },
          );
        }

        if (table === "customers") {
          queryClient.setQueriesData<Record<string, unknown>[]>(
            { queryKey: ["admin-customers"] },
            (prev) => {
              const list = prev ?? [];
              const index = list.findIndex((item) => item.id === recordId);
              if (index >= 0) {
                const updated = [...list];
                updated[index] = mapSupabaseCustomer(newRow);
                return updated;
              }
              return list;
            },
          );
        }

        queryClient.invalidateQueries({ queryKey: ["analytics"] });
      });
    }

    void channel.subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [queryClient]);

  return null;
}

function mapSupabaseProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description),
    details: Array.isArray(row.details) ? (row.details as string[]) : [],
    category: String(row.category),
    subcategory: String(row.subcategory ?? ""),
    price: Number(row.price),
    oldPrice: row.old_price == null ? undefined : Number(row.old_price),
    sku: String(row.sku),
    stock: Number(row.stock),
    sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : [],
    colors: Array.isArray(row.colors) ? (row.colors as Product["colors"]) : [],
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    rating: Number(row.rating),
    reviewsCount: Number(row.reviews_count),
    featured: Boolean(row.featured),
    bestSeller: Boolean(row.best_seller),
    newArrival: Boolean(row.new_arrival),
    status: String(row.status) as Product["status"],
  };
}

function mapSupabaseOrder(row: Record<string, unknown>) {
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
    status: String(row.status),
    paymentStatus: String(row.payment_status),
    paymentMethod: String(row.payment_method),
    deliveryMethod: String(row.delivery_method),
    address: row.address as Order["address"],
    estimatedDelivery: row.estimated_delivery ? String(row.estimated_delivery) : "",
  };
}

function mapSupabaseCustomer(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone == null ? "" : String(row.phone),
    joinedAt: String(row.joined_at),
    orders: Number(row.orders),
    totalSpent: Number(row.total_spent),
    status: String(row.status),
    addresses: Array.isArray(row.addresses) ? (row.addresses as Address[]) : [],
  };
}
