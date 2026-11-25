"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div className="glass-dark rounded-[24px] p-10 md:p-16 w-full max-w-md border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-2 mb-8">
          <Image src="/LOGO.webp" alt="NOVA CORE" width={32} height={32} className="drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
          <span className="text-xl font-bold tracking-tighter text-white gradient-text">NOVA<span className="text-cyan-400">CORE</span></span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin sign in</h2>
        <p className="text-steel-light mb-8">Manage your store. Default: admin / admin</p>
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400 mb-6">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors placeholder-steel-light/50"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors placeholder-steel-light/50"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={submitting}
            className="w-full py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors disabled:opacity-50 shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
