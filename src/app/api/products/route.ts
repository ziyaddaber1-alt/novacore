import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import * as crypto from "crypto";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const now = new Date().toISOString();
    const product = {
      id: crypto.randomUUID(),
      name: body.name || "Untitled Product",
      slug: body.slug || (body.name || "untitled").toLowerCase().replace(/\s+/g, "-"),
      description: body.description || "",
      price: Number(body.price) || 0,
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      image: body.image || "/grinder1.jpeg",
      category: body.category || "Grinders",
      stock: Number(body.stock) || 0,
      sku: body.sku || "NVA-" + Math.floor(Math.random() * 100000).toString().padStart(5, "0"),
      active: body.active !== false,
      featured: body.featured === true,
      createdAt: now,
      updatedAt: now,
    };
    const products = [...(await getProducts()), product];
    await saveProducts(products);
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create product" }, { status: 500 });
  }
}
