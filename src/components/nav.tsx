"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/components/providers";

export default function Nav() {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navColor, setNavColor] = useState<{ bg: string; text: string } | null>(null);

  const links = [
    { name: "Shop", href: "/shop", id: "shop" },
    { name: "Grinders", href: "/shop?category=Grinders", id: "grinders" },
    { name: "Accessories", href: "/shop?category=Accessories", id: "accessories" },
    { name: "About", href: "/about", id: "about" },
    { name: "Contact", href: "/contact", id: "contact" },
  ];

  const observeSections = useCallback(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target) {
          const el = visible.target as HTMLElement;
          const computed = window.getComputedStyle(el);
          const bg = computed.backgroundColor || "transparent";

          if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
            setNavColor({ bg, text: "#ffffff" });
            return;
          }
        }
        setNavColor(null);
      },
      { threshold: 0.2, rootMargin: "-15% 0px -15% 0px" }
    );

    document.querySelectorAll("section").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    observeSections();
  }, [observeSections]);

  const navStyle = navColor
    ? {
        backgroundColor: navColor.bg,
        color: navColor.text,
      }
    : {};

  const linkColor = navColor ? "text-white" : "text-steel-light hover:text-white";
  const iconColor = navColor ? "text-white" : "text-steel-light hover:text-white";

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-700 ease-out"
      style={{
        ...navStyle,
        backgroundImage: navColor ? "none" : undefined,
        backdropFilter: navColor ? "none" : "blur(12px)",
        border: navColor ? "none" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <Image src="/LOGOnobackground.png" alt="NOVA CORE" width={64} height={64} className="-mt-1 -mb-1 drop-shadow-[0_0_18px_rgba(59,130,246,0.5)]" />
          </Link>

          <div className={`hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest ${linkColor}`}>
            {links.map((l) => (
              <Link key={l.name} href={l.href} className="transition-colors duration-300">
                {l.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}>
              <span className="sr-only">Menu</span>
              <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link href="/wishlist" className={`${iconColor} transition-colors duration-300 p-2 relative`} onClick={() => setMobileOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </Link>
            <Link href="/cart" className={`relative ${iconColor} transition-colors duration-300 p-2`} onClick={() => setMobileOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {count > 0 ? (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-charcoal text-xs font-bold">
                  {count}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className={`md:hidden border-b transition-all duration-300 ${
            navColor ? `bg-[${navColor.bg}] border-white/[0.15]` : "glass-dark border-white/[0.06]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            {links.map((l) => (
              <Link key={l.name} href={l.href} className={`block py-2 text-sm font-medium transition-colors ${navColor ? "text-white" : "text-steel-light hover:text-white"}`} onClick={() => setMobileOpen(false)}>
                {l.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/[0.1]">
              <Link href="/cart" className={`block py-2 text-sm font-medium transition-colors ${navColor ? "text-white" : "text-steel-light hover:text-white"}`} onClick={() => setMobileOpen(false)}>
                Cart ({count})
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
