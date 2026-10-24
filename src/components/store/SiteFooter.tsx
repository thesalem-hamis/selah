import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { categories } from "@/data/catalog";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import "@/styles/footer.css";

const customerService = [
  { label: "Shipping", to: "/support#shipping" },
  { label: "Orders & payments", to: "/support#orders-and-payments" },
  { label: "Refunds & returns", to: "/support#returns" },
  { label: "Contact us directly", to: "/support#contact" },
];

const company = [
  { label: "Our story", to: "/about" },
  { label: "InnerCity Mission", to: "/pakistan-journey" },
  { label: "Rewards", to: "/rewards" },
  { label: "FAQ", to: "/about#faq" },
  { label: "Collections", to: "/collections" },
  { label: "New arrivals", to: "/new-arrivals" },
  { label: "Privacy Policy", to: "/privacy-policy" },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form
      className="mt-4 flex flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.includes("@")) {
          toast.error("Enter a valid email address");
          return;
        }
        toast.success("You're on the list", { description: "Watch your inbox for the next drop." });
        setEmail("");
      }}
    >
      <label className="sr-only" htmlFor="footer-email">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        className="h-12 shrink-0 min-w-0 flex-1 rounded-full border border-border bg-surface px-5 py-5 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
      />
      <button
        type="submit"
        className="h-12 shrink-0 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Subscribe
      </button>
    </form>
  );
}

export function SiteFooter() {
  const { currency, setCurrency } = useCurrency();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateScrollDirection = () => {
      const currentY = window.scrollY;
      const distance = currentY - lastScrollY.current;
      if (Math.abs(distance) > 2) {
        setScrollDirection(distance > 0 ? "down" : "up");
        lastScrollY.current = currentY;
      }
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  return (
    <footer className="sm:m-8 m-3 border-border rounded-4xl bg-sand/50">
      <div className="container-page py-14">
        <div className="home-footer-wordmark">
          <Link
            to="/"
            className={`home-footer-wordmark__text is-scroll-${scrollDirection}`}
            aria-label="Selah Girl Society home"
          >
            selah
          </Link>
        </div>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="font-display text-2xl tracking-tight">
              Selah
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Faith and fashion, beautifully aligned. Everyday essentials for the modern believer.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[Instagram, Facebook, Twitter, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label="Selah social profile"
                  className="grid size-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Desktop columns */}
          <div className="hidden lg:col-span-5 lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Shop
              </h2>
              <ul className="space-y-3 text-sm">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to="/category/$slug"
                      params={{ slug: category.slug }}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Customer service
              </h2>
              <ul className="space-y-3 text-sm">
                {customerService.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Company
              </h2>
              <ul className="space-y-3 text-sm">
                {company.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile collapsed columns */}
          <div className="lg:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="shop">
                <AccordionTrigger className="text-sm">Shop</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2 text-sm">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link to="/category/$slug" params={{ slug: category.slug }}>
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="service">
                <AccordionTrigger className="text-sm">Customer service</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2 text-sm">
                    {customerService.map((item) => (
                      <li key={item.label}>
                        <Link to={item.to}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="company">
                <AccordionTrigger className="text-sm">Company</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2 text-sm">
                    {company.map((item) => (
                      <li key={item.label}>
                        <Link to={item.to}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Join the list
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Early access to new pieces and restocks. No noise.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 border-t border-border pt-6 text-xs text-muted-foreground sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Selah Studio. All rights reserved.</p>
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="footer-currency" className="shrink-0">Currency</label>
            <select
              id="footer-currency"
              aria-label="Choose country and currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as typeof currency)}
              className="max-w-full bg-transparent font-semibold text-foreground outline-none"
            >
              <option value="GBP">United Kingdom (GBP £)</option>
              <option value="USD">United States (USD $)</option>
              <option value="NGN">Nigeria (NGN ₦)</option>
              <option value="ESPEES">Espees</option>
            </select>
          </div>
          <div className="flex flex-wrap justify-center gap-5 sm:justify-end">
            <Link to="/support" className="transition-colors hover:text-foreground">
              Support
            </Link>
            <Link to="/privacy-policy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/support#returns" className="transition-colors hover:text-foreground">
              Refund policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
