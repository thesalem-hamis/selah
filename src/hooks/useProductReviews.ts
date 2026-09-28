import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";

export function useProductReviews(productIds: string[]) {
  return useQuery({
    queryKey: ["reviews", productIds],
    queryFn: async () => {
      if (productIds.length === 0) return {};
      const reviews = await Promise.all(
        productIds.map(async (id) => {
          const productReviews = await productService.reviews(id);
          return { productId: id, reviews: productReviews };
        })
      );
      return Object.fromEntries(reviews.map(({ productId, reviews }) => [productId, reviews]));
    },
    enabled: productIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductReviewSummary(productIds: string[]) {
  const { data: reviewsByProduct, ...rest } = useProductReviews(productIds);

  const summaries = reviewsByProduct
    ? Object.fromEntries(
        Object.entries(reviewsByProduct).map(([productId, reviews]) => [
          productId,
          {
            rating: reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0,
            reviewsCount: reviews.length,
          },
        ])
      )
    : {};

  return { data: summaries, ...rest };
}