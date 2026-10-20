import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const shopLinks = [
  { label: "SHOP SELAH · FULL RANGE", to: "/shop" },
  { label: "THE 828 COLLECTION", to: "/shop?collection=828-series" },
  { label: "WHITE BABY TEES", to: "/shop?collection=white-baby-tees" },
];

export function SidebarNav({ isOpen, onClose }: SidebarNavProps) {
  const [activeTab, setActiveTab] = useState<"SHOP" | "EXPLORE">("SHOP");
  const [email, setEmail] = useState("");

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar with White Glassmorphism + Soft Pink tint */}
      <div
        id="store-menu"
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 flex h-full w-full flex-col bg-[#FDF0F5]/85 backdrop-blur-xl border-r border-white/60 text-[#1A1A1A] shadow-2xl transition-transform duration-300 ease-in-out sm:w-[400px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Tabs */}
        <div className="flex h-14 shrink-0 items-center border-b border-black/5 md:h-20 font-['Alumni_Sans',sans-serif]">
          <button
            onClick={() => setActiveTab("SHOP")}
            className={cn(
              "flex h-full flex-1 items-center justify-center text-sm font-bold uppercase tracking-[0.2em] transition-colors",
              activeTab === "SHOP" 
                ? "bg-white/90 text-[#1A1A1A] shadow-sm" 
                : "bg-white/30 text-[#777777] hover:text-[#1A1A1A]"
            )}
          >
            SHOP
          </button>
          <button
            onClick={() => setActiveTab("EXPLORE")}
            className={cn(
              "flex h-full flex-1 items-center justify-center text-sm font-bold uppercase tracking-[0.2em] transition-colors",
              activeTab === "EXPLORE" 
                ? "bg-white/90 text-[#1A1A1A] shadow-sm" 
                : "bg-white/30 text-[#777777] hover:text-[#1A1A1A]"
            )}
          >
            EXPLORE
          </button>
          <button
            onClick={onClose}
            className="flex h-full w-14 items-center justify-center bg-white/40 text-[#555555] hover:text-black md:w-20 transition-colors"
            aria-label="Close menu"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="px-8 py-10 font-['Alumni_Sans',sans-serif]">
            {activeTab === "SHOP" && (
              <div className="space-y-6">
                {shopLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="text-lg md:text-xl font-medium uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors hover:text-[#E5348A]"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "EXPLORE" && (
              <div className="space-y-6">
                <div>
                  <Link
                    to="/about"
                    onClick={onClose}
                    className="text-lg md:text-xl font-medium uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors hover:text-[#E5348A]"
                  >
                    ABOUT US
                  </Link>
                </div>
                <div>
                  <Link
                    to="/pakistan-journey"
                    onClick={onClose}
                    className="text-lg md:text-xl font-medium uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors hover:text-[#E5348A]"
                  >
                    INNER CITY MISSION · FREEDOM PAKISTAN
                  </Link>
                </div>
                <div>
                  <Link to="/about#faq" onClick={onClose} className="text-lg md:text-xl font-medium uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors hover:text-[#E5348A]">FAQ</Link>
                </div>
                <div>
                  <Link to="/rewards" onClick={onClose} className="text-lg md:text-xl font-medium uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors hover:text-[#E5348A]">REWARDS</Link>
                </div>
                <div>
                  <Link to="/support" onClick={onClose} className="text-lg md:text-xl font-medium uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors hover:text-[#E5348A]">SUPPORT</Link>
                </div>
                <div>
                  <Link to="/account" onClick={onClose} className="text-lg md:text-xl font-medium uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors hover:text-[#E5348A]">ACCOUNT</Link>
                </div>
              </div>
            )}
          </div>

          {/* Subscribe + Footer Section */}
          <div className="border-t border-black/10 px-7 py-8 font-['Alumni_Sans',sans-serif] bg-white/30">
            <form 
              className="relative mb-6 border-b border-black/20 pb-3"
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
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-base text-[#1A1A1A] placeholder-gray-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-0 text-base font-semibold tracking-wider uppercase text-[#1A1A1A] hover:text-[#E5348A] transition-colors"
              >
                Subscribe
              </button>
            </form>

            <p className="mb-6 text-xs leading-relaxed text-gray-500 font-sans">
              By providing your email address, you agree to our{" "}
              <Link to="/privacy-policy" className="underline hover:text-black">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="space-y-3 text-base md:text-lg font-medium tracking-wide text-[#1A1A1A]">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block hover:text-[#E5348A] transition-colors"
              >
                Instagram
              </a>
            </div>

            <div className="mt-8 text-base font-medium text-[#1A1A1A]">
              <label className="flex items-center gap-3">
                <span>Currency</span>
                <select aria-label="Choose currency" defaultValue="GBP" className="rounded-full border border-black/15 bg-white/60 px-3 py-1.5 text-sm">
                  <option value="GBP">GBP £</option>
                  <option value="USD">USD $</option>
                  <option value="NGN">Naira ₦</option>
                </select>
              </label>
            </div>

            <div className="mt-6 text-xs text-gray-500 font-sans">
              © 2026 Selah Girl Society
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
