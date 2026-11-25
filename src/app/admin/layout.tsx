"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const items = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "Layout" },
  { name: "Products", href: "/admin/products", icon: "Package" },
  { name: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
  { name: "Customers", href: "/admin/customers", icon: "Users" },
  { name: "Settings", href: "/admin/settings", icon: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-white/[0.06] transform transition-transform duration-300 ${collapsed ? "-translate-x-full" : "translate-x-0"} flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/[0.06]">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-xs tracking-tighter uppercase">NOVA</span>
            <span className="text-white font-bold text-xs tracking-tighter uppercase">CORE</span>
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="md:hidden p-1 text-steel-light"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {items.map((i) => {
            const active = activePath === i.href;
            return (
              <Link
                key={i.name}
                href={i.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                    : "text-steel-light hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {i.icon === "Layout" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h18a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />}
                  {i.icon === "Package" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                  {i.icon === "ShoppingBag" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                  {i.icon === "Users" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                  {i.icon === "Settings" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.995.605 2.296.07 2.57-1.065z" />}
                  {i.icon === "Package" || i.icon === "ShoppingBag"}
                </svg>
                {i.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-white/[0.05] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative md:pl-64">
        {/* top bar */}
        <header className="h-16 border-b border-white/[0.04] bg-white/[0.02] flex items-center justify-between px-8 shrink-0">
          <div className="text-lg font-bold text-white">{items.find((i) => activePath === i.href)?.name || "Admin"}</div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-steel-light hover:text-white underline underline-offset-4">Visit store</a>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
