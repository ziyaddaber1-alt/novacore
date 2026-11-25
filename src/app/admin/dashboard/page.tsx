import { getProducts, getOrders, getSettings } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    // handled by middleware, but safe fallback
    return null;
  }
  const products = await getProducts();
  const orders = await getOrders();
  const active = products.filter((p) => p.active).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const stat = (label: string, value: string | number, sub: string) => (
    <div className="glass-dark rounded-xl p-6 border border-white/[0.06]">
      <p className="text-xs font-bold uppercase tracking-widest text-steel-light mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-sm text-emerald-400">{sub}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-steel-light">Store overview</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {stat("Total products", products.length, `${products.length} in catalog`)}
        {stat("Active", String(active), `${products.length - active} draft`)}
        {stat("Out of stock", String(outOfStock), `0 stock remaining`)}
        {stat("Total revenue", `$${totalRevenue.toFixed(2)}`, `${orders.length} orders`)}
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 glass-dark rounded-xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-bold uppercase tracking-widest text-steel-light mb-6">Recent activity</h3>
          <div className="space-y-4">
            {orders.slice(0, 8).map((o) => (
              <div key={o.id} className="flex justify-between items-center text-sm border-b border-white/[0.04] pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-white font-medium">#{o.id.slice(-6)}</p>
                  <p className="text-xs text-steel-light">{o.customer.name} · {o.customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono">${o.total.toFixed(2)}</p>
                  <span className="text-xs px-2 py-1 rounded border border-white/[0.1] text-[10px] text-cyan-400 uppercase tracking-tighter">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-steel-light text-sm">No recent orders.</p>
            )}
          </div>
        </div>
        <div className="md:col-span-4 glass-dark rounded-xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-bold uppercase tracking-widest text-steel-light mb-6">Quick actions</h3>
          <div className="space-y-3">
            <a href="/admin/products" className="px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white hover:bg-white/[0.08] transition-colors block">
              Manage products
            </a>
            <a href="/admin/orders" className="px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white hover:bg-white/[0.08] transition-colors block">
              View orders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
