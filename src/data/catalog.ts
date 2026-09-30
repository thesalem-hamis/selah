import type { Category, Product, Review, Testimonial } from "@/types";

import catDresses from "@/assets/cat-dresses.jpg";
import catTops from "@/assets/cat-tops.jpg";
import catBottoms from "@/assets/cat-bottoms.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import catShoes from "@/assets/cat-shoes.jpg";
import catBags from "@/assets/cat-bags.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

/** The storefront runs a single category; individual types live on `product.subcategory`. */
export const WOMEN_CLOTHING_SLUG = "women-clothing";

export const categories: Category[] = [
  {
    id: "cat-1",
    slug: WOMEN_CLOTHING_SLUG,
    name: "Women Clothing",
    description:
      "Modest dresses, abayas, co-ords and everyday layers — everything we make, in one wardrobe.",
    image: catDresses,
    active: true,
  },
];

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41"];
const ONE_SIZE = ["One Size"];

const COLORS = {
  olive: { name: "Olive", hex: "#6E7A50" },
  cream: { name: "Cream", hex: "#F1E9D9" },
  terracotta: { name: "Terracotta", hex: "#B3603C" },
  sand: { name: "Sand", hex: "#DCC9A8" },
  chocolate: { name: "Chocolate", hex: "#4E362A" },
  tan: { name: "Tan", hex: "#B5763F" },
  sage: { name: "Sage", hex: "#9CA986" },
  ink: { name: "Ink", hex: "#2B2E27" },
};

interface Seed {
  name: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images: string[];
  colors: Product["colors"];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  description: string;
  tags: string[];
}

