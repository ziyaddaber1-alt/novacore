import { NextResponse } from "next/server";
import { getOrders } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getOrders();

  const rows: string[][] = [];
  rows.push([
    "Order ID",
    "Date",
    "Customer Name",
    "Email",
    "Phone",
    "Address",
    "City",
    "Country",
    "Items",
    "Subtotal (MAD)",
    "Total (MAD)",
    "Status",
  ]);

  for (const o of orders) {
    const itemsStr = o.items.map((i: any) => `${i.name} x${i.qty}`).join("; ");
    rows.push([
      o.id,
      o.createdAt,
      o.customer.name,
      o.customer.email || "",
      o.customer.phone || "",
      o.customer.address || "",
      o.customer.city || "",
      o.customer.country || "",
      itemsStr,
      o.subtotal.toFixed(2),
      o.total.toFixed(2),
      o.status,
    ]);
  }

  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nova_core_orders_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
