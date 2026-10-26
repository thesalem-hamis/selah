import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productService } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import { formatProductPrice, is828Product } from "@/lib/format";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import "@/styles/product.css";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
});

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E5E5E5]">
      <button
        type="button"
        className="w-full py-5 flex justify-between items-center text-[13px] text-[#1A1A1A] hover:text-[#777777] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            isOpen && "rotate-180",
          )}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <div className="pb-5 text-[13px] text-[#444444] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.bySlug(slug),
  });

  const product = productQuery.data;
  const { currency } = useCurrency();
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const colors = (product?.colors ?? []).filter(
    (color): color is NonNullable<typeof color> =>
      Boolean(color && typeof color.name === "string" && color.name.trim()),
  );

  const handleAddToCart = () => {
    if (!product) return;

    const availableSizes = product.sizes ?? [];
    const availableColors = colors;

    const size = selectedSize || availableSizes[0] || "";
    const color =
      selectedColor ||
      availableColors[0]?.name ||
      "Default";

    add(product, {
      size,
      color,
      quantity: 1,
    });
  };

  if (productQuery.isLoading) {
    return (
      <StoreLayout>
        <div className="container-page py-32 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A1A] border-r-transparent" />
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="container-page py-32 text-center">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">
            Piece unavailable
          </p>

          <h1
            className="mb-8 text-4xl text-[#1A1A1A] md:text-5xl"
            style={{
              fontFamily: "var(--font-selah)",
              fontWeight: 300,
            }}
          >
            We couldn't find that piece.
          </h1>

          <Link
            to="/shop"
            className="selah-button inline-flex h-14 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
          >
            Browse the collection
          </Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container-page py-12 md:py-20">
        <Link
          to="/shop"
          className="left-6 top-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] transition-colors hover:text-[#1A1A1A] lg:left-12 lg:top-12"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
          BACK TO SHOP
        </Link>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column - Product Info & Accordion */}
          <div className="lg:col-span-3 order-2 lg:order-1 space-y-12 pt-4">
            <div>
              <h1 className="text-[13px] text-[#1A1A1A] mb-1">
                {product.name}
              </h1>

              <p className="text-[13px] text-[#1A1A1A]">
                {formatProductPrice(product, currency)}
              </p>
            </div>

            <div className="border-t border-[#E5E5E5]">
              <AccordionItem title="Product Details" defaultOpen>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 block mt-1.5 h-[3px] w-[3px] bg-[#1A1A1A]" />
                      {detail}
                    </li>
                  ))}

                  {product.details.length === 0 && (
                    <li className="flex items-start">
                      {product.description}
                    </li>
                  )}
                </ul>
              </AccordionItem>

              <AccordionItem title="Sizing">
                <p>
                  True to size. We recommend sizing up for a more relaxed fit.
                </p>
              </AccordionItem>

              <AccordionItem title="Delivery and Returns">
                <p>
                  Complimentary standard shipping on all orders. Returns are
                  accepted within 30 days of delivery.
                </p>
              </AccordionItem>
            </div>
          </div>

          {/* Center Column - Main Image */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-4">
            <div
              className={`product-detail__image w-full relative flex items-center justify-center overflow-hidden aspect-[4/5] group ${
                is828Product(product)
                  ? "bg-[#f1ece3]"
                  : "bg-[#f7f5f2]"
              }`}
            >
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="h-full w-full object-contain mix-blend-multiply transition-opacity duration-300"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0
                          ? product.images.length - 1
                          : prev - 1,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5" strokeWidth={1.5} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === product.images.length - 1
                          ? 0
                          : prev + 1,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5" strokeWidth={1.5} />
                  </button>

                  <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {product.images.map((_, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        aria-label={`View image ${index + 1}`}
                        className={cn(
                          "block size-1.5 rounded-full transition-colors",
                          index === activeImageIndex
                            ? "bg-[#1A1A1A]"
                            : "bg-[#1A1A1A]/30",
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Color, Size & Add to Bag */}
          <div className="lg:col-span-3 order-3 lg:order-3 pt-4">
            <div className="space-y-6">
              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="border border-[#E5E5E5] relative h-12">
                  <select
                    className="w-full h-full px-4 appearance-none text-[12px] text-[#1A1A1A] bg-transparent outline-none cursor-pointer"
                    value={selectedColor || colors[0]?.name || ""}
                    onChange={(event) =>
                      setSelectedColor(event.target.value)
                    }
                    aria-label="Select product color"
                  >
                    {colors.map((color) => (
                      <option key={color.name} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>

                  <div className="absolute right-4 top-0 h-full flex items-center pointer-events-none text-[#1A1A1A]">
                    <ChevronDown className="size-4" strokeWidth={1.5} />
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="border border-[#E5E5E5] relative h-12">
                  <select
                    className="w-full h-full px-4 appearance-none text-[12px] text-[#1A1A1A] bg-transparent outline-none cursor-pointer"
                    value={selectedSize || product.sizes[0] || ""}
                    onChange={(event) =>
                      setSelectedSize(event.target.value)
                    }
                    aria-label="Select product size"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>

                  <div className="absolute right-4 top-0 h-full flex items-center pointer-events-none text-[#1A1A1A]">
                    <ChevronDown className="size-4" strokeWidth={1.5} />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                className="selah-button w-full h-12 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-black/80"
              >
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <Related product={product} />
      </div>
    </StoreLayout>
  );
}

function Related({ product }: { product: Product }) {
  const query = useQuery({
    queryKey: ["related", product.id],
    queryFn: () => productService.related(product),
  });

  return (
    <div className="mt-32 border-t border-[#E5E5E5] pt-20">
      <div className="mb-12 flex items-end justify-between">
        <h2
          className="text-3xl text-[#1A1A1A] md:text-4xl"
          style={{
            fontFamily: "var(--font-selah)",
            fontWeight: 300,
          }}
        >
          You May Also Like
        </h2>

        <Link
          to="/shop"
          className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:opacity-60 transition-opacity md:flex"
        >
          VIEW ALL
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>

      <ProductGrid products={query.data ?? []} columns={4} />
    </div>
  );
}
