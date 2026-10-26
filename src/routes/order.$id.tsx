import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { useCurrency } from "@/context/CurrencyContext";

export const Route = createFileRoute("/order/$id")({ component: OrderPage });

function OrderPage() {
  const { formatPrice } = useCurrency();
  const { id } = Route.useParams();
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const query = useQuery({ queryKey: ["order", id], queryFn: () => orderService.byId(id) });
  const order = query.data;

  const retryPayment = async () => {
    setPaymentBusy(true);
    setPaymentError("");
    try {
      const payment = await paymentService.initialise(id);
      window.location.assign(payment.authorizationUrl);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Payment could not be started.");
      setPaymentBusy(false);
    }
  };

  return (
    <StoreLayout>
      <div className="container-page max-w-3xl py-24 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl text-[#1A1A1A] mb-4" style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}>
            Thank you for your order.
          </h1>
          <p className="text-[13px] text-[#444444]">
            {order?.paymentStatus === "paid" ? "Your payment is confirmed and your order is being processed." : "Your order is saved. Payment confirmation is still pending."}
          </p>
          {order && (
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
              Order No. {order.reference}
            </p>
          )}
        </div>

        {order ? (
          <div className="border border-[#E5E5E5] bg-[#f4f4f4]/30 p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between pb-8 mb-8 border-b border-[#E5E5E5] gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] mb-1">Date</p>
                <p className="text-[13px] text-[#1A1A1A]">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] mb-1">Total</p>
                <p className="text-[13px] text-[#1A1A1A]">{formatPrice(order.total)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] mb-1">Status</p>
                <p className="text-[13px] text-[#1A1A1A] capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] mb-1">Payment</p>
                <p className="text-[13px] text-[#1A1A1A] capitalize">{order.paymentStatus}</p>
              </div>
            </div>

            {order.paymentStatus === "unpaid" && order.paymentMethod.toLowerCase().includes("flutterwave") ? (
              <div className="mb-8 border border-[#E5E5E5] bg-white p-5">
                <p className="text-sm">Complete payment to confirm this order.</p>
                <button type="button" onClick={() => void retryPayment()} disabled={paymentBusy} className="selah-button mt-4 inline-flex h-11 items-center justify-center gap-2 bg-[#1A1A1A] px-5 text-[11px] font-bold uppercase tracking-[0.1em] text-white disabled:opacity-50">
                  <CreditCard className="size-4" /> {paymentBusy ? "Opening payment..." : "Pay with Flutterwave"}
                </button>
                {paymentError ? <p role="alert" className="mt-3 text-sm text-red-700">{paymentError}</p> : null}
              </div>
            ) : null}

            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-6">
              Order Details
            </h2>
            <div className="divide-y divide-[#E5E5E5]">
              {order.items.map((item) => (
                <div key={item.slug} className="flex items-center gap-6 py-6">
                  <div className="bg-[#f4f4f4] size-24 p-2 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-[#1A1A1A] mb-1">{item.name}</p>
                    <p className="text-[12px] text-[#777777]">
                      Size: {item.size} <span className="mx-2">|</span> Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-[13px] text-[#1A1A1A]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4 border-t border-[#E5E5E5] pt-10">
              <Link
                to="/shop"
                className="selah-button flex-1 flex items-center justify-center h-12 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-black/80"
              >
                CONTINUE SHOPPING
              </Link>
              <Link
                to="/account"
                className="selah-button flex-1 flex items-center justify-center h-12 border border-[#E5E5E5] bg-transparent text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:border-[#1A1A1A]"
              >
                VIEW ACCOUNT
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1A1A1A] border-r-transparent" />
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
