"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  stock: number;
  sku: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", salePrice: "", image: "",
    category: "Grinders", stock: "", sku: "", active: "true", featured: "false",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({
      name: "", slug: "", description: "", price: "", salePrice: "", image: "",
      category: "Grinders", stock: "", sku: "", active: "true", featured: "false",
    });
    setEditId(null);
    setError("");
  };

  const openAdd = () => { resetForm(); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name, slug: p.slug, description: p.description,
      price: String(p.price), salePrice: String(p.salePrice ?? ""), image: p.image,
      category: p.category, stock: String(p.stock), sku: p.sku,
      active: String(p.active), featured: String(p.featured),
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body: any = {
        name: form.name, slug: form.slug, description: form.description,
        price: Number(form.price) || 0,
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        image: form.image, category: form.category,
        stock: Number(form.stock) || 0, sku: form.sku,
        active: form.active === "true", featured: form.featured === "true",
      };
      const res = editId
        ? await fetch(`/api/products/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      resetForm();
      setOpen(false);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Products</h2>
          <p className="text-steel-light">Manage your catalog.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_25px_rgba(255,255,255,0.2)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add product
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400">{error}</div>
      )}

      <div className="glass-dark rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light">Product</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light">SKU</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light">Category</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light text-right">Price</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light text-center">Stock</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-steel-light text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-steel-light">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-steel-light">No products.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-white/[0.06]" />
                      <div>
                        <p className="text-white font-medium">{p.name}</p>
                        <p className="text-xs text-steel-light">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-steel-light">{p.sku}</td>
                  <td className="px-6 py-4 text-xs text-steel-light">{p.category}</td>
                  <td className="px-6 py-4 text-xs text-right text-white">
                    {(p.salePrice ?? p.price).toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}
                  </td>
                  <td className="px-6 py-4 text-xs text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                      p.stock <= 0 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {p.stock <= 0 ? "Out of stock" : p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p.active}
                        onChange={() => {
                          // toggle handled via edit quick: just navigate? We'll keep simple; toggle via PATCH not exposed inline
                        }}
                        className="sr-only peer"
                      />
                      <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-400`}></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="mr-3 text-xs font-medium text-cyan-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs font-medium text-rose-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className={`fixed inset-0 z-50 ${open ? "flex" : "hidden"} items-center justify-center p-4 bg-black/[0.6] backdrop-blur-sm`}>
        <div className="glass-dark rounded-[20px] w-full max-w-2xl border border-white/[0.08] shadow-2xl flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{editId ? "Edit product" : "Add product"}</h3>
            <button onClick={() => setOpen(false)} className="text-steel-light hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Name</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Slug</label>
                <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Price</label>
                <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Sale price (optional)</label>
                <input type="number" value={form.salePrice} onChange={(e) => setForm((p) => ({ ...p, salePrice: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Image URL</label>
                <div className="relative">
                  <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="/grinder1.jpeg" />
                  <span className="absolute right-2 top-2 text-xs text-steel-light">Use external image URL (e.g. your own hosting)</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Category</label>
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option>Grinders</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">SKU</label>
                <input value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Active</label>
                <select value={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="true">Yes</option>
                  <option value="false">No (draft)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-steel-light">Featured</label>
                <select value={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="px-6 py-2 rounded-lg border border-white/[0.15] text-steel-light hover:bg-white/[0.05] transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-8 py-2 rounded-lg bg-white text-charcoal font-bold text-sm uppercase tracking-tighter hover:bg-cyan-400 transition-colors disabled:opacity-50">
                {saving ? "Saving…" : (editId ? "Update product" : "Create product")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

