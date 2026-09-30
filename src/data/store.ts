import type { Coupon, Customer, Order } from "@/types";
import { products } from "./catalog";

function itemFrom(index: number, quantity: number, size: string, color: string) {
  const product = products[index]!;
  return {
    name: product.name,
    slug: product.slug,
    image: product.images[0]!,
    size,
    color,
    quantity,
    price: product.price,
  };
}

function totalsOf(items: ReturnType<typeof itemFrom>[], discount = 0, shipping = 3500) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

const baseAddress = {
  fullName: "Aisha Olabode",
  phone: "+234 802 555 0114",
  street: "14 Bourdillon Road, Ikoyi",
  city: "UK",
  state: "UK",
  country: "UK",
};

const orderSeeds: Array<{
  id: string;
  createdAt: string;
  items: ReturnType<typeof itemFrom>[];
  status: Order["status"];
  paymentStatus: Order["paymentStatus"];
  customerId: string;
  customerName: string;
  customerEmail: string;
  discount?: number;
}> = [
  {
    id: "SLH-10421",
    createdAt: "2026-08-28T10:24:00.000Z",
    items: [itemFrom(0, 1, "M", "Olive"), itemFrom(4, 2, "One Size", "Chocolate")],
    status: "out-for-delivery",
    paymentStatus: "paid",
    customerId: "cus-001",
    customerName: "Aisha Olabode",
    customerEmail: "aisha@example.com",
    discount: 5000,
  },
  {
    id: "SLH-10418",
    createdAt: "2026-08-24T15:02:00.000Z",
    items: [itemFrom(7, 1, "S", "Sage")],
    status: "delivered",
    paymentStatus: "paid",
    customerId: "cus-001",
    customerName: "Aisha Olabode",
    customerEmail: "aisha@example.com",
  },
  {
    id: "SLH-10415",
    createdAt: "2026-08-19T09:40:00.000Z",
    items: [itemFrom(3, 2, "L", "Sand"), itemFrom(10, 1, "One Size", "Tan")],
    status: "processing",
    paymentStatus: "paid",
    customerId: "cus-002",
    customerName: "Fatima Bello",
    customerEmail: "fatima@example.com",
  },
  {
    id: "SLH-10412",
    createdAt: "2026-08-14T18:11:00.000Z",
    items: [itemFrom(11, 1, "One Size", "Tan")],
    status: "shipped",
    paymentStatus: "paid",
    customerId: "cus-003",
    customerName: "Chinelo Eze",
    customerEmail: "chinelo@example.com",
  },
  {
    id: "SLH-10409",
    createdAt: "2026-08-08T12:35:00.000Z",
    items: [itemFrom(2, 3, "M", "Terracotta")],
    status: "pending",
    paymentStatus: "unpaid",
    customerId: "cus-004",
    customerName: "Zainab Musa",
    customerEmail: "zainab@example.com",
  },
  {
    id: "SLH-10403",
    createdAt: "2026-07-30T08:05:00.000Z",
    items: [itemFrom(15, 1, "M", "Cream")],
    status: "delivered",
    paymentStatus: "paid",
    customerId: "cus-002",
    customerName: "Fatima Bello",
    customerEmail: "fatima@example.com",
  },
  {
    id: "SLH-10398",
    createdAt: "2026-07-21T14:48:00.000Z",
    items: [itemFrom(6, 1, "38", "Sand")],
    status: "cancelled",
    paymentStatus: "refunded",
    customerId: "cus-005",
    customerName: "Ronke Adeyemi",
    customerEmail: "ronke@example.com",
  },
  {
    id: "SLH-10390",
    createdAt: "2026-07-11T11:20:00.000Z",
    items: [itemFrom(1, 1, "L", "Cream"), itemFrom(4, 1, "One Size", "Cream")],
    status: "delivered",
    paymentStatus: "paid",
    customerId: "cus-003",
    customerName: "Chinelo Eze",
    customerEmail: "chinelo@example.com",
  },
];

