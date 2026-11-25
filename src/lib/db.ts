import { Redis } from "@upstash/redis";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  stock: number;
  sku: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  items: Array<{ productId: string; name: string; image: string; price: number; qty: number }>;
  subtotal: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: string;
}

export interface Settings {
  admin: { username: string; passwordHash: string };
  store: { name: string; email: string; currency: string };
  legal: { ageVerification: boolean; market: string };
  webhookUrl?: string;
}

export const STORAGE_KEYS = {
  CART: "nova_cart",
  WISHLIST: "nova_wishlist",
};

const KEYS = {
  PRODUCTS: "products",
  ORDERS: "orders",
  SETTINGS: "settings",
};

function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function getProducts(): Promise<Product[]> {
  if (!isRedisConfigured()) return [];
  try {
    const redis = getRedis();
    const data = await redis.get<Product[]>(KEYS.PRODUCTS);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (!isRedisConfigured()) throw new Error("Upstash Redis not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.");
  const redis = getRedis();
  await redis.set(KEYS.PRODUCTS, products);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getOrders(): Promise<Order[]> {
  if (!isRedisConfigured()) return [];
  try {
    const redis = getRedis();
    const data = await redis.get<Order[]>(KEYS.ORDERS);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  if (!isRedisConfigured()) throw new Error("Upstash Redis not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.");
  const redis = getRedis();
  await redis.set(KEYS.ORDERS, orders);
}

export async function getSettings(): Promise<Settings> {
  if (!isRedisConfigured()) {
    return {
      admin: { username: "admin", passwordHash: "" },
      store: { name: "NOVA CORE", email: "hello@novacore.store", currency: "MAD" },
      legal: { ageVerification: true, market: "MA" },
    };
  }
  try {
    const redis = getRedis();
    const data = await redis.get<Settings>(KEYS.SETTINGS);
    if (data) return data;
  } catch {}
  return {
    admin: { username: "admin", passwordHash: "" },
    store: { name: "NOVA CORE", email: "hello@novacore.store", currency: "MAD" },
    legal: { ageVerification: true, market: "MA" },
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  if (!isRedisConfigured()) throw new Error("Upstash Redis not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.");
  const redis = getRedis();
  await redis.set(KEYS.SETTINGS, settings);
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  const cats = new Set<string>();
  for (const p of products) cats.add(p.category);
  return Array.from(cats);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.active && p.featured);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  return (await getProducts()).filter(
    (p) => p.active && (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  );
}

export async function filterProducts({
  category,
  sort,
}: {
  category?: string;
  sort?: "price-asc" | "price-desc" | "name";
}): Promise<Product[]> {
  let list = (await getProducts()).filter((p) => p.active);
  if (category) list = list.filter((p) => p.category === category);
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
