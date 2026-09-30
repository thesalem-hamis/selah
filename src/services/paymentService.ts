import type { Coupon } from "@/types";
import { coupons as seed } from "@/data/store";
import { ApiError, request } from "./http";

let coupons: Coupon[] = [...seed];

export interface PaymentIntent {
  reference: string;
  status: "success" | "failed";
  provider: "paystack";
  amount: number;
}

/**
 * Payment is intentionally isolated here. Connecting Paystack later means
 * replacing `initialise` with a call that returns an authorization URL and
 * verifying the reference server-side - no UI changes required.
 */
export const paymentService = {
  async initialise(amount: number, email: string): Promise<PaymentIntent> {
    return request<PaymentIntent>("/payments/initialise", () => ({
      reference: `PSK_${Date.now().toString().slice(-8)}`,
      status: "success",
      provider: "paystack",
      amount,
    }), {
      method: "POST",
      body: JSON.stringify({ amount, email }),
    });
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
