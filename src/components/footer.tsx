"use client";

import Link from "next/link";

export default function Footer() {
  const cols = [
    {
      title: "SHOP",
      items: [
        { name: "Grinders", href: "/shop?category=Grinders" },
        { name: "Accessories", href: "/shop?category=Accessories" },
        { name: "Best Sellers", href: "/" },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { name: "Help Center", href: "/contact" },
        { name: "Shipping", href: "/shipping" },
      ],
    },
    {
      title: "LEGAL",
      items: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Age Verification", href: "/" },
        { name: "Admin", href: "/admin/login" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-black/[0.4]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="text-cyan-400 text-xl font-bold tracking-tighter">NOVA<span className="text-white">CORE</span></span>
            <p className="mt-4 text-sm text-steel-light leading-relaxed max-w-xs">
              Premium grinders and accessories. Art-directed for the future.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-6">{col.title}</h3>
              <ul className="space-y-3 text-sm text-steel-light">
                {col.items.map((i) => (
                  <li key={i.name}>
                    <Link href={i.href} className="hover:text-cyan-400 transition-colors">
                      {i.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-steel-light">
          <p>© {new Date().getFullYear()} NOVA CORE. All rights reserved.</p>
          <p>Adult-oriented accessories. 21+ where required. Lawful accessories only.</p>
        </div>
      </div>
    </footer>
  );
}
