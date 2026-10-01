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
  { label: "ALL PIECES", to: "/shop" },
  { label: "828", to: "/category/828" },
  { label: "ASK ME ABOUT JESUS", to: "/category/ask-me-about-jesus" },
  { label: "BABE, I LOVE JESUS", to: "/category/babe-i-love-jesus" },
  { label: "PRETTY AND PRAYED UP", to: "/category/pretty-and-prayed-up" },
  { label: "SELAH GIRL SOCIETY", to: "/category/selah-girl-society" },
];

export function SidebarNav({ isOpen, onClose }: SidebarNavProps) {
  const [activeTab, setActiveTab] = useState<"SHOP" | "EXPLORE">("SHOP");
  const [email, setEmail] = useState("");

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 flex h-full w-full flex-col bg-[#1A1A1A] text-white transition-transform duration-300 ease-in-out sm:w-[400px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Tabs - fixed height, never shrinks */}
        <div className="flex h-14 shrink-0 items-center border-b border-[#333333] md:h-24">
          <button
            onClick={() => setActiveTab("SHOP")}
            className={cn(
              "flex h-full flex-1 items-center justify-center text-[11px] font-bold uppercase tracking-[0.2em] transition-colors",
              activeTab === "SHOP" ? "bg-[#1A1A1A] text-white" : "bg-[#2A2A2A] text-[#777777]"
            )}
          >
            SHOP
          </button>
          <button
            onClick={() => setActiveTab("EXPLORE")}
            className={cn(
              "flex h-full flex-1 items-center justify-center text-[11px] font-bold uppercase tracking-[0.2em] transition-colors",
              activeTab === "EXPLORE" ? "bg-[#1A1A1A] text-white" : "bg-[#2A2A2A] text-[#777777]"
            )}
          >
            EXPLORE
          </button>
          <button
            onClick={onClose}
            className="flex h-full w-14 items-center justify-center bg-[#2A2A2A] text-[#777777] hover:text-white md:w-24"
            aria-label="Close menu"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content area - ALL content scrolls together */}
        <div className="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="px-8 py-10">
            {activeTab === "SHOP" && (
              <div className="space-y-6">
                {shopLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#E5E5E5] transition-colors hover:text-white"
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
                    className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#E5E5E5] transition-colors hover:text-white"
                  >
                    ABOUT US
                  </Link>
                </div>
                <div>
                  <Link
                    to="/pakistan-journey"
                    onClick={onClose}
                    className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#E5E5E5] transition-colors hover:text-white"
                  >
                    PAKISTAN JOURNEY
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Subscribe + Footer - INSIDE scrollable area */}
          <div className="border-t border-[#4F4F4F] px-7 py-8">
            <form 
              className="relative mb-6 border-b border-[#888888] pb-3"
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
                className="w-full bg-transparent text-[13px] text-white placeholder-gray-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-0 text-[13px] font-semibold tracking-wide text-white"
              >
                Subscribe
              </button>
            </form>

            <p className="mb-6 text-[11px] leading-relaxed text-gray-500">
              By providing your email address, you agree to our{" "}
              <Link to="/" className="underline hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="space-y-3 text-[13px] font-medium tracking-wide text-white">
              <Link to="/" onClick={onClose} className="block hover:text-gray-300">Client Services</Link>
              <Link to="/" onClick={onClose} className="block hover:text-gray-300">Legal & Privacy</Link>
              <Link to="/" onClick={onClose} className="block hover:text-gray-300">Careers</Link>
              <Link to="/" onClick={onClose} className="block hover:text-gray-300">Instagram</Link>
              <Link to="/" onClick={onClose} className="block hover:text-gray-300">Guarantee of Conformity</Link>
              <Link to="/" onClick={onClose} className="block hover:text-gray-300">Accessibility</Link>
            </div>

            <div className="mt-8 text-[13px] font-medium text-white">
              <button className="flex items-center hover:text-gray-300">
                Shipping To: GB / £ GBP
              </button>
            </div>

            <div className="mt-6 text-[11px] text-gray-500">
              © 2026 Selah Girl Society
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
