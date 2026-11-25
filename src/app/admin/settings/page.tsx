"use client";

import { useState, useEffect } from "react";

type Settings = {
  store: { name: string; email: string; currency: string };
  legal: { ageVerification: boolean; market: string };
  admin: { username: string };
  hasPassword: boolean;
  webhookUrl?: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", currency: "MAD", ageVerification: true, market: "MA",
    username: "", password: "", webhookUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<"ok" | "error" | null>(null);
  const [webhookError, setWebhookError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
      setForm({
        name: data.store?.name || "", email: data.store?.email || "", currency: data.store?.currency || "MAD",
        ageVerification: !!data.legal?.ageVerification, market: data.legal?.market || "US",
        username: data.admin?.username || "", password: "", webhookUrl: data.webhookUrl || "",
      });
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      const body: any = {
        store: { name: form.name, email: form.email, currency: form.currency },
        legal: { ageVerification: form.ageVerification, market: form.market },
        webhookUrl: form.webhookUrl,
        username: form.username,
      };
      if (form.password) body.password = form.password;
      const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      setMessage("Settings saved.");
    } catch (err: any) {
      setMessage(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!form.webhookUrl) return;
    setTestingWebhook(true);
    setWebhookStatus(null);
    setWebhookError(null);
    try {
      const res = await fetch(form.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "test-order",
          customer: { name: "Test Customer", email: "test@example.com", phone: "", address: "", city: "", country: "" },
          items: [{ name: "Test Product", qty: 1, price: 100, image: "" }],
          subtotal: 100,
          total: 100,
          status: "test",
          createdAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        setWebhookStatus("error");
        setWebhookError(`Webhook returned ${res.status}`);
      } else {
        setWebhookStatus("ok");
        setWebhookError(null);
        setMessage("Webhook test successful — orders will be sent to Google Sheets.");
      }
    } catch (err: any) {
      setWebhookStatus("error");
      setWebhookError(err?.message || "Webhook test failed — CORS may block this on localhost; try on your production domain");
    } finally {
      setTestingWebhook(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-steel-light">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Store settings</h2>
        <p className="text-steel-light">Configure store identity and legal compliance.</p>
      </div>
      {message && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="glass-dark rounded-xl p-8 border border-white/[0.08] space-y-6 max-w-xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Store name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Email</label>
            <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Currency</label>
            <select value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
              <option>MAD</option><option>EUR</option><option>GBP</option><option>CAD</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Target market</label>
            <select value={form.market} onChange={(e) => setForm((p) => ({ ...p, market: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
              <option>US</option><option>CA</option><option>GB</option><option>EU</option><option>INT</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 pt-4 border-t border-white/[0.06]">
          <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Age verification required</label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.ageVerification} onChange={(e) => setForm((p) => ({ ...p, ageVerification: e.target.checked }))} className="rounded border-white/[0.2] text-cyan-400 focus:ring-cyan-400 bg-white/[0.03] border" />
            <span className="text-sm text-white">Enable 21+ age gate on storefront</span>
          </label>
        </div>
        <div className="space-y-2 pt-4 border-t border-white/[0.06]">
          <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Admin username</label>
          <input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        </div>
        <div className="space-y-2 pt-4 border-t border-white/[0.06]">
          <label className="text-xs font-bold uppercase tracking-widest text-steel-light">New password (leave blank to keep)</label>
          <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="••••••••" />
          <p className="text-[11px] text-steel-light">Stored hashed server-side. Never exposed to frontend.</p>
        </div>
        <div className="space-y-2 pt-4 border-t border-white/[0.06]">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Webhook URL (Google Sheets)</label>
            <input value={form.webhookUrl ?? ""} onChange={(e) => setForm((p) => ({ ...p, webhookUrl: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="https://script.google.com/macros/s/.../exec" />
            <p className="text-[11px] text-steel-light">Orders are POSTed here on checkout. Use a Google Apps Script web app URL to push orders into Google Sheets.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTestWebhook}
              disabled={saving || !form.webhookUrl}
              className="px-4 py-3 rounded-lg border border-white/[0.15] text-xs font-medium text-steel-light hover:bg-white/[0.05] transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {testingWebhook ? "Testing…" : "Test webhook"}
            </button>
            {form.webhookUrl && (
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                webhookStatus === "ok" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : webhookStatus === "error" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-white/[0.1] text-steel-light border border-white/[0.2]"
              }`}>
                {webhookStatus === "ok" ? "CONFIGURED ✓" : webhookStatus === "error" ? "ERROR ✗" : "NOT CONFIGURED"}
              </span>
            )}
          </div>
          {webhookError && (
            <div className="rounded-lg bg-rose-500/20 border border-rose-500/40 px-4 py-3 text-sm text-rose-400 mt-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="font-bold">Webhook error:</span> {webhookError}
            </div>
          )}
        </div>
        <button type="submit" disabled={saving} className="w-full py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors disabled:opacity-50 shadow-[0_0_25px_rgba(255,255,255,0.2)]">
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