const seeds: Seed[] = [
  {
    name: "Amara Satin Maxi Dress",
    category: "dresses",
    subcategory: "Occasion",
    price: 68500,
    oldPrice: 82000,
    stock: 14,
    images: [p1, p2, p8],
    colors: [COLORS.olive, COLORS.terracotta, COLORS.cream],
    sizes: CLOTHING_SIZES,
    rating: 4.9,
    reviewsCount: 128,
    featured: true,
    bestSeller: true,
    newArrival: true,
    description:
      "A fluid satin maxi with a gathered waist and generous sweep — cut to move quietly with you from evening dinners to garden ceremonies.",
    tags: ["satin", "maxi", "occasion", "modest"],
  },
  {
    name: "Noor Pleated Open Abaya",
    category: "dresses",
    subcategory: "Abayas",
    price: 74000,
    stock: 9,
    images: [p2, p1],
    colors: [COLORS.cream, COLORS.sand],
    sizes: CLOTHING_SIZES,
    rating: 4.8,
    reviewsCount: 76,
    featured: true,
    newArrival: true,
    description:
      "Knife pleats fall from a softly gathered yoke on this open-front abaya, finished with hand-rolled cuffs.",
    tags: ["abaya", "pleated", "layering"],
  },
  {
    name: "Zahra Balloon-Sleeve Blouse",
    category: "tops",
    subcategory: "Blouses",
    price: 32500,
    oldPrice: 39000,
    stock: 26,
    images: [p3, p8],
    colors: [COLORS.terracotta, COLORS.cream, COLORS.ink],
    sizes: CLOTHING_SIZES,
    rating: 4.7,
    reviewsCount: 94,
    bestSeller: true,
    newArrival: true,
    description:
      "A liquid-satin blouse with volume through the sleeve and a clean covered placket. Tucks neatly, drapes beautifully.",
    tags: ["blouse", "satin", "workwear"],
  },
  {
    name: "Halima Wide-Leg Linen Trouser",
    category: "bottoms",
    subcategory: "Trousers",
    price: 38500,
    stock: 31,
    images: [p4, p8],
    colors: [COLORS.sand, COLORS.ink, COLORS.olive],
    sizes: CLOTHING_SIZES,
    rating: 4.8,
    reviewsCount: 152,
    bestSeller: true,
    featured: true,
    description:
      "High-rise, double-pleated and cut wide from a breathable linen blend that holds its press through the day.",
    tags: ["trousers", "linen", "wide-leg"],
  },
  {
    name: "Sahara Chiffon Scarf",
    category: "accessories",
    subcategory: "Scarves",
    price: 12500,
    oldPrice: 15000,
    stock: 68,
    images: [p5, catAccessories],
    colors: [COLORS.chocolate, COLORS.cream, COLORS.terracotta, COLORS.sage],
    sizes: ONE_SIZE,
    rating: 4.9,
    reviewsCount: 311,
    bestSeller: true,
    newArrival: true,
    description:
      "Featherweight chiffon with a hand-finished edge — the wrap our customers repurchase in every shade.",
    tags: ["scarf", "hijab", "chiffon"],
  },
  {
    name: "Layla Leather Crossbody",
    category: "bags",
    subcategory: "Crossbody",
    price: 54000,
    stock: 12,
    images: [p6, catBags],
    colors: [COLORS.tan, COLORS.chocolate],
    sizes: ONE_SIZE,
    rating: 4.6,
    reviewsCount: 48,
    featured: true,
    newArrival: true,
    description:
      "A compact saddle shape in full-grain leather with solid brass hardware and an adjustable strap.",
    tags: ["bag", "leather", "crossbody"],
  },
  {
    name: "Bisi Pointed Leather Mule",
    category: "shoes",
    subcategory: "Flats",
    price: 44500,
    oldPrice: 52000,
    stock: 0,
    images: [p7, catShoes],
    colors: [COLORS.sand, COLORS.chocolate],
    sizes: SHOE_SIZES,
    rating: 4.5,
    reviewsCount: 61,
    description:
      "An elongated pointed mule in buttery leather, lined and cushioned for all-day wear.",
    tags: ["shoes", "mule", "leather"],
  },
  {
    name: "Amina Linen Two-Piece Set",
    category: "tops",
    subcategory: "Co-ords",
    price: 59000,
    stock: 18,
    images: [p8, p4],
    colors: [COLORS.sage, COLORS.cream],
    sizes: CLOTHING_SIZES,
    rating: 4.8,
    reviewsCount: 87,
    featured: true,
    bestSeller: true,
    newArrival: true,
    description:
      "Relaxed boxy top and drawstring wide trouser in washed linen — sold together, worn apart just as easily.",
    tags: ["set", "linen", "co-ord"],
  },
  {
    name: "Selah Satin Slip Dress",
    category: "dresses",
    subcategory: "Everyday",
    price: 46500,
    oldPrice: 58000,
    stock: 22,
    images: [p1, p3],
    colors: [COLORS.olive, COLORS.chocolate],
    sizes: CLOTHING_SIZES,
    rating: 4.6,
    reviewsCount: 65,
    description:
      "A bias-cut column designed for layering beneath abayas and open coats through the cooler months.",
    tags: ["dress", "layering", "satin"],
  },
  {
    name: "Farida Tiered Midi Skirt",
    category: "bottoms",
    subcategory: "Skirts",
    price: 34500,
    stock: 24,
    images: [p4, p1],
    colors: [COLORS.sand, COLORS.terracotta],
    sizes: CLOTHING_SIZES,
    rating: 4.4,
    reviewsCount: 39,
    newArrival: true,
    description: "Three soft tiers with a hidden elastic waist and deep, useful pockets.",
    tags: ["skirt", "midi", "tiered"],
  },
  {
    name: "Kemi Gold Coin Necklace",
    category: "accessories",
    subcategory: "Jewellery",
    price: 18500,
    stock: 42,
    images: [catAccessories, p5],
    colors: [COLORS.tan],
    sizes: ONE_SIZE,
    rating: 4.7,
    reviewsCount: 58,
    newArrival: true,
    description: "A hand-etched coin pendant on a fine gold-filled chain. Water resistant.",
    tags: ["jewellery", "gold", "necklace"],
  },
  {
    name: "Dara Structured Leather Tote",
    category: "bags",
    subcategory: "Totes",
    price: 78000,
    oldPrice: 92000,
    stock: 7,
    images: [catBags, p6],
    colors: [COLORS.tan, COLORS.ink],
    sizes: ONE_SIZE,
    rating: 4.9,
    reviewsCount: 73,
    bestSeller: true,
    featured: true,
    description:
      "Holds a laptop, a water bottle and everything else — in leather that softens with each week of use.",
    tags: ["bag", "tote", "leather", "work"],
  },
  {
    name: "Ronke Block Heel Sandal",
    category: "shoes",
    subcategory: "Heels",
    price: 49500,
    stock: 15,
    images: [catShoes, p7],
    colors: [COLORS.tan],
    sizes: SHOE_SIZES,
    rating: 4.5,
    reviewsCount: 44,
    newArrival: true,
    description: "A 60mm stacked heel with a woven vamp and adjustable ankle strap.",
    tags: ["shoes", "sandal", "heel"],
  },
  {
    name: "Iman Cotton Tunic",
    category: "tops",
    subcategory: "Tunics",
    price: 28500,
    oldPrice: 34000,
    stock: 37,
    images: [catTops, p3],
    colors: [COLORS.cream, COLORS.sage],
    sizes: CLOTHING_SIZES,
    rating: 4.3,
    reviewsCount: 51,
    description: "Longline cotton poplin with side vents and a mandarin collar.",
    tags: ["tunic", "cotton", "everyday"],
  },
  {
    name: "Tola Palazzo Trouser",
    category: "bottoms",
    subcategory: "Trousers",
    price: 36500,
    stock: 29,
    images: [catBottoms, p4],
    colors: [COLORS.ink, COLORS.sand],
    sizes: CLOTHING_SIZES,
    rating: 4.6,
    reviewsCount: 66,
    bestSeller: true,
    description: "Fluid crepe palazzo with an elasticated back waist for comfort without bulk.",
    tags: ["trousers", "palazzo", "crepe"],
  },
  {
    name: "Yara Occasion Gown",
    category: "dresses",
    subcategory: "Occasion",
    price: 96000,
    stock: 5,
    images: [p2, p1],
    colors: [COLORS.cream, COLORS.olive],
    sizes: CLOTHING_SIZES,
    rating: 5,
    reviewsCount: 22,
    featured: true,
    newArrival: true,
    description:
      "Our most considered piece: a gathered bodice, full sweeping skirt and a detachable sash.",
    tags: ["gown", "occasion", "bridal"],
  },
];

