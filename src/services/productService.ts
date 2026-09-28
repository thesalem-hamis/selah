import { supabase } from "@/lib/supabase";
import type { Product, ProductFilters, Review, SortKey, Testimonial } from "@/types";
import { ApiError } from "./http";

function sortKeyToSupabase(sort: SortKey) {
  switch (sort) {
    case "price-asc":
      return { column: "price", ascending: true };
    case "price-desc":
      return { column: "price", ascending: false };
    case "newest":
      return { column: "created_at", ascending: false };
    case "best-selling":
      return { column: "reviews_count", ascending: false };
    case "rating":
      return { column: "rating", ascending: false };
    default:
      return { column: "created_at", ascending: false };
  }
}

function mapSupabaseProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row["id"]),
    slug: String(row["slug"]),
    name: String(row["name"]),
    description: String(row["description"]),
    details: Array.isArray(row["details"]) ? (row["details"] as string[]) : [],
    category: String(row["category"]),
    subcategory: String(row["subcategory"] ?? ""),
    price: Number(row["price"]),
    oldPrice: row["old_price"] == null ? undefined : Number(row["old_price"]),
    sku: String(row["sku"]),
    stock: Number(row["stock"]),
    sizes: Array.isArray(row["sizes"]) ? (row["sizes"] as string[]) : [],
    colors: Array.isArray(row["colors"]) ? (row["colors"] as Product["colors"]) : [],
    images: Array.isArray(row["images"]) ? (row["images"] as string[]) : [],
    tags: Array.isArray(row["tags"]) ? (row["tags"] as string[]) : [],
    rating: Number(row["rating"]),
    reviewsCount: Number(row["reviews_count"]),
    featured: Boolean(row["featured"]),
    bestSeller: Boolean(row["best_seller"]),
    newArrival: Boolean(row["new_arrival"]),
    status: String(row["status"]) as Product["status"],
  };
}

