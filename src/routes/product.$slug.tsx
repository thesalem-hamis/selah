import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Star,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Rating } from "@/components/product/Rating";
import { productService } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { Product, Review } from "@/types";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";

export const Route = createFileRoute("/product/$slug")({ 
  component: ProductPage 
});

function ProductPage() {
  const { slug } = Route.useParams();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Review state
  const [hoveredStar, setHoveredStar] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const queryClient = useQueryClient();

  const productQuery = useQuery({ 
    queryKey: ["product", slug], 
    queryFn: () => productService.bySlug(slug) 
  });

  const product = productQuery.data;
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const reviewsQuery = useQuery({
    queryKey: ["reviews", product?.id],
    queryFn: () => product && productService.reviews(product.id),
    enabled: Boolean(product),
  });

  const reviews = reviewsQuery.data ?? [];

  const addReviewMutation = useMutation({
    mutationFn: (payload: { author: string; rating: number; title: string; body: string }) =>
      product ? productService.addReview(product.id, payload) : Promise.reject("No product"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      queryClient.invalidateQueries({ queryKey: ["reviews", product?.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setReviewSuccess(true);
      setRating(0);
      setReviewTitle("");
      setReviewBody("");
      setReviewAuthor("");
      setTimeout(() => setReviewSuccess(false), 3000);
    },
    onError: (err: Error) => {
      setReviewError(err.message);
    },
  });

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);

    if (rating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }
    if (!reviewTitle.trim()) {
      setReviewError("Please enter a review title.");
      return;
    }
    if (!reviewBody.trim()) {
      setReviewError("Please enter a review body.");
      return;
    }
    if (!reviewAuthor.trim()) {
      setReviewError("Please enter your name.");
      return;
    }

    setIsSubmittingReview(true);
    addReviewMutation.mutate(
      {
        author: reviewAuthor.trim(),
        rating,
        title: reviewTitle.trim(),
        body: reviewBody.trim(),
      },
      {
        onSettled: () => setIsSubmittingReview(false),
      }
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    add(product, {
      size: selectedSize || product.sizes[0],
      color: selectedColor || product.colors[0]?.name,
      quantity,
    });
  };

  if (!product) {
    return (
      <StoreLayout>
        <div className="container-page py-32 text-center">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">
            Piece unavailable
          </p>
          <h1
            className="mb-8 text-4xl text-[#1A1A1A] md:text-5xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            We couldn't find that piece.
          </h1>
          <Link
            to="/shop"
            className="inline-flex h-14 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
          >
            Browse the collection
          </Link>
        </div>
      </StoreLayout>
    );
  }

  const isWishlisted = has(product.id);

  return (
    <StoreLayout>
      <div className="container-page py-12 md:py-20">
        {/* Breadcrumb */}
        <div className="mb-12 flex items-center justify-between">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] transition-colors hover:text-[#1A1A1A]"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} />
            BACK TO SHOP
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div 
              className="relative cursor-zoom-in bg-[#f4f4f4]"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <div className="overflow-hidden">
                <img 
                  key={activeImageIndex}
                  src={product.images[activeImageIndex]} 
                  alt={`${product.name} - View ${activeImageIndex + 1}`} 
                  className={cn(
                    "aspect-[3/4] w-full object-cover transition-transform duration-500 ease-out",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                  style={{ transformOrigin: isZoomed ? '50% 50%' : 'center' }}
                />
              </div>
              
              {product.price < 100 && (
                <div className="absolute left-6 top-6 bg-[#FFC0CB] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "relative h-32 w-24 shrink-0 overflow-hidden bg-[#f4f4f4] transition-all",
                    activeImageIndex === index ? "ring-1 ring-[#1A1A1A] ring-offset-2" : "opacity-70 hover:opacity-100"
                  )}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">
              {product.subcategory}
            </p>
            <h1
              className="text-4xl text-[#1A1A1A] md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300, lineHeight: 1.1 }}
            >
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-6">
              <span className="text-xl font-medium tracking-wide text-[#1A1A1A]">
                {formatPrice(product.price)}
              </span>
              {product.price < 100 && product.oldPrice && (
                <span className="text-[14px] text-[#777777] line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <p className="mt-8 text-[14px] leading-relaxed text-[#444444]">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                  <span>COLOR</span>
                  <span className="text-[#777777]">{selectedColor || product.colors[0].name}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "size-10 border transition-all",
                        selectedColor === color.name 
                          ? "border-[#1A1A1A] p-1" 
                          : "border-transparent p-0 hover:border-[#E5E5E5]"
                      )}
                      title={color.name}
                    >
                      <span 
                        className="block h-full w-full border border-[#E5E5E5]"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                  <span>SIZE</span>
                  <button className="text-[#777777] hover:text-[#1A1A1A] underline decoration-[#E5E5E5] underline-offset-4 transition-colors">
                    SIZE GUIDE
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "flex h-12 items-center justify-center border text-[13px] font-medium transition-colors",
                        selectedSize === size
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-[#E5E5E5] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-10">
              <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                QUANTITY
              </span>
              <div className="flex h-12 w-32 items-center border border-[#E5E5E5]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-full w-10 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#f4f4f4]"
                >
                  <Minus className="size-3" strokeWidth={1.5} />
                </button>
                <span className="flex-1 text-center text-[13px] font-medium text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-full w-10 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#f4f4f4]"
                >
                  <Plus className="size-3" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex h-14 flex-1 items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
              >
                ADD TO BAG — {formatPrice(product.price * quantity)}
              </button>
              <button
                onClick={() => toggle(product.id, product.name)}
                className="flex h-14 w-14 items-center justify-center border border-[#1A1A1A] bg-transparent text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
                aria-label="Wishlist"
              >
                <Heart 
                  className={cn("size-5", isWishlisted && "fill-current")} 
                  strokeWidth={1.5} 
                />
              </button>
            </div>

            {/* Details Accordion */}
            <div className="mt-16 border-t border-[#E5E5E5]">
              <div className="py-6 border-b border-[#E5E5E5]">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
                  PRODUCT DETAILS
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="text-[13px] text-[#444444] flex items-start">
                      <span className="mr-3 block mt-1.5 h-[3px] w-[3px] bg-[#1A1A1A]" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="py-6 border-b border-[#E5E5E5]">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
                  SHIPPING & RETURNS
                </h3>
                <p className="text-[13px] text-[#444444] leading-relaxed">
                  Complimentary standard shipping on all orders. Returns are accepted within 30 days of delivery.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 border-t border-[#E5E5E5] pt-20">
          <div className="mb-12">
            <h2
              className="text-3xl text-[#1A1A1A] md:text-4xl"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
            >
              Customer Reviews
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-5">
              <div className="border border-[#E5E5E5] p-8">
                <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  WRITE A REVIEW
                </h3>
                
                {reviewSuccess && (
                  <div className="mb-6 border border-[#1A1A1A] p-4 text-[13px] font-medium text-[#1A1A1A]">
                    Your review was submitted successfully!
                  </div>
                )}
                {reviewError && (
                  <div className="mb-6 border border-red-500 bg-red-50 p-4 text-[13px] text-red-800">
                    {reviewError}
                  </div>
                )}
                
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                      RATING
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={cn(
                              "size-5",
                              star <= (hoveredStar || rating) ? "fill-[#1A1A1A] text-[#1A1A1A]" : "fill-transparent text-[#E5E5E5]",
                            )}
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                      NAME
                    </label>
                    <input
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="h-12 w-full border border-[#E5E5E5] bg-transparent px-4 text-[13px] outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                      TITLE
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="h-12 w-full border border-[#E5E5E5] bg-transparent px-4 text-[13px] outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                      REVIEW
                    </label>
                    <textarea
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      rows={4}
                      className="w-full border border-[#E5E5E5] bg-transparent p-4 text-[13px] outline-none focus:border-[#1A1A1A] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex h-12 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                  >
                    {isSubmittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
                  </button>
                </form>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-7 lg:pl-12">
              {reviews.length > 0 ? (
                <div className="space-y-10">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-[#E5E5E5] pb-8">
                      <div className="mb-4 flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "size-3",
                              star <= review.rating ? "fill-[#1A1A1A] text-[#1A1A1A]" : "fill-transparent text-[#E5E5E5]",
                            )}
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                      <h4 className="mb-2 text-[14px] font-bold text-[#1A1A1A]">{review.title}</h4>
                      <p className="mb-4 text-[13px] leading-relaxed text-[#444444]">{review.body}</p>
                      <div className="text-[11px] text-[#777777]">
                        <span className="font-bold text-[#1A1A1A]">{review.author}</span> — {review.date}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                  <p className="text-[13px] text-[#777777]">No reviews yet. Be the first to review this product.</p>
                </div>
              )}
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
    queryFn: () => productService.related(product) 
  });

  return (
    <div className="mt-32 border-t border-[#E5E5E5] pt-20">
      <div className="mb-12 flex items-end justify-between">
        <h2
          className="text-3xl text-[#1A1A1A] md:text-4xl"
          style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
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