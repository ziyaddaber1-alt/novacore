"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/components/providers";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function WishlistPage() {
  const { ids, toggle } = useWishlist();
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products", { cache: "no-store" });
      const list = await res.json();
      const products = Array.isArray(list) ? list : [];
      const picked = products.filter((p) => ids.has(p.id));
      setProducts(picked);
      setLoaded(true);
    })();
  }, [ids]);

  if (!loaded) {
    return (
      <div className="flex flex-col flex-1">
        <Nav />
        <main className="flex-1 bg-black/[0.5] pt-20">
          <div className="max-w-4xl mx-auto px-6 text-center py-20">
            <p className="text-steel-light">Loading wishlist…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Nav />
      <main className="flex-1 bg-black/[0.5]">
        {products.length === 0 ? (
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-steel-light mb-10">Save your favorite grinders for later.</p>
            <Link href="/shop" className="px-10 py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold text-white mb-8">Wishlist ({products.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {products.map((p) => (
                <div key={p.id} className="rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all">
                  <div className="relative h-64 overflow-hidden group">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <button
                      onClick={() => toggle(p.id)}
                      className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white hover:bg-amber-400 hover:text-charcoal transition-colors"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <Link href={`/product/${p.slug}`} className="block">
                      <h3 className="text-base font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">{p.name}</h3>
                      <p className="text-xs text-steel-light uppercase tracking-widest">{p.category}</p>
                    </Link>
                    <div className="mt-2 text-sm font-bold text-white">
                      {(p.salePrice ?? p.price).toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}