export const products: Product[] = seeds.map((seed, index) => {
  const slug = seed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return {
    id: `prd-${String(index + 1).padStart(3, "0")}`,
    slug,
    name: seed.name,
    description: seed.description,
    details: [
      "Designed in Lagos, made in small batches",
      "Modest cut with full-length sleeves or coverage as shown",
      "Dry clean or cold hand wash",
      "Model is 5'9\" and wears a size S",
    ],
    category: seed.category,
    subcategory: seed.subcategory,
    price: seed.price,
    oldPrice: seed.oldPrice,
    sku: `SLH-${seed.category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    stock: seed.stock,
    sizes: seed.sizes,
    colors: seed.colors,
    images: seed.images,
    tags: seed.tags,
    rating: seed.rating,
    reviewsCount: seed.reviewsCount,
    featured: Boolean(seed.featured),
    bestSeller: Boolean(seed.bestSeller),
    newArrival: Boolean(seed.newArrival),
    status: "active",
  };
});

export const reviews: Review[] = [
  {
    id: "rev-1",
    productId: "prd-001",
    author: "Aisha O.",
    rating: 5,
    title: "Worth every moment",
    body: "The satin is heavy in the best way and the length was perfect without alteration. I've worn it to two weddings already.",
    date: "2026-07-12",
  },
  {
    id: "rev-2",
    productId: "prd-001",
    author: "Damilola A.",
    rating: 5,
    title: "Beautiful drape",
    body: "Sized down and it still flows. Delivery to Ikeja took two days.",
    date: "2026-06-28",
  },
  {
    id: "rev-3",
    productId: "prd-004",
    author: "Halima Y.",
    rating: 4,
    title: "My new work trouser",
    body: "Breathable and the pleats hold. I wish it came in a taller inseam.",
    date: "2026-08-02",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Aisha Olabode",
    location: "Lagos",
    rating: 5,
    quote:
      "Everything arrives folded in tissue with a handwritten note. It genuinely feels like a gift, even when I'm buying for myself.",
  },
  {
    id: "t-2",
    name: "Fatima Bello",
    location: "Abuja",
    rating: 5,
    quote:
      "Finally a brand that understands modest tailoring. The sleeves are the right length and nothing is see-through.",
  },
  {
    id: "t-3",
    name: "Chinelo Eze",
    location: "Port Harcourt",
    rating: 4,
    quote:
      "I ordered the linen set for a work trip and lived in it for a week. Third order this year and the quality has never dipped.",
  },
  {
    id: "t-4",
    name: "Zainab Musa",
    location: "Kano",
    rating: 5,
    quote:
      "The scarves are the softest I own. Customer care replied within minutes when I needed a colour swap.",
  },
];
