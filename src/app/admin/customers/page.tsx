"use client";

import { useEffect, useState } from "react";

type Order = { customer: { name: string; email: string } };

export default function CustomersPage() {
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

  const customers = Array.from(
    new Map(orders.map((o) => [o.customer.email, o.customer])).values()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Customers</h2>
        <p className="text-steel-light">Customer overview from placed orders.</p>
      </div>

      <div className="glass-dark rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light">Customer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light">Email</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light text-right">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-steel-light">Loading…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-steel-light">No customers yet.</td></tr>
            ) : (
              customers.map((c) => {
                const count = orders.filter((o) => o.customer.email === c.email).length;
                return (
                  <tr key={c.email} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-xs text-steel-light">{c.email}</td>
                    <td className="px-6 py-4 text-right text-white font-mono">{count}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

