"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCart, useWishlist } from "@/components/providers";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products");
      const list = await res.json();
      const p = Array.isArray(list) ? list.find((x: any) => x.slug === params.slug) : null;
      setProduct(p);
      setLoading(false);
    })();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <Nav />
        <main className="flex-1 bg-black/[0.5] pt-20">
          <div className="max-w-4xl mx-auto px-6 text-center py-20">
            <p className="text-steel-light">Loading product…</p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col flex-1">
        <Nav />
        <main className="flex-1 bg-black/[0.5] pt-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Product not found</h2>
            <Link href="/shop" className="text-cyan-400 text-sm font-medium hover:underline">Back to shop</Link>
          </div>
        </main>
      </div>
    );
  }

  const displayPrice = product.salePrice ?? product.price;
  const inWishlist = has(product.id);

  return (
    <div className="flex flex-col flex-1">
      <Nav />
      <main className="flex-1 bg-black/[0.5]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="mb-8 text-xs text-steel-light uppercase tracking-widest">
            <Link href="/shop" className="hover:text-white">Shop</Link>{" > "}
            <span className="text-white">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            <div className="logo-watermark relative rounded-[24px] overflow-hidden border border-white/[0.06] bg-white/[0.02] flex items-center justify-center w-full max-w-md mx-auto">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-center max-w-full max-h-[600px] scale-105"
                priority
              />
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/[0.5] flex items-center justify-center">
                  <span className="text-white font-bold text-lg tracking-widest">SOLD OUT</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mt-1">{product.category}</span>
                <button
                  onClick={() => toggle(product.id)}
                  className="ml-auto p-2 rounded-full glass-dark text-white hover:bg-cyan-400 hover:text-charcoal transition-colors"
                >
                  <svg className={`w-6 h-6 ${inWishlist ? "fill-current text-amber-400" : "fill-none"}`} viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">{product.name}</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-steel-light mb-6">SKU {product.sku}</p>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-3xl font-bold text-white">{displayPrice.toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}</span>
                {product.salePrice !== undefined && product.salePrice < product.price && (
                  <span className="text-lg text-steel-light line-through">{product.price.toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}</span>
                )}
                <span className="ml-auto text-xs text-steel-light uppercase tracking-tighter">
                  {product.stock > 0 ? product.stock + " in stock" : "Out of stock"}
                </span>
              </div>

              <p className="text-steel-light leading-relaxed mb-10 max-w-md">{product.description}</p>

              <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                <div className="flex items-center gap-2 border border-white/[0.08] rounded-lg w-full md:w-auto">
                  <button
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    disabled={qty <= 1 || product.stock <= 0}
                    className="w-10 h-10 text-steel-light hover:text-white disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-white">{qty}</span>
                  <button
                    onClick={() => setQty((v) => v + 1)}
                    disabled={product.stock <= 0 || qty >= product.stock}
                    className="w-10 h-10 text-steel-light hover:text-white disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (product.stock <= 0) return;
                    add(product.id, qty);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1500);
                  }}
                  disabled={product.stock <= 0}
                  className="flex-1 px-8 py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  {added ? "ADDED" : "ADD TO CART"}
                </button>
              </div>

              {added && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm">
                  <span className="text-emerald-400 font-bold">Added to cart.</span>{" "}
                  <Link href="/cart" className="text-white underline underline-offset-4 hover:text-cyan-400">View cart</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


