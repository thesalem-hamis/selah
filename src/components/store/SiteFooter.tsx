import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { categories } from "@/data/catalog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const customerService = [
  { label: "Shipping & delivery", to: "/about" },
  { label: "Returns & refunds", to: "/about" },
  { label: "Size guide", to: "/about" },
  { label: "Contact us", to: "/about" },
];

const company = [
  { label: "Our story", to: "/about" },
  { label: "Collections", to: "/collections" },
  { label: "New arrivals", to: "/new-arrivals" },
  { label: "Terms of service", to: "/about" },
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
        className="h-12 min-w-0 flex-1 rounded-full border border-border bg-surface px-5 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
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
  return (
    <footer className="mt-20 border-t border-border bg-sand/50">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="font-display text-2xl tracking-tight">
              Selah
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Modest clothing made in small batches in UK - considered cuts, natural fabrics and
              finishing you can feel.
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

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Selah Studio. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/about" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link to="/about" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link to="/about" className="transition-colors hover:text-foreground">
              Refund policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
