import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";

export const Route = createFileRoute("/support")({ component: SupportPage });

const topics = [
  ["Shipping", "Shipping options and delivery estimates are shown at checkout for your delivery address. We will send an order confirmation once your purchase is placed."],
  ["Orders and payments", "Review your order details in your account. Checkout currently offers Flutterwave and Espees transfer; Espees instructions are provided during checkout."],
  ["Refunds and returns", "For help with a return or refund, contact our team with your order number so we can guide you through the next steps."],
];

function SupportPage() {
  return <StoreLayout><main className="container-page min-h-[70vh] py-20 md:py-28"><header className="mx-auto max-w-3xl text-center"><p className="eyebrow">Here to help</p><h1 className="mt-3 font-display text-5xl md:text-7xl">Support</h1><p className="mt-5 text-muted-foreground">Need a hand with your Selah order? Find the right place to start below.</p></header><div className="mx-auto mt-14 max-w-3xl divide-y divide-border border-y border-border">{topics.map(([title, copy], index) => <section id={["shipping", "orders-and-payments", "returns"][index]} key={title} className="py-7"><h2 className="font-display text-2xl">{title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{copy}</p></section>)}</div><div id="contact" className="cloud-accent mx-auto mt-10 max-w-3xl rounded-3xl p-7"><h2 className="font-display text-2xl">Contact us directly</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">For order-specific help, include your order number and the email used at checkout.</p><Link to="/about#faq" className="mt-5 inline-flex rounded-full border border-border px-5 py-2.5 text-sm">Visit our FAQ</Link></div></main></StoreLayout>;
}
