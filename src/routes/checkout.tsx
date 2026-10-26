import { deliveryCost } from "@/lib/pricing";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { customerService } from "@/services/customerService";
import { useCurrency } from "@/context/CurrencyContext";
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, ShoppingBag } from "lucide-react";
import { ShipIcon, PickupIcon } from "@/components/store/Icons";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

interface AddressData {
  firstName: string;
  lastName: string;
  country: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

interface FormData {
  email: string;
  shipping: AddressData;
  billing: AddressData;
}

const COUNTRIES = [
  "Nigeria",
  "United Kingdom",
  "United States",
  "Canada",
  "Ghana",
  "United Arab Emirates",
  "South Africa",
  "France",
  "Germany",
  "Kenya",
];

export function CheckoutPage() {
  const { formatPrice, formatTotal, currency } = useCurrency();
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const deliveryType = cart.deliveryMethod === "London Boutique Pickup" ? "pickup" : "ship";
  const shippingMethod = cart.deliveryMethod === "Lekki Phase 1 / Island Axis" ? "lekki" : cart.deliveryMethod === "Lagos Mainland" ? "mainland" : "london";
  const setDeliveryType = (type: "ship" | "pickup") => cart.setDeliveryMethod(type === "pickup" ? "London Boutique Pickup" : "London Standard Delivery");
  const setShippingMethod = (method: string) => cart.setDeliveryMethod(method === "lekki" ? "Lekki Phase 1 / Island Axis" : method === "mainland" ? "Lagos Mainland" : "London Standard Delivery");
  const [paymentMethod, setPaymentMethod] = useState<"flutterwave" | "espees">("flutterwave");
  const [billingOption, setBillingOption] = useState<"same" | "different">("same");
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: user?.email ?? "",
    shipping: {
      firstName: user?.name?.split(" ")[0] ?? "",
      lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
      country: "Nigeria",
      street: "",
      apartment: "",
      city: "",
      state: "Lagos",
      postalCode: "",
      phone: user?.phone ?? "",
    },
    billing: {
      firstName: "",
      lastName: "",
      country: "Nigeria",
      street: "",
      apartment: "",
      city: "",
      state: "Lagos",
      postalCode: "",
      phone: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) void navigate({ to: "/login", replace: true });
  }, [navigate, user]);

  const updateShippingField = (field: keyof AddressData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value },
    }));
  };

  const updateBillingField = (field: keyof AddressData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      billing: { ...prev.billing, [field]: value },
    }));
  };

  if (!user) return null;

  if (!cart.items.length) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-4xl px-6 py-32 text-center font-sans">
          <p className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Your Bag is Empty
          </p>
          <h1 className="mb-8 text-3xl md:text-4xl font-light text-[#1A1A1A]">
            Add items to check out
          </h1>
          <Link
            to="/shop"
            className="selah-button inline-flex h-12 items-center justify-center bg-[#1A1A1A] px-8 text-sm font-light text-white transition-all hover:bg-black/80 font-sans tracking-widest uppercase"
          >
            Shop the Collection
          </Link>
        </div>
      </StoreLayout>
    );
  }

  const shippingCost = cart.shipping;
  const finalTotal = cart.total;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);

    const activeAddress =
      billingOption === "different" ? formData.billing : formData.shipping;

    try {
      const order = await orderService.create({
        customer: {
          id: user.id,
          name: `${formData.shipping.firstName} ${formData.shipping.lastName}`,
          email: formData.email,
          phone: formData.shipping.phone,
        },
        address: {
          fullName: `${activeAddress.firstName || formData.shipping.firstName} ${
            activeAddress.lastName || formData.shipping.lastName
          }`,
          phone: activeAddress.phone || formData.shipping.phone,
          street:
            deliveryType === "pickup"
              ? "42 Carnaby Street"
              : `${activeAddress.street} ${activeAddress.apartment}`.trim(),
          city: deliveryType === "pickup" ? "London" : activeAddress.city,
          state: deliveryType === "pickup" ? "Greater London" : activeAddress.state,
          country: deliveryType === "pickup" ? "United Kingdom" : activeAddress.country,
        },
        deliveryMethod:
          deliveryType === "pickup"
            ? "London Boutique Pickup"
            : shippingMethod === "london"
            ? "London Standard Delivery"
            : shippingMethod === "lekki"
            ? "Lekki Phase 1 / Island Axis"
            : "Lagos Mainland",
        paymentMethod: paymentMethod === "flutterwave" ? "Flutterwave" : "Espees Transfer",
        items: cart.items,
        subtotal: cart.subtotal,
        discount: cart.discount,
        couponCode: cart.coupon?.code,
        shipping: shippingCost,
        total: finalTotal,
      });

      if (paymentMethod === "flutterwave") {
        const payment = await paymentService.initialise(order.id);
        window.location.assign(payment.authorizationUrl);
        return;
      }

      await customerService.recordOrder({
        id: user.id,
        name: `${formData.shipping.firstName} ${formData.shipping.lastName}`,
        email: formData.email,
        phone: formData.shipping.phone,
        total: finalTotal,
      });

      cart.clear();
      await navigate({ to: "/order/$id", params: { id: order.id } });
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to process order. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <StoreLayout>
      <div className="w-full min-h-screen font-sans text-[#1A1A1A]">
        
        {/* ================= MOBILE ORDER SUMMARY ACCORDION BAR ================= */}
        <div className="lg:hidden mt-4 border-y border-gray-200 bg-[#F5F5F5]">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="flex w-full items-center justify-between px-6 py-4 text-sm font-medium text-[#1A1A1A]"
          >
            <div className="flex items-center gap-2 text-blue-600">
              <ShoppingBag className="size-4" />
              <span>{mobileSummaryOpen ? "Hide order summary" : "Show order summary"}</span>
              {mobileSummaryOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </div>
            <span className="text-base font-medium">
              {formatTotal(cart.subtotal, cart.discount, shippingCost)}
            </span>
          </button>

          {mobileSummaryOpen && (
            <div className="px-6 pb-6 pt-2 space-y-4 border-t border-gray-200/60 bg-[#F5F5F5]">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative shrink-0 h-24 w-24 rounded border bg-white">
                      <img src={item.image} alt={item.name} className="h-full w-full rounded-[inherit] object-contain" />
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[9px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-medium text-[#1A1A1A] line-clamp-2">{item.name}</h4>
                      <p className="text-[11px] text-gray-500">Size: {item.size}</p>
                    </div>
                    <span className="text-xs font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="h-10 flex-1 rounded border border-gray-300 bg-white px-3 text-xs outline-none"
                />
                <button type="button" className="selah-button h-10 px-4 rounded border bg-gray-200 text-xs font-medium">
                  Apply
                </button>
              </div>

              <div className="space-y-2 text-xs text-gray-600 border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>−{formatPrice(cart.discount)}</span></div>}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          
          {/* ================= LEFT COLUMN: FORM ================= */}
          <div className="lg:col-span-7 bg-white px-6 sm:px-12 lg:pl-20 lg:pr-14 py-12">
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto lg:mx-0 space-y-10">
              
              {/* Contact */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-medium text-[#1A1A1A]">Contact</h2>
                  <Link to="/login" className="text-xs font-medium text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black transition-colors"
                  />
                  <HelpCircle className="absolute right-3.5 top-3.5 size-5 text-gray-400" />
                </div>
                <label className="mt-2.5 flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 rounded border-gray-300 accent-black" />
                  Email me with news and offers
                </label>
              </div>

              {/* Delivery */}
              <div>
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-4">Delivery</h2>
                
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg mb-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("ship")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                      deliveryType === "ship" ? "bg-white text-black shadow-xs" : "text-gray-600 hover:text-black"
                    )}
                  >
                    <ShipIcon className="size-5" />
                    Ship
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                      deliveryType === "pickup" ? "bg-white text-black shadow-xs" : "text-gray-600 hover:text-black"
                    )}
                  >
                    <PickupIcon className="size-5" />
                    Pickup
                  </button>
                </div>

                {deliveryType === "pickup" ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">London Boutique Location</p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Selah Girl Society Store</p>
                    <p className="text-sm text-gray-600">42 Carnaby Street, London W1F 7PS, United Kingdom</p>
                    <p className="text-xs text-emerald-600 font-medium pt-1">Ready for pickup within 2 hours</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        value={formData.shipping.country}
                        onChange={(e) => updateShippingField("country", e.target.value)}
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm appearance-none outline-none focus:border-black pr-10"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-3.5 size-5 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First name"
                        value={formData.shipping.firstName}
                        onChange={(e) => updateShippingField("firstName", e.target.value)}
                        required
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={formData.shipping.lastName}
                        onChange={(e) => updateShippingField("lastName", e.target.value)}
                        required
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Address"
                      value={formData.shipping.street}
                      onChange={(e) => updateShippingField("street", e.target.value)}
                      required
                      className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                    />

                    <input
                      type="text"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={formData.shipping.apartment}
                      onChange={(e) => updateShippingField("apartment", e.target.value)}
                      className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.shipping.city}
                        onChange={(e) => updateShippingField("city", e.target.value)}
                        required
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        placeholder="State / County"
                        value={formData.shipping.state}
                        onChange={(e) => updateShippingField("state", e.target.value)}
                        required
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        placeholder="Postal code"
                        value={formData.shipping.postalCode}
                        onChange={(e) => updateShippingField("postalCode", e.target.value)}
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.shipping.phone}
                        onChange={(e) => updateShippingField("phone", e.target.value)}
                        required
                        className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                      />
                      <HelpCircle className="absolute right-3.5 top-3.5 size-5 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Method */}
              {deliveryType === "ship" && (
                <div>
                  <h3 className="text-lg font-medium text-[#1A1A1A] mb-3">Shipping method</h3>
                  <div className="space-y-3 rounded-lg border border-gray-300 bg-white overflow-hidden">
                    <label
                      className={cn(
                        "flex items-center justify-between p-4 cursor-pointer border-b border-gray-200 transition-colors",
                        shippingMethod === "london" && "bg-blue-50/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "london"}
                          onChange={() => setShippingMethod("london")}
                          className="size-4 accent-black"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">London & UK Standard Delivery</p>
                          <p className="text-xs text-gray-500">42 Carnaby Street Hub • 2–3 Days</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(deliveryCost("London Standard Delivery", cart.subtotal)) }</span>
                    </label>

                    <label
                      className={cn(
                        "flex items-center justify-between p-4 cursor-pointer border-b border-gray-200 transition-colors",
                        shippingMethod === "lekki" && "bg-blue-50/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "lekki"}
                          onChange={() => setShippingMethod("lekki")}
                          className="size-4 accent-black"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">Nigeria (Lekki, VI, Ikoyi & Island Axis)</p>
                          <p className="text-xs text-gray-500">Same Day Express Delivery</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(deliveryCost("Lekki Phase 1 / Island Axis", cart.subtotal)) }</span>
                    </label>

                    <label
                      className={cn(
                        "flex items-center justify-between p-4 cursor-pointer transition-colors",
                        shippingMethod === "mainland" && "bg-blue-50/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "mainland"}
                          onChange={() => setShippingMethod("mainland")}
                          className="size-4 accent-black"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">Nigeria (Lagos Mainland & Outskirts)</p>
                          <p className="text-xs text-gray-500">Same Day Express Delivery</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(deliveryCost("Lagos Mainland", cart.subtotal)) }</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Payment */}
              <div>
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Payment</h2>
                <p className="text-xs text-gray-500 mb-3">All transactions are secure and encrypted.</p>

                <div className="rounded-lg border border-gray-300 bg-white overflow-hidden">
                  
                  {/* Flutterwave with Visa & Mastercard SVGs from Public */}
                  <div
                    className={cn(
                      "p-5 border-b border-gray-200 transition-colors",
                      paymentMethod === "flutterwave" && "bg-blue-50/40"
                    )}
                  >
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "flutterwave"}
                          onChange={() => setPaymentMethod("flutterwave")}
                          className="size-4 accent-black"
                        />
                        <span className="text-base font-medium text-[#1A1A1A]">Flutterwave</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <img src="/visa.svg" alt="Visa" className="h-6 w-auto object-contain" />
                        <img src="/master.svg" alt="Mastercard" className="h-6 w-auto object-contain" />
                      </div>
                    </label>

                    {paymentMethod === "flutterwave" && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md border text-center text-xs text-gray-600">
                        You’ll be redirected to Flutterwave to complete your purchase securely.
                      </div>
                    )}
                  </div>

                  {/* Espees with espees.png from Public */}
                  <div
                    className={cn(
                      "p-5 transition-colors",
                      paymentMethod === "espees" && "bg-blue-50/40"
                    )}
                  >
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "espees"}
                          onChange={() => setPaymentMethod("espees")}
                          className="size-4 accent-black"
                        />
                        <span className="text-base font-medium text-[#1A1A1A]">Espees Transfer</span>
                      </div>

                      <img src="/espees.png" alt="Espees" className="h-7 w-auto object-contain" />
                    </label>

                    {paymentMethod === "espees" && (
                      <div className="mt-4 p-4 bg-purple-50/60 rounded-md border border-purple-100 text-center space-y-2">
                        <p className="text-xs text-purple-900">
                          To make payment using Espees, send us a direct message to receive our official account wallet address.
                        </p>
                        <a
                          href="https://wa.me/447835941243?text=Hello%20Selah%20Girl%20Society,%20I%20would%20like%20to%20get%20your%20Espees%20account%20details%20for%20my%20checkout"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold text-purple-700 hover:text-purple-900 underline pt-1"
                        >
                          <MessageCircle className="size-4" />
                          Send a chat to get account details
                        </a>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Billing Address Section */}
              <div>
                <h3 className="text-lg font-medium text-[#1A1A1A] mb-3">Billing address</h3>
                <div className="rounded-lg border border-gray-300 bg-white overflow-hidden">
                  
                  {/* Same as shipping option */}
                  <label className="flex items-center gap-3 p-4 border-b border-gray-200 cursor-pointer">
                    <input
                      type="radio"
                      name="billingOption"
                      checked={billingOption === "same"}
                      onChange={() => setBillingOption("same")}
                      className="size-4 accent-black"
                    />
                    <span className="text-sm text-[#1A1A1A]">Same as shipping address</span>
                  </label>

                  {/* Different billing address option */}
                  <div className={cn(billingOption === "different" && "bg-blue-50/20")}>
                    <label className="flex items-center gap-3 p-4 cursor-pointer">
                      <input
                        type="radio"
                        name="billingOption"
                        checked={billingOption === "different"}
                        onChange={() => setBillingOption("different")}
                        className="size-4 accent-black"
                      />
                      <span className="text-sm font-medium text-[#1A1A1A]">Use a different billing address</span>
                    </label>

                    {/* Expandable Billing Address Form */}
                    {billingOption === "different" && (
                      <div className="p-4 pt-0 space-y-3 border-t border-gray-200 bg-gray-50/50">
                        <div className="relative pt-3">
                          <label className="block text-[11px] text-gray-500 mb-1">Country/Region</label>
                          <select
                            value={formData.billing.country}
                            onChange={(e) => updateBillingField("country", e.target.value)}
                            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm appearance-none outline-none focus:border-black pr-10"
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3.5 bottom-3.5 size-5 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="First name"
                            value={formData.billing.firstName}
                            onChange={(e) => updateBillingField("firstName", e.target.value)}
                            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                          />
                          <input
                            type="text"
                            placeholder="Last name"
                            value={formData.billing.lastName}
                            onChange={(e) => updateBillingField("lastName", e.target.value)}
                            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Address"
                          value={formData.billing.street}
                          onChange={(e) => updateBillingField("street", e.target.value)}
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                        />

                        <input
                          type="text"
                          placeholder="Apartment, suite, etc. (optional)"
                          value={formData.billing.apartment}
                          onChange={(e) => updateBillingField("apartment", e.target.value)}
                          className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                        />

                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="City"
                            value={formData.billing.city}
                            onChange={(e) => updateBillingField("city", e.target.value)}
                            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                          />
                          <input
                            type="text"
                            placeholder="State / County"
                            value={formData.billing.state}
                            onChange={(e) => updateBillingField("state", e.target.value)}
                            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                          />
                          <input
                            type="text"
                            placeholder="Postal code (optional)"
                            value={formData.billing.postalCode}
                            onChange={(e) => updateBillingField("postalCode", e.target.value)}
                            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                          />
                        </div>

                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="Phone (optional)"
                            value={formData.billing.phone}
                            onChange={(e) => updateBillingField("phone", e.target.value)}
                            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                          />
                          <HelpCircle className="absolute right-3.5 top-3.5 size-5 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {errors["submit"] && (
                <div className="rounded-md bg-red-50 p-4 text-xs text-red-600 border border-red-200">
                  {errors["submit"]}
                </div>
              )}

              {/* Pay Now Button */}
              <button
                type="submit"
                disabled={busy}
                className="selah-button flex h-14 w-full items-center justify-center rounded-md bg-[#0066CC] text-base font-medium text-white shadow transition-colors hover:bg-[#0055b3] disabled:opacity-50"
              >
                {busy ? "Processing..." : `Pay now`}
              </button>

              <div className="flex flex-wrap gap-4 text-xs text-blue-600 pt-2">
                <a href="#" className="hover:underline">Refund policy</a>
                <a href="#" className="hover:underline">Shipping</a>
                <a href="#" className="hover:underline">Privacy policy</a>
                <a href="#" className="hover:underline">Terms of service</a>
                <a href="#" className="hover:underline">Contact</a>
              </div>
            </form>
          </div>

          {/* ================= RIGHT COLUMN: DESKTOP ORDER SUMMARY ================= */}
          <div className="hidden lg:block lg:col-span-5 bg-[#F5F5F5] px-6 sm:px-12 lg:px-14 py-12 border-l border-gray-200">
            <div className="max-w-md mx-auto lg:mx-0 sticky top-12 space-y-6">
              
              {/* Cart Items */}
              <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative shrink-0 h-28 w-28 rounded-md border bg-white">
                      <img src={item.image} alt={item.name} className="h-full w-full rounded-[inherit] object-contain" />
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] font-bold text-white shadow-xs">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-[#1A1A1A] line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                    </div>
                    <span className="text-sm font-medium text-[#1A1A1A]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Discount Input */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="h-11 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black"
                />
                <button
                  type="button"
                  className="selah-button h-11 px-5 rounded-md border border-gray-300 bg-gray-200/80 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 pt-2 text-sm border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                  <span>Shipping</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              {cart.discount > 0 && <div className="flex justify-between text-sm"><span>Discount</span><span>−{formatPrice(cart.discount)}</span></div>}
              {paymentMethod === "flutterwave" && currency !== "NGN" && <p className="text-xs text-gray-500">Flutterwave processes payment in NGN. Your selected currency is used to display prices.</p>}
              {/* Total Summary */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                <span className="text-base font-medium text-[#1A1A1A]">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 mr-1.5">{currency}</span>
                  <span className="text-xl font-semibold text-[#1A1A1A]">
                    {formatTotal(cart.subtotal, cart.discount, shippingCost)}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </StoreLayout>
  );
}
