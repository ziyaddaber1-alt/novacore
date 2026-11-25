import { NextResponse } from "next/server";
import { getProducts, saveProducts, getProduct } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id } = await params;
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const updated = {
    ...products[idx],
    ...body,
    id,
    updatedAt: new Date().toISOString(),
    price: body.price !== undefined ? Number(body.price) : products[idx].price,
    stock: body.stock !== undefined ? Number(body.stock) : products[idx].stock,
  };
  products[idx] = updated;
  await saveProducts(products);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const products = (await getProducts()).filter((p) => p.id !== id);
  await saveProducts(products);
  return NextResponse.json({ ok: true });
}
