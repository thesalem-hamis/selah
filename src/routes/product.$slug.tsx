import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Star,
  Truck,
  RefreshCw,
  Shield,
  ChevronRight,
  Sparkles,
  Minus,
  Plus,
  ZoomIn,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Rating } from "@/components/product/Rating";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { Product, Review } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({ 
  component: ProductPage 
});

function ProductPage() {
  const { slug } = Route.useParams();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
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

    addReviewMutation.mutate({
      author: reviewAuthor.trim(),
      rating,
      title: reviewTitle.trim(),
      body: reviewBody.trim(),
    });
  };

  const handleAddToCart = (product: Product) => {
    for (let i = 0; i < quantity; i++) {
      add(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) {
    return (
      <StoreLayout>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-page py-24 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-muted"
          >
            <ShoppingBag className="size-10 text-muted-foreground" />
          </motion.div>
          <p className="eyebrow text-muted-foreground">Piece unavailable</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            We couldn't find that piece.
          </h1>
          <p className="mt-4 text-muted-foreground">
            The item you're looking for might have been moved or doesn't exist.
          </p>
          <Button asChild className="mt-8">
            <Link to="/shop">Browse the collection</Link>
          </Button>
        </motion.div>
      </StoreLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <StoreLayout>
      <div className="container-page py-8 md:py-14">
        {/* Breadcrumb & Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link 
            to="/shop" 
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to shop
          </Link>
          
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-12 lg:grid-cols-2 lg:gap-16"
        >
          {/* Image Gallery */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="relative">
              <div 
                className="relative overflow-hidden rounded-2xl bg-muted cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <motion.img 
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={product.images[activeImageIndex]} 
                  alt={`${product.name} - View ${activeImageIndex + 1}`} 
                  className="aspect-[4/5] w-full object-cover"
                  style={{ 
                    transformOrigin: isZoomed ? '50% 50%' : 'center',
                    cursor: isZoomed ? 'zoom-out' : 'zoom-in'
                  }}
                />
                
                {/* Zoom indicator */}
                <div className="absolute bottom-4 right-4 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs text-white flex items-center gap-1.5">
                  <ZoomIn className="size-3" />
                  Hover to zoom
                </div>

                {/* Sale badge */}
                {product.price < 100 && (
                  <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    Sale
                  </div>
                )}
              </div>

              {/* Thumbnail navigation */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={image}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      "relative overflow-hidden rounded-lg border-2 transition-all",
                      activeImageIndex === index 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="size-14 object-cover"
                    />
                    {activeImageIndex === index && (
                      <div className="absolute inset-0 bg-primary/10" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Image carousel indicators */}
            <div className="flex justify-center gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    activeImageIndex === index 
                      ? 'w-10 bg-gradient-to-r from-primary to-primary/60' 
                      : 'w-4 bg-muted-foreground/20 hover:bg-muted-foreground/40'
                  )}
                />
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div variants={itemVariants} className="lg:py-4">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3" />
                {product.subcategory}
              </span>
              {product.rating >= 4.5 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Star className="size-3 fill-current" />
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
              {product.name}
            </h1>

            {/* Price & Rating */}
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                {product.price < 100 && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price * 1.5)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Rating value={product.rating} count={product.reviewsCount} />
              </div>
            </div>

            {/* Description */}
            <p className="mt-8 max-w-lg leading-7 text-muted-foreground">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mt-8 rounded-xl border border-border/50 bg-muted/30 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Select Colour</p>
                <span className="text-xs text-muted-foreground">
                  {selectedColor || 'Choose an option'}
                </span>
              </div>
              <div className="mt-4 flex gap-3">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.name}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color.name)}
                    className="group relative"
                    title={color.name}
                  >
                    <span 
                      className={cn(
                        "block size-10 rounded-full border-2 transition-all cursor-pointer",
                        selectedColor === color.name 
                          ? 'border-primary ring-4 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                    {selectedColor === color.name && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="size-4 text-white drop-shadow-lg" />
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{selectedColor}</span>
                </p>
              )}
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Select Size</p>
                <button className="text-xs font-medium text-primary hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "py-3 text-sm font-medium rounded-lg border transition-all",
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-4">
              <p className="text-sm font-semibold">Quantity</p>
              <div className="flex items-center rounded-lg border border-border">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-muted transition-colors"
                >
                  <Minus className="size-4" />
                </motion.button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-muted transition-colors"
                >
                  <Plus className="size-4" />
                </motion.button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="group h-14 min-w-0 w-full flex-1 justify-between rounded-2xl bg-primary px-4 text-sm shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 active:translate-y-0 active:scale-[0.99] sm:px-5"
                  onClick={() => handleAddToCart(product)}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex min-w-0 items-center gap-2"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                          <Check className="size-4" />
                        </span>
                        <span className="truncate">Added to Bag</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="bag"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex min-w-0 items-center gap-2"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/15 transition-transform group-hover:rotate-[-8deg]">
                          <ShoppingBag className="size-4" />
                        </span>
                        <span className="truncate">Add to bag</span>
                        <span className="ml-auto shrink-0 text-xs font-semibold text-primary-foreground/75">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      "aspect-square transition-all hover:scale-105 active:scale-95",
                      isWishlisted && "border-red-500 bg-red-50 dark:bg-red-950/20"
                    )}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <motion.div
                      animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart 
                        className={cn(
                          "size-5 transition-colors",
                          isWishlisted ? 'fill-red-500 text-red-500' : ''
                        )} 
                      />
                    </motion.div>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="aspect-square transition-all hover:scale-105 active:scale-95"
                  >
                    <Share2 className="size-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Details & Perks */}
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: 'Free Shipping', sublabel: 'On orders over $50' },
                  { icon: RefreshCw, label: '30 Day Returns', sublabel: 'Easy returns' },
                  { icon: Shield, label: 'Secure Checkout', sublabel: '256-bit SSL' }
                ].map(({ icon: Icon, label, sublabel }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-4 text-center bg-gradient-to-b from-muted/50 to-transparent transition-all hover:shadow-md"
                  >
                    <Icon className="size-5 text-primary" />
                    <span className="text-xs font-semibold">{label}</span>
                    <span className="text-[10px] text-muted-foreground">{sublabel}</span>
                  </motion.div>
                ))}
              </div>

              {/* Product Details List */}
              <div className="rounded-xl border border-border/50 p-5 bg-muted/30">
                <h3 className="text-sm font-semibold mb-4">Product Details</h3>
                <ul className="space-y-3">
                  {product.details.map((detail, index) => (
                    <motion.li 
                      key={detail}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      className="flex items-start gap-3 text-sm text-muted-foreground group"
                    >
                      <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="group-hover:text-foreground transition-colors">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Reviews Section */}
        <ReviewSection
          product={product}
          reviews={reviews}
          rating={rating}
          hoveredStar={hoveredStar}
          reviewTitle={reviewTitle}
          reviewBody={reviewBody}
          reviewAuthor={reviewAuthor}
          isSubmittingReview={isSubmittingReview || addReviewMutation.isPending}
          reviewError={reviewError}
          reviewSuccess={reviewSuccess}
          setRating={setRating}
          setHoveredStar={setHoveredStar}
          setReviewTitle={setReviewTitle}
          setReviewBody={setReviewBody}
          setReviewAuthor={setReviewAuthor}
          handleSubmitReview={handleSubmitReview}
        />

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
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-20 border-t border-border pt-12"
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="eyebrow text-primary flex items-center gap-2">
            <Sparkles className="size-4" />
            Complete the edit
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">You may also like</h2>
        </div>
        <Link 
          to="/shop" 
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary group"
        >
          View all 
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="mt-4">
        <ProductGrid products={query.data ?? []} />
      </div>
    </motion.section>
  );
}