export const orders: Order[] = orderSeeds.map((seed) => {
  const totals = totalsOf(seed.items, seed.discount ?? 0);
  return {
    id: seed.id,
    reference: `PSK_${seed.id.replace("SLH-", "")}`,
    customerId: seed.customerId,
    customerName: seed.customerName,
    customerEmail: seed.customerEmail,
    createdAt: seed.createdAt,
    items: seed.items,
    ...totals,
    status: seed.status,
    paymentStatus: seed.paymentStatus,
    paymentMethod: "Paystack - Card",
    deliveryMethod: "Express (1–3 days)",
    address: { ...baseAddress, fullName: seed.customerName },
    estimatedDelivery: new Date(
      new Date(seed.createdAt).getTime() + 3 * 86400000,
    ).toISOString(),
  };
});

export const customers: Customer[] = [
  {
    id: "cus-001",
    name: "Aisha Olabode",
    email: "aisha@example.com",
    phone: "+234 802 555 0114",
    joinedAt: "2025-11-02T09:00:00.000Z",
    orders: 2,
    totalSpent: 152000,
    status: "active",
    addresses: [
      {
        id: "adr-1",
        label: "Home",
        ...baseAddress,
        isDefault: true,
      },
      {
        id: "adr-2",
        label: "Office",
        fullName: "Aisha Olabode",
        phone: "+234 802 555 0114",
        street: "8 Kofo Abayomi Street, Victoria Island",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        isDefault: false,
      },
    ],
  },
  {
    id: "cus-002",
    name: "Fatima Bello",
    email: "fatima@example.com",
    phone: "+234 703 441 0088",
    joinedAt: "2026-01-18T09:00:00.000Z",
    orders: 2,
    totalSpent: 191500,
    status: "active",
    addresses: [],
  },
  {
    id: "cus-003",
    name: "Chinelo Eze",
    email: "chinelo@example.com",
    phone: "+234 812 009 7741",
    joinedAt: "2026-02-27T09:00:00.000Z",
    orders: 2,
    totalSpent: 168500,
    status: "active",
    addresses: [],
  },
  {
    id: "cus-004",
    name: "Zainab Musa",
    email: "zainab@example.com",
    phone: "+234 909 220 1183",
    joinedAt: "2026-05-06T09:00:00.000Z",
    orders: 1,
    totalSpent: 101000,
    status: "active",
    addresses: [],
  },
  {
    id: "cus-005",
    name: "Ronke Adeyemi",
    email: "ronke@example.com",
    phone: "+234 806 771 2290",
    joinedAt: "2026-06-19T09:00:00.000Z",
    orders: 1,
    totalSpent: 0,
    status: "blocked",
    addresses: [],
  },
];

export const coupons: Coupon[] = [
  {
    id: "cpn-1",
    code: "SELAH10",
    type: "percentage",
    value: 10,
    minOrder: 30000,
    maxDiscount: 15000,
    expiresAt: "2026-12-31",
    usageLimit: 500,
    used: 128,
    active: true,
  },
  {
    id: "cpn-2",
    code: "NEWSEASON",
    type: "fixed",
    value: 5000,
    minOrder: 50000,
    expiresAt: "2026-10-31",
    usageLimit: 200,
    used: 61,
    active: true,
  },
  {
    id: "cpn-3",
    code: "FREESHIP",
    type: "fixed",
    value: 3500,
    minOrder: 75000,
    expiresAt: "2026-09-30",
    usageLimit: 1000,
    used: 402,
    active: false,
  },
];

export const salesSeries = [
  { month: "Sep", revenue: 1840000, orders: 41 },
  { month: "Oct", revenue: 2120000, orders: 48 },
  { month: "Nov", revenue: 3260000, orders: 74 },
  { month: "Dec", revenue: 4410000, orders: 96 },
  { month: "Jan", revenue: 2380000, orders: 52 },
  { month: "Feb", revenue: 2740000, orders: 61 },
  { month: "Mar", revenue: 3120000, orders: 69 },
  { month: "Apr", revenue: 2980000, orders: 66 },
  { month: "May", revenue: 3640000, orders: 78 },
  { month: "Jun", revenue: 3910000, orders: 84 },
  { month: "Jul", revenue: 4280000, orders: 92 },
  { month: "Aug", revenue: 4760000, orders: 103 },
];

export const categoryPerformance = [
  { category: "Dresses", revenue: 12400000 },
  { category: "Tops", revenue: 6800000 },
  { category: "Bottoms", revenue: 5900000 },
  { category: "Bags", revenue: 4300000 },
  { category: "Accessories", revenue: 3100000 },
  { category: "Shoes", revenue: 2200000 },
];
