import type { Coupon } from "@/types";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { coupons as seed } from "@/data/store";
import { supabase } from "@/lib/supabase";
import { ApiError, request } from "./http";

let coupons: Coupon[] = [...seed];

export interface PaymentIntent {
  authorizationUrl: string;
  reference: string;
  provider: "flutterwave";
}

export const paymentService = {
  async initialise(orderId: string): Promise<PaymentIntent> {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client.functions.invoke<PaymentIntent>("flutterwave-payments", {
      body: { orderId },
    });
    if (error) {
      if (error instanceof FunctionsHttpError) {
        const payload = await error.context.clone().json().catch(() => null) as { error?: string } | null;
        throw new ApiError(payload?.error ?? error.message, error.context.status);
      }
      throw new ApiError(error.message, 400);
    }
    if (!data?.authorizationUrl || !data.reference) {
      throw new ApiError("Flutterwave did not return a payment link", 502);
    }
    return data;
  },
  listCoupons() {
    return request<Coupon[]>("/admin/coupons", () => coupons);
  },
  saveCoupon(coupon: Coupon) {
    return request<Coupon[]>("/admin/coupons", () => {
      const exists = coupons.some((item) => item.id === coupon.id);
      coupons = exists
        ? coupons.map((item) => (item.id === coupon.id ? coupon : item))
        : [...coupons, coupon];
      return coupons;
    });
  },
  removeCoupon(id: string) {
    return request<Coupon[]>(`/admin/coupons/${id}`, () => {
      coupons = coupons.filter((item) => item.id !== id);
      return coupons;
    });
  },
  validateCoupon(code: string, subtotal: number) {
    return request<{ code: string; discount: number }>("/coupons/validate", () => {
      const coupon = coupons.find(
        (item) => item.code.toLowerCase() === code.trim().toLowerCase() && item.active,
      );
      if (!coupon) throw new ApiError("That code isn't valid", 404);
      if (subtotal < coupon.minOrder) {
        throw new ApiError("Order total is below the minimum for this code", 400);
      }
      const raw =
        coupon.type === "percentage" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
      const discount = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
      return { code: coupon.code, discount };
    });
  },
};