function ReviewSection({
  product,
  reviews,
  rating,
  hoveredStar,
  reviewTitle,
  reviewBody,
  reviewAuthor,
  isSubmittingReview,
  reviewError,
  reviewSuccess,
  setRating,
  setHoveredStar,
  setReviewTitle,
  setReviewBody,
  setReviewAuthor,
  handleSubmitReview,
}: {
  product: Product | undefined;
  reviews: Review[];
  rating: number;
  hoveredStar: number;
  reviewTitle: string;
  reviewBody: string;
  reviewAuthor: string;
  isSubmittingReview: boolean;
  reviewError: string | null;
  reviewSuccess: boolean;
  setRating: (v: number) => void;
  setHoveredStar: (v: number) => void;
  setReviewTitle: (v: string) => void;
  setReviewBody: (v: string) => void;
  setReviewAuthor: (v: string) => void;
  handleSubmitReview: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 border-t border-border pt-12"
      id="reviews"
    >
      <div className="mb-8">
        <h2 className="font-display text-3xl md:text-4xl">Customer reviews</h2>
        {product && (
          <div className="mt-3 flex items-center gap-4">
            <Rating value={product.rating} count={product.reviewsCount} size="md" />
          </div>
        )}
      </div>

      {/* Write a Review */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-border bg-muted/20 p-6 mb-8"
      >
        <h3 className="font-display text-xl mb-4">Write a review</h3>
        {reviewSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3 text-emerald-800 dark:text-emerald-400 text-sm"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            Your review was submitted successfully!
          </motion.div>
        )}
        {reviewError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-red-800 dark:text-red-400 text-sm"
          >
            <AlertCircle className="size-4 shrink-0" />
            {reviewError}
          </motion.div>
        )}
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "size-5 transition-colors",
                      star <= (hoveredStar || rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={reviewAuthor}
              onChange={(e) => setReviewAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Review title"
              className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Review</label>
            <textarea
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="Tell us what you think..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmittingReview}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all"
          >
            {isSubmittingReview ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit review
                <Send className="size-4" />
              </>
            )}
          </Button>
        </form>
      </motion.div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-border pb-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.author}</span>
                  <div className="flex items-center gap-1">
                    <Rating value={review.rating} />
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <h4 className="font-medium">{review.title}</h4>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="size-12 mx-auto mb-4 opacity-20" />
          <p>No reviews yet. Be the first to review this product.</p>
        </div>
      )}
    </motion.section>
  );
}