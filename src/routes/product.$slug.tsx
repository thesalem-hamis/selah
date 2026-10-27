import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronRight, ChevronLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";

import { productService } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import { formatProductPrice, formatPrice, productPriceNgn, is828Product } from "@/lib/format";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import "@/styles/product.css";

export const Route = createFileRoute("/product/$slug")({
  component: ProductRoute,
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
    <div className="product-detail__accordion">
      <button
        className="w-full py-6 flex justify-between items-center gap-4 text-left text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-[#e5348a]"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? (
          <Minus className="size-4 shrink-0" strokeWidth={1.5} />
        ) : (
          <Plus className="size-4 shrink-0" strokeWidth={1.5} />
        )}
      </button>
      {isOpen && <div className="pb-5 text-[13px] text-[#444444] leading-relaxed">{children}</div>}
    </div>
  );
}

function ProductRoute() {
  const { slug } = Route.useParams();
  return <ProductPage key={slug} />;
}

function ProductPage() {
  const { slug } = Route.useParams();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.bySlug(slug),
  });

  const product = productQuery.data;
  console.log(product);
  const { currency } = useCurrency();
  const { add } = useCart();

  const colors = (product?.colors ?? []).filter(
    (color): color is NonNullable<typeof color> =>
      Boolean(color && typeof color.name === "string" && color.name.trim()),
  );

  const handleAddToCart = () => {
    if (
      !product ||
      product.stock <= 0 ||
      (product.sizes.length > 0 && !product.sizes.includes(selectedSize))
    )
      return;
    add(product, {
      size: selectedSize || (product.sizes && product.sizes[0]) || "",
      color: product.colors[0]?.name ?? "Default",
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
            style={{ fontFamily: "var(--font-selah)", fontWeight: 500 }}
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
      <div className="product-page" key={product.id}>
        <Link to="/shop" className="product-detail__back product-detail__back--mobile">
          <ArrowLeft className="size-4" strokeWidth={1.5} /> BACK TO SHOP
        </Link>
        <div className="product-detail">
          <aside className="product-detail__story">
            <Link to="/shop" className="product-detail__back product-detail__back--desktop">
              <ArrowLeft className="size-4" strokeWidth={1.5} /> BACK TO SHOP
            </Link>
            <div className="product-detail__description">
              <p className="product-detail__eyebrow">{product.category}</p>
              <p className="product-detail__intro">{product.description}</p>
              {product.details.length > 0 && (
                <ul className="product-detail__features">
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="product-detail__accordions">
              <AccordionItem title="Sizing">
                <p>True to size. We recommend sizing up for a more relaxed fit.</p>
              </AccordionItem>

              <AccordionItem title="Delivery and Returns">
                <p>
                  Complimentary standard shipping on all orders. Returns are accepted within 30 days
                  of delivery.
                </p>
              </AccordionItem>
            </div>
          </aside>

          {/* Center Column - Main Image */}
          <div className="product-detail__gallery">
            <div
              className={`product-detail__image w-full relative flex items-center justify-center overflow-hidden aspect-[4/5] group ${is828Product(product) ? "bg-[#f1ece3]" : "bg-[#f7f5f2]"}`}
            >
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="h-full w-full object-contain mix-blend-multiply transition-opacity duration-300"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5" strokeWidth={1.5} />
                  </button>

                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5" strokeWidth={1.5} />
                  </button>

                  {/* Indicator dots */}
                  <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {product.images.map((_, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        aria-label={`View image ${index + 1}`}
                        className={cn(
                          "block size-1.5 rounded-full transition-colors",
                          index === activeImageIndex ? "bg-[#1A1A1A]" : "bg-[#1A1A1A]/30",
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <section className="product-detail__purchase" aria-label="Product options">
            <div>
              <h1>{product.name}</h1>
              <p className="product-detail__eyebrow">{product.subcategory || product.category}</p>
            </div>
            <div className="product-detail__pricing">
              <div className="product-detail__prices">
                <span className="product-detail__price">
                  {formatProductPrice(product, currency)}
                </span>
                {/* {currency !== "ESPEES" && (
                  <span className="product-detail__conversion">
                    ≈ {formatProductPrice(product, "ESPEES")}
                  </span>
                )} */}
                {product.oldPrice && product.oldPrice > productPriceNgn(product) ? (
                  <del>{formatPrice(product.oldPrice, currency)}</del>
                ) : null}
              </div>
            </div>
            {product.sizes.length > 0 && (
              <div>
                <div className="product-detail__size-heading">
                  <span>Select size</span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                    aria-expanded={sizeGuideOpen}
                  >
                    Sizing
                  </button>
                </div>
                <div className="product-detail__sizes" role="group" aria-label="Select size">
                  {product.sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      aria-pressed={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(selectedSize === size && "is-selected")}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeGuideOpen && (
                  <p className="product-detail__fit-note">
                    True to size. We recommend sizing up for a more relaxed fit.
                  </p>
                )}
              </div>
            )}
            <button
              onClick={handleAddToCart}
              disabled={
                product.stock <= 0 ||
                (product.sizes.length > 0 && !product.sizes.includes(selectedSize))
              }
              className="selah-button product-detail__add"
            >
              ADD TO BAG
            </button>
          </section>
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
    <section className="product-related">
      <div className="product-related__heading">
        <div>
          <h2
            className="product-related__title"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 500 }}
          >
            You May Also Like
          </h2>
        </div>
        <Link
          to="/shop"
          className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:opacity-60 transition-opacity md:flex"
        >
          VIEW ALL
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>
      <div className="product-related__grid">
        {(query.data ?? []).slice(0, 4).map((item) => (
          <RelatedCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const { currency } = useCurrency();
  const { add } = useCart();
  return (
    <article className="product-related__card">
      <div className="product-related__image">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        </Link>
        {product.stock > 0 && (
          <div className="product-related__quick">
            <span>Quick add</span>
            {(product.sizes.length ? product.sizes : ["One Size"]).map((size) => (
              <button
                key={size}
                type="button"
                aria-label={`Add ${product.name}, size ${size} to bag`}
                onClick={() =>
                  add(product, { size, color: product.colors[0]?.name ?? "Default", quantity: 1 })
                }
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="product-related__caption">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          {product.name}
        </Link>
        <span>{formatProductPrice(product, currency)}</span>
        <p>{product.subcategory || product.category}</p>
        {product.oldPrice && product.oldPrice > productPriceNgn(product) ? (
          <del>{formatPrice(product.oldPrice, currency)}</del>
        ) : null}
      </div>
    </article>
  );
}
