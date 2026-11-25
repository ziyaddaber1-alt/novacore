"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart, useWishlist } from "@/components/providers";
import type { Product } from "@/lib/db";

interface ProductCardProps {
  product: Product;
  prices?: Record<string, number>;
}

export default function ProductCard({ product, prices }: ProductCardProps) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const [added, setAdded] = useState(false);
  const price = prices?.[product.id] ?? product.price;
  const displayPrice = product.salePrice ?? price;

  return (
    <article className="group relative rounded-[20px] overflow-hidden border border-white/[0.12] bg-white/[0.08] hover:border-white/[0.2] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.35)]">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          priority
        />
        <div className="absolute inset-0 gradient-blue/20 group-hover:gradient-blue/30 transition-colors" />
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
            className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white hover:bg-cyan-400 hover:text-charcoal transition-all"
          >
            <svg className={`w-5 h-5 fill-current ${has(product.id) ? "" : ""}`} viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          {product.salePrice ? (
            <span className="glass-dark px-3 py-1 rounded-full text-[10px] font-bold text-amber-400 uppercase tracking-tighter">SALE</span>
          ) : null}
        </div>
        <span className="absolute bottom-4 left-4 z-10 text-xs font-bold text-white/90 uppercase tracking-tighter">{product.stock > 0 ? "ACTIVE" : "SOLD OUT"}</span>
      </div>

      <div className="p-5">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-base font-semibold text-white leading-tight mb-1 group-hover:text-cyan-400 transition-colors">{product.name}</h3>
          <p className="text-[11px] text-steel-light uppercase tracking-widest">{product.category}</p>
        </Link>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-lg font-bold text-white">{displayPrice.toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}</span>
          {price !== displayPrice && (
            <span className="text-sm text-steel-light line-through">{price.toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}</span>
          )}
          <span className="ml-auto text-[10px] text-steel-light uppercase tracking-tighter">SKU {product.sku}</span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); add(product.id, 1); setAdded(true); setTimeout(() => setAdded(false), 1200); }}
          disabled={product.stock <= 0}
          className="mt-5 w-full py-3 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {product.stock <= 0 ? "SOLD OUT" : "ADD TO CART"}
        </button>
      </div>

      {added && (
        <div className="absolute inset-0 z-20 bg-black/[0.85] flex flex-col items-center justify-center text-white pointer-events-none animate-[fadeIn_0.3s_ease-out]">
          <svg className="w-10 h-10 text-emerald-500 mb-3 animate-[bounce_0.6s_ease-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          <p className="text-sm font-semibold tracking-wide">ADDED TO CART</p>
        </div>
      )}
    </article>
  );
}
