"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/providers";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function CartPage() {
  const { items, remove, setQty, clear, count, subtotal } = useCart();
  const router = useRouter();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [productById, setProductById] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products", { cache: "no-store" });
      const list = await res.json();
      const products = Array.isArray(list) ? list : [];
      const byId: Record<string, any> = {};
      const next: Record<string, number> = {};
      for (const p of products) {
        byId[p.id] = p;
      }
      for (const item of items) {
        const p = byId[item.productId];
        next[item.productId] = p ? (p.salePrice ?? p.price) : 0;
      }
      setProductById(byId);
      setPrices(next);
      setLoading(false);
    })();
  }, [items]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <Nav />
        <main className="flex-1 bg-black/[0.5] pt-20">
          <div className="max-w-4xl mx-auto px-6 text-center py-20">
            <p className="text-steel-light">Loading cart…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Nav />
      <main className="flex-1 bg-black/[0.5]">
        {items.length === 0 ? (
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-steel-light mb-10">Add some precision to your collection.</p>
            <Link href="/shop" className="px-10 py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors">
              Start shopping
            </Link>
          </div>
        ) : (
            <div className="max-w-5xl mx-auto px-6 py-12">
              <div className="grid md:grid-cols-4 gap-12">
                <div className="md:col-span-3 space-y-6">
                  <h2 className="text-3xl font-bold text-white mb-8">Shopping Cart ({count})</h2>
                  {items.map((item) => {
                    const price = prices[item.productId] || 0;
                    const p = productById[item.productId];
                    if (!p) return null;
                    return (
                      <div key={item.productId} className="flex flex-col md:flex-row gap-4 md:gap-6 py-6 border-b border-white/[0.04]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover object-center border border-white/[0.06]"
                      />
                      <div className="flex-1">
                        <Link href={`/product/${p.slug}`} className="text-white font-semibold hover:text-cyan-400 transition-colors">
                          {p.name}
                        </Link>
                        <p className="text-xs text-steel-light">SKU {p.sku}</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 md:text-right text-left">
                        <div className="flex items-center gap-2 border border-white/[0.08] rounded-lg w-full md:w-auto justify-center md:justify-start">
                          <button
                            onClick={() => setQty(item.productId, item.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center text-steel-light hover:text-white"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-mono text-white">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.productId, item.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center text-steel-light hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-lg font-bold text-white mt-2 md:mt-0">
                          {(price * item.qty).toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}
                        </div>
                        <button
                          onClick={() => remove(item.productId)}
                          className="text-rose-500 hover:text-rose-400 text-sm transition-colors mt-2 md:mt-0"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="md:col-span-1 space-y-6 mt-12 md:mt-0">
                <div className="glass-dark rounded-xl p-6 sticky md:sticky top-0 md:top-24">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-steel-light">Subtotal</span>
                    <span className="text-white font-semibold">
                      {subtotal(prices).toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}
                    </span>
                  </div>
                  <div className="flex justify-between mb-6 text-xs text-steel-light">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="border-t border-white/[0.08] pt-4">
                    <div className="flex justify-between mb-1 text-sm font-semibold text-white">
                      <span>Total</span>
                      <span>
                        {subtotal(prices).toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}
                      </span>
                    </div>
                    <button
onClick={() => {
                        router.push("/checkout");
                      }}
                      className="w-full py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                    >
                      Proceed to checkout
                    </button>
                  </div>
                  <button
                    onClick={clear}
                    className="w-full py-3 rounded-full border border-white/[0.15] text-xs font-medium text-steel-light hover:bg-white/[0.05] transition-colors"
                  >
                    Clear cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}


