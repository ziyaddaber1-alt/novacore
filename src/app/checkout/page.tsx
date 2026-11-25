"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const { items: contextItems, subtotal } = useCart();
  const [items, setItems] = useState<{ productId: string; qty: number }[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const finalItems = contextItems.length > 0 ? contextItems : [];
    setItems(finalItems);
    setLoaded(true);
  }, [contextItems]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products", { cache: "no-store" });
      const list = await res.json();
      const products = Array.isArray(list) ? list : [];
      const next: Record<string, number> = {};
      for (const item of items) {
        const p = products.find((x: any) => x.id === item.productId);
        next[item.productId] = p ? (p.salePrice ?? p.price) : 0;
      }
      setPrices(next);
    })();
  }, [items]);

  const [form, setForm] = useState({
    name: "", phone: "", address: "", city: "",
  });

  const handleChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const computeTotal = () => {
    return items.reduce((s, i) => s + ((prices[i.productId] || 0) * i.qty), 0);
  };

  if (!loaded) {
    return (
      <div className="flex flex-col flex-1">
        <Nav />
        <main className="flex-1 bg-black/[0.5] pt-20">
          <div className="max-w-4xl mx-auto px-6 text-center py-24">
            <h2 className="text-3xl font-bold text-white mb-4">Loading cart…</h2>
          </div>
        </main>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col flex-1">
        <Nav />
        <main className="flex-1 bg-black/[0.5] pt-20">
          <div className="max-w-4xl mx-auto px-6 text-center py-24">
            <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-steel-light mb-10">Add items before checking out.</p>
            <Link href="/shop" className="px-10 py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors">
              Start shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Nav />
      <main className="flex-1 bg-black/[0.5]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setSubmitting(true);
                try {
                  const customer = {
                    name: form.name, phone: form.phone,
                    address: form.address, city: form.city,
                  };
                  const lineItems = items.map((i) => ({ productId: i.productId, qty: i.qty }));
                  const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ customer, items: lineItems }),
                  });
                  if (!res.ok) throw new Error("Order failed");
                  const data = await res.json();
                  localStorage.setItem("nova_cart", JSON.stringify([]));
                  window.location.href = `/thank-you?orderId=${data.orderId}`;
                } catch (err: any) {
                  setError(err?.message || "Unable to place order. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-6 glass-dark rounded-xl p-8 border border-white/[0.08]"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Checkout</h2>
              <p className="text-steel-light text-sm mb-6">Secure checkout. No payment data is stored — a payment gateway can be connected at the /api/orders route.</p>

              {error && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-1">Full name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors placeholder-steel-light/50"
                    placeholder="Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-1">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors placeholder-steel-light/50"
                  placeholder="+212 6xx xxx xxx"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-1">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors placeholder-steel-light/50"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-1">City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors placeholder-steel-light/50"
                    placeholder="City"
                  />
                </div>
              </div>
              <div className="border-t border-white/[0.08] pt-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-steel-light">Order total</span>
                  <span className="text-white font-semibold">
                    ${computeTotal().toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}
                  </span>
                </div>
                <p className="text-[11px] text-steel-light uppercase tracking-widest mb-4">
                  Payments are not yet connected. Orders are recorded for admin review.
                </p>
                <button
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  {submitting ? "PLACING ORDER…" : "PLACE ORDER"}
                </button>
              </div>
            </form>

            <aside className="glass-dark rounded-xl p-6 sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-steel-light mb-6">Order Summary ({items.length} items)</h3>
              <div className="space-y-4 mb-8">
                {items.map((i) => {
                  const price = prices[i.productId] ?? 0;
                  const name = i.productId.replace("grinder-", "Grinder ");
                  return (
                    <div key={i.productId} className="flex justify-between items-baseline text-sm">
                      <span className="text-steel-light">{name} × {i.qty}</span>
                      <span className="text-white font-mono">
                        ${(price * i.qty).toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-white/[0.08] pt-4">
                <div className="flex justify-between mb-2 text-sm font-semibold text-white">
                  <span>Total</span>
                  <span>${computeTotal().toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
