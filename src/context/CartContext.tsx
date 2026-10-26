import { productPriceNgn } from "@/lib/format";
import { cartTotals, type DeliveryMethod } from "@/lib/pricing";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "selah.cart";
export const SHIPPING_FLAT = 5000;
export const FREE_SHIPPING_THRESHOLD = 100000;

interface AppliedCoupon {
  code: string;
  discount: number;
}

interface CartContextValue {
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: AppliedCoupon | null;
  add: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  applyCoupon: (coupon: AppliedCoupon | null) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("London Standard Delivery");
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw)
        setItems(
          (JSON.parse(raw) as CartItem[]).map((item) => ({
            ...item,
            price: productPriceNgn(item),
          })),
        );
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback<CartContextValue["add"]>((product, options) => {
    const size = options?.size ?? product.sizes[0] ?? "One Size";
    const color = options?.color ?? product.colors[0]?.name ?? "Default";
    const quantity = Math.max(
      1,
      Math.min(Math.floor(options?.quantity ?? 1) || 1, product.stock || 99),
    );
    const id = `${product.id}-${size}-${color}`;

    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock || 99) }
            : item,
        );
      }
      const next: CartItem = {
        id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? "",
        price: productPriceNgn(product),
        ...(product.oldPrice !== undefined ? { oldPrice: product.oldPrice } : {}),
        size,
        color,
        quantity,
        stock: product.stock,
      };
      return [...current, next];
    });
    toast.success("Added to bag", { description: `${product.name} · ${size} · ${color}` });
    setIsCartOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, Math.min(Math.floor(quantity) || 1, item.stock || 99)),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const { subtotal, discount, shipping, total } = cartTotals(
      items,
      coupon?.discount ?? 0,
      deliveryMethod,
    );
    return {
      deliveryMethod,
      setDeliveryMethod,
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      shipping,
      total,
      coupon,
      add,
      remove,
      setQuantity,
      clear,
      applyCoupon: setCoupon,
      isCartOpen,
      openCart,
      closeCart,
    };
  }, [
    deliveryMethod,
    items,
    coupon,
    add,
    remove,
    setQuantity,
    clear,
    isCartOpen,
    openCart,
    closeCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
