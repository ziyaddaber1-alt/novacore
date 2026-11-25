"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  customer: { name: string; email: string; address: string; city: string; zip: string; country: string };
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  const statuses = ["pending", "paid", "shipped", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Orders</h2>
          <p className="text-steel-light">Order management.</p>
        </div>
        <a
          href="/api/orders/export"
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_25px_rgba(255,255,255,0.2)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </a>
      </div>

      <div className="glass-dark rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light">Order</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light">Customer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light text-right">Total</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-steel-light">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-steel-light">No orders yet.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-white font-mono text-sm">#{o.id.slice(-6)}</p>
                    <p className="text-xs text-steel-light">{o.items.length} item{o.items.length === 1 ? "" : "s"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{o.customer.name}</p>
                    <p className="text-xs text-steel-light">{o.customer.email}</p>
                  </td>
                  <td className="px-6 py-4 text-right text-white font-mono">{o.total.toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-tighter border-white/[0.1] text-steel-light">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-steel-light">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

