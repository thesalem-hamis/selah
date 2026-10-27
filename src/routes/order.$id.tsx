import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreditCard, MessageCircle } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { useCurrency } from "@/context/CurrencyContext";

export const Route = createFileRoute("/order/$id")({
  component: OrderPage,
});

type OrderAddress = {
  fullName?: string;
  phone?: string;
  street?: string;
  apartment?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

function OrderPage() {
  const { formatPrice } = useCurrency();
  const { id } = Route.useParams();

  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [espeesTransferReported, setEspeesTransferReported] =
    useState(false);

  const query = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.byId(id),
  });

  const order = query.data;

  const retryPayment = async () => {
    setPaymentBusy(true);
    setPaymentError("");

    try {
      const payment = await paymentService.initialise(id);
      window.location.assign(payment.authorizationUrl);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Payment could not be started.",
      );
      setPaymentBusy(false);
    }
  };

  const address = order?.address as OrderAddress | null | undefined;

  const deliveryAddress = [
    address?.street,
    address?.apartment,
    address?.city,
    address?.state,
    address?.postalCode,
    address?.country,
  ]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(", ");

  const whatsappReceiptUrl = order
    ? `https://wa.me/447835941243?text=${encodeURIComponent(
        [
          "Hello Selah Girl Society!",
          "",
          "I have completed my Espees transfer for my order. Please verify my payment. I will attach my payment receipt to this WhatsApp message.",
          "",
          "========== CUSTOMER DETAILS ==========",
          `Customer Name: ${order.customerName || address?.fullName || "Not provided"}`,
          `Phone Number: ${address?.phone || "Not provided"}`,
          `Email Address: ${order.customerEmail || "Not provided"}`,
          "",
          "========== DELIVERY DETAILS ==========",
          `Delivery Method: ${order.deliveryMethod || "Not provided"}`,
          `Recipient Name: ${address?.fullName || order.customerName || "Not provided"}`,
          `Delivery Phone: ${address?.phone || "Not provided"}`,
          `Delivery Address: ${deliveryAddress || "Not provided"}`,
          "",
          "========== ORDER DETAILS ==========",
          `Order Number: ${order.reference}`,
          `Order Date: ${new Date(order.createdAt).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            },
          )}`,
          `Payment Method: Espees Transfer`,
          `Payment Status: Awaiting store verification`,
          "",
          "========== ITEMS ORDERED ==========",
          ...order.items.map((item, index) =>
            [
              `${index + 1}. ${item.name}`,
              `Size: ${item.size || "Not specified"}`,
              `Color: ${item.color || "Not specified"}`,
              `Quantity: ${item.quantity}`,
              `Unit Price: ${formatPrice(item.price)}`,
              `Item Total: ${formatPrice(item.price * item.quantity)}`,
            ].join("\n"),
          ),
          "",
          "========== PAYMENT SUMMARY ==========",
          `Subtotal: ${formatPrice(order.subtotal)}`,
          ...(order.discount > 0
            ? [`Discount: -${formatPrice(order.discount)}`]
            : []),
          `Shipping: ${
            order.shipping === 0
              ? "Free"
              : formatPrice(order.shipping)
          }`,
          `TOTAL TO VERIFY: ${formatPrice(order.total)}`,
          "",
          "I have attached my payment receipt. Please verify my transfer and confirm my order. Thank you!",
        ].join("\n"),
      )}`
    : "";

  return (
    <StoreLayout>
      <div className="container-page max-w-3xl py-24 md:py-32">
        <div className="mb-16 text-center">
          <h1
            className="mb-4 text-4xl text-[#1A1A1A] md:text-5xl"
            style={{
              fontFamily: "var(--font-selah)",
              fontWeight: 300,
            }}
          >
            Thank you for your order.
          </h1>

          <p className="text-[13px] text-[#444444]">
            {order?.paymentStatus === "paid"
              ? "Your payment is confirmed and your order is being processed."
              : "Your order is saved. Payment confirmation is still pending."}
          </p>

          {order && (
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
              Order No. {order.reference}
            </p>
          )}
        </div>

        {query.isError ? (
          <div
            role="alert"
            className="border border-red-200 bg-red-50 p-6 text-sm text-red-800"
          >
            We could not load your order. Please refresh the page or contact
            Selah Girl Society for assistance.
          </div>
        ) : order ? (
          <div className="border border-[#E5E5E5] bg-[#f4f4f4]/30 p-6 md:p-10">
            {/* Order overview */}
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-8 md:flex-row">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  Date
                </p>
                <p className="text-[13px] text-[#1A1A1A]">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  Total
                </p>
                <p className="text-[13px] text-[#1A1A1A]">
                  {formatPrice(order.total)}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  Status
                </p>
                <p className="text-[13px] capitalize text-[#1A1A1A]">
                  {order.status}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  Payment
                </p>
                <p className="text-[13px] capitalize text-[#1A1A1A]">
                  {order.paymentStatus}
                </p>
              </div>
            </div>

            {/* Flutterwave payment */}
            {order.paymentStatus === "unpaid" &&
            order.paymentMethod.toLowerCase().includes("flutterwave") ? (
              <div className="mb-8 border border-[#E5E5E5] bg-white p-5">
                <p className="text-sm">
                  Complete payment to confirm this order.
                </p>

                <button
                  type="button"
                  onClick={() => void retryPayment()}
                  disabled={paymentBusy}
                  className="selah-button mt-4 inline-flex h-11 items-center justify-center gap-2 bg-[#1A1A1A] px-5 text-[11px] font-bold uppercase tracking-[0.1em] text-white disabled:opacity-50"
                >
                  <CreditCard className="size-4" />
                  {paymentBusy
                    ? "Opening payment..."
                    : "Pay with Flutterwave"}
                </button>

                {paymentError ? (
                  <p role="alert" className="mt-3 text-sm text-red-700">
                    {paymentError}
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Espees transfer */}
            {order.paymentMethod.toLowerCase().includes("espees") ? (
              <div className="mb-8 border border-purple-100 bg-purple-50/60 p-5">
                <h2 className="text-sm font-semibold text-purple-950">
                  Pay with Espees Transfer
                </h2>

                <p className="mt-2 text-sm text-purple-950">
                  Send <strong>{formatPrice(order.total)}</strong> to the
                  account below. Use your order number as the payment
                  reference.
                </p>

                <dl className="mt-4 grid gap-3 rounded-md border border-purple-200 bg-white p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-gray-500">Account name</dt>
                    <dd className="font-medium text-[#1A1A1A]">
                      Selah Girl Society
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-gray-500">
                      Espees account / wallet
                    </dt>
                    <dd className="break-words font-medium text-[#1A1A1A]">
                      ESPEES-WALLET-XXXX-XXXX
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-xs text-gray-500">
                      Payment reference
                    </dt>
                    <dd className="font-medium text-[#1A1A1A]">
                      {order.reference}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-xs text-amber-800">
                  The wallet shown above is a placeholder. Replace it with
                  Selah's official Espees account before accepting real
                  payments. Your payment remains pending until the store
                  verifies your transfer.
                </p>

                {!espeesTransferReported ? (
                  <button
                    type="button"
                    onClick={() => setEspeesTransferReported(true)}
                    className="selah-button mt-4 inline-flex min-h-11 items-center justify-center gap-2 bg-[#1A1A1A] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black/80"
                  >
                    I've completed the transfer
                  </button>
                ) : (
                  <div className="mt-5 border-t border-purple-200 pt-5">
                    <p className="text-sm leading-6 text-purple-950">
                      Your customer details and order information are ready.
                      Open WhatsApp below, attach your transfer receipt, and
                      send the message to Selah Girl Society.
                    </p>

                    <a
                      href={whatsappReceiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="selah-button mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#1A1A1A] px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black/80 sm:w-auto"
                    >
                      <MessageCircle className="size-4" />
                      Send Cart with Receipt via WhatsApp
                    </a>

                    <p className="mt-3 text-xs leading-5 text-purple-900">
                      The message includes the customer's name, phone number,
                      email, delivery method, delivery address, every order
                      item, quantities, sizes, colors, and payment totals.
                      Attach the receipt manually in WhatsApp. Sending the
                      message does not automatically confirm payment.
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {/* Customer and delivery information */}
            <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
              Customer & Delivery Details
            </h2>

            <div className="mb-8 grid gap-4 border-b border-[#E5E5E5] pb-8 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#777777]">Customer name</p>
                <p className="mt-1 text-sm text-[#1A1A1A]">
                  {order.customerName || address?.fullName || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#777777]">Email address</p>
                <p className="mt-1 break-words text-sm text-[#1A1A1A]">
                  {order.customerEmail || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#777777]">Phone number</p>
                <p className="mt-1 text-sm text-[#1A1A1A]">
                  {address?.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#777777]">Delivery method</p>
                <p className="mt-1 text-sm text-[#1A1A1A]">
                  {order.deliveryMethod || "Not provided"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-[#777777]">Delivery address</p>
                <p className="mt-1 text-sm leading-6 text-[#1A1A1A]">
                  {deliveryAddress || "Not provided"}
                </p>
              </div>
            </div>

            {/* All ordered items */}
            <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
              Order Details
            </h2>

            <div className="divide-y divide-[#E5E5E5]">
              {order.items.map((item, index) => (
                <div
                  key={`${item.slug}-${index}`}
                  className="flex items-center gap-4 py-6 sm:gap-6"
                >
                  <div className="size-20 flex-shrink-0 bg-[#f4f4f4] p-2 sm:size-24">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[13px] text-[#1A1A1A]">
                      {item.name}
                    </p>

                    <p className="text-[12px] text-[#777777]">
                      Size: {item.size || "Not specified"}
                      <span className="mx-2">|</span>
                      Qty: {item.quantity}
                    </p>

                    {item.color ? (
                      <p className="mt-1 text-[12px] text-[#777777]">
                        Color: {item.color}
                      </p>
                    ) : null}
                  </div>

                  <span className="whitespace-nowrap text-[13px] text-[#1A1A1A]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order totals */}
            <div className="mt-6 space-y-3 border-t border-[#E5E5E5] pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#777777]">Subtotal</span>
                <span className="text-[#1A1A1A]">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              {order.discount > 0 ? (
                <div className="flex justify-between gap-4">
                  <span className="text-[#777777]">Discount</span>
                  <span className="text-[#1A1A1A]">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between gap-4">
                <span className="text-[#777777]">Shipping</span>
                <span className="text-[#1A1A1A]">
                  {order.shipping === 0
                    ? "Free"
                    : formatPrice(order.shipping)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-[#E5E5E5] pt-4 font-semibold">
                <span className="text-[#1A1A1A]">Total</span>
                <span className="text-[#1A1A1A]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-10 flex flex-col justify-between gap-4 border-t border-[#E5E5E5] pt-10 sm:flex-row">
              <Link
                to="/shop"
                className="selah-button flex h-12 flex-1 items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
              >
                CONTINUE SHOPPING
              </Link>

              <Link
                to="/account"
                className="selah-button flex h-12 flex-1 items-center justify-center border border-[#E5E5E5] bg-transparent text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:border-[#1A1A1A]"
              >
                VIEW ACCOUNT
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="size-6 animate-spin rounded-full border-2 border-[#1A1A1A] border-r-transparent" />
          </div>
        )}
      </div>
    </StoreLayout>
  );
}