export function applyFilters(list: Product[], filters: ProductFilters = {}) {
  const term = filters.search?.trim().toLowerCase();
  const filtered = list.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.sizes?.length && !filters.sizes.some((size) => product.sizes.includes(size)))
      return false;
    if (
      filters.colors?.length &&
      !filters.colors.some((color) => product.colors.some((c) => c.name === color))
    )
      return false;
    if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;
    if (filters.inStockOnly && product.stock === 0) return false;
    if (filters.minRating !== undefined && product.rating < filters.minRating) return false;
    if (filters.onSaleOnly && !product.oldPrice) return false;
    if (term) {
      const haystack = [
        product.name,
        product.category,
        product.subcategory,
        product.sku,
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
  const sort = filters.sort ?? "featured";
  const sorted = [...filtered];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    case "best-selling":
      return sorted.sort((a, b) => b.reviewsCount - a.reviewsCount);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export const productService = {
  async list(filters: ProductFilters = {}) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    let query = client.from("products").select("*");
    const sort = filters.sort ?? "featured";
    const { column, ascending } = sortKeyToSupabase(sort);
    query = query.order(column, { ascending });
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.inStockOnly) query = query.gt("stock", 0);
    if (filters.onSaleOnly) query = query.not("old_price", "is", null);
    if (filters.minRating !== undefined) query = query.gte("rating", filters.minRating);
    if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
    if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`,
      );
    }
    const { data, error } = await query;
    if (error) throw new ApiError(error.message, 400);
    const products = (data ?? []).map(mapSupabaseProduct);
    return applyFilters(products, filters);
  },

  async bySlug(slug: string) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new ApiError(error.message, 400);
    if (!data) throw new ApiError("Product not found", 404);
    return mapSupabaseProduct(data);
  },

  async byId(id: string) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw new ApiError(error.message, 400);
    if (!data) throw new ApiError("Product not found", 404);
    return mapSupabaseProduct(data);
  },

  async featured() {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });
    if (error) throw new ApiError(error.message, 400);
    return (data ?? []).map(mapSupabaseProduct);
  },

  async newArrivals() {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("new_arrival", true)
      .order("created_at", { ascending: false });
    if (error) throw new ApiError(error.message, 400);
    return (data ?? []).map(mapSupabaseProduct);
  },

  async bestSellers() {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("best_seller", true)
      .order("reviews_count", { ascending: false });
    if (error) throw new ApiError(error.message, 400);
    return (data ?? []).map(mapSupabaseProduct);
  },

  async related(product: Product) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", product.id)
      .limit(4);
    if (error) throw new ApiError(error.message, 400);
    return (data ?? []).map(mapSupabaseProduct);
  },

  async reviews(productId: string) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("date", { ascending: false });
    if (error) throw new ApiError(error.message, 400);
    return (data ?? []).map((row: Record<string, unknown>) => ({
      id: String(row["id"]),
      productId: String(row["product_id"]),
      author: String(row["author"]),
      rating: Number(row["rating"]),
      title: String(row["title"]),
      body: String(row["body"]),
      date: String(row["date"]),
    })) as Review[];
  },

  async addReview(
    productId: string,
    payload: { author: string; rating: number; title: string; body: string },
  ) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const review = {
      id: `rev-${Date.now()}`,
      product_id: productId,
      author: payload.author,
      rating: payload.rating,
      title: payload.title,
      body: payload.body,
      date: new Date().toISOString().split("T")[0],
    };
    const { data, error } = await client
      .from("reviews")
      .insert(review)
      .select("*")
      .single();
    if (error) throw new ApiError(error.message, 400);
    return {
      id: String(data["id"]),
      productId: String(data["product_id"]),
      author: String(data["author"]),
      rating: Number(data["rating"]),
      title: String(data["title"]),
      body: String(data["body"]),
      date: String(data["date"]),
    } as Review;
  },

  async testimonials() {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data, error } = await client
      .from("testimonials")
      .select("*")
      .order("rating", { ascending: false });
    if (error) throw new ApiError(error.message, 400);
    return (data ?? []).map((row: Record<string, unknown>) => ({
      id: String(row["id"]),
      name: String(row["name"]),
      location: String(row["location"]),
      rating: Number(row["rating"]),
      quote: String(row["quote"]),
    })) as Testimonial[];
  },

  async search(term: string) {
    const products = await this.list({ search: term });
    return products;
  },

  async create(input: Omit<Product, "id">) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const id = `prd-${Date.now()}`;
    
    // Explicitly map all fields to snake_case for Supabase
    const payload = {
      id,
      slug: input.slug,
      name: input.name,
      description: input.description,
      details: input.details,
      category: input.category,
      subcategory: input.subcategory,
      price: input.price,
      old_price: input.oldPrice ?? null,
      sku: input.sku,
      stock: input.stock,
      sizes: input.sizes,
      colors: input.colors,
      images: input.images,
      tags: input.tags,
      rating: input.rating,
      reviews_count: input.reviewsCount,
      featured: input.featured,
      best_seller: input.bestSeller,
      new_arrival: input.newArrival,
      status: input.status,
    };
    
    const { data, error } = await client.from("products").insert(payload).select("*").single();
    if (error) throw new ApiError(error.message, 400);
    return mapSupabaseProduct(data);
  },

  async update(id: string, patch: Partial<Product>) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    
    // Explicitly map all fields to snake_case for Supabase
    const payload: Record<string, unknown> = {};
    
    if (patch.slug !== undefined) payload["slug"] = patch.slug;
    if (patch.name !== undefined) payload["name"] = patch.name;
    if (patch.description !== undefined) payload["description"] = patch.description;
    if (patch.details !== undefined) payload["details"] = patch.details;
    if (patch.category !== undefined) payload["category"] = patch.category;
    if (patch.subcategory !== undefined) payload["subcategory"] = patch.subcategory;
    if (patch.price !== undefined) payload["price"] = patch.price;
    if (patch.oldPrice !== undefined) payload["old_price"] = patch.oldPrice;
    if (patch.sku !== undefined) payload["sku"] = patch.sku;
    if (patch.stock !== undefined) payload["stock"] = patch.stock;
    if (patch.sizes !== undefined) payload["sizes"] = patch.sizes;
    if (patch.colors !== undefined) payload["colors"] = patch.colors;
    if (patch.images !== undefined) payload["images"] = patch.images;
    if (patch.tags !== undefined) payload["tags"] = patch.tags;
    if (patch.rating !== undefined) payload["rating"] = patch.rating;
    if (patch.reviewsCount !== undefined) payload["reviews_count"] = patch.reviewsCount;
    if (patch.featured !== undefined) payload["featured"] = patch.featured;
    if (patch.bestSeller !== undefined) payload["best_seller"] = patch.bestSeller;
    if (patch.newArrival !== undefined) payload["new_arrival"] = patch.newArrival;
    if (patch.status !== undefined) payload["status"] = patch.status;
    
    const { data, error } = await client
      .from("products")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new ApiError(error.message, 400);
    return mapSupabaseProduct(data);
  },

  async remove(id: string) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { error } = await client.from("products").delete().eq("id", id);
    if (error) throw new ApiError(error.message, 400);
    return { id };
  },

  async duplicate(id: string) {
    const client = supabase;
    if (!client) throw new Error("Supabase is not configured");
    const { data: source, error: sourceError } = await client
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (sourceError || !source) throw new ApiError("Product not found", 404);
    
    // Create a clean copy with only snake_case fields
    const copy = {
      id: `prd-${Date.now()}`,
      slug: `${source["slug"]}-copy`,
      name: `${source["name"]} (Copy)`,
      description: source["description"],
      details: source["details"],
      category: source["category"],
      subcategory: source["subcategory"],
      price: source["price"],
      old_price: source["old_price"],
      sku: source["sku"],
      stock: source["stock"],
      sizes: source["sizes"],
      colors: source["colors"],
      images: source["images"],
      tags: source["tags"],
      rating: source["rating"],
      reviews_count: source["reviews_count"],
      featured: source["featured"],
      best_seller: source["best_seller"],
      new_arrival: source["new_arrival"],
      status: "draft",
    };
    
    const { data, error } = await client.from("products").insert(copy).select("*").single();
    if (error) throw new ApiError(error.message, 400);
    return mapSupabaseProduct(data);
  },
};