import { NextResponse } from "next/server";
import { getOrders, saveOrders, getProducts, getSettings } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getOrders());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { customer, items } = body;
  if (!customer || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  const products = await getProducts();
  let total = 0;
  const lineItems = items.map((it: any) => {
    const p = products.find((x) => x.id === it.productId);
    const price = p ? (p.salePrice ?? p.price) : 0;
    total += price * it.qty;
    return {
      productId: it.productId,
      name: p?.name || "Item",
      image: p?.image || "",
      price,
      qty: it.qty,
    };
  });

  const order = {
    id: crypto.randomUUID(),
    customer,
    items: lineItems,
    subtotal: total,
    total,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };
  const orders = [order, ...(await getOrders())];
  await saveOrders(orders);

  // Forward order to webhook (Google Apps Script) if configured
  try {
    const settings = await getSettings();
    if (settings.webhookUrl) {
      await fetch(settings.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    }
  } catch {
    // webhook failure should not block order creation
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
