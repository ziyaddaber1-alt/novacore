import Link from "next/link";
import { getProducts, filterProducts, searchProducts, getCategories } from "@/lib/db";
import ProductCard from "@/components/product-card";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AgeGate from "@/components/age-gate";

export default async function Shop({ searchParams }: { searchParams: { category?: string; sort?: string; q?: string } }) {
  const category = searchParams.category || undefined;
  const sort = (searchParams.sort as "price-asc" | "price-desc" | "name" | undefined) || undefined;
  const q = searchParams.q || undefined;

  let products = q ? await searchProducts(q) : await filterProducts({ category, sort });
  const categories = await getCategories();

  return (
    <div className="flex flex-col flex-1">
      <AgeGate>
        <Nav />
        <main className="flex-1 bg-black/[0.45]">
          <header className="border-b border-white/[0.04] bg-white/[0.02] backdrop-blur-md sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <h1 className="text-3xl font-bold text-white text-balance mb-2">
                {q ? `Search results for "{q}"` : category ? category : "Shop"}
              </h1>
              <p className="text-steel-light text-sm">{products.length} products</p>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="md:col-span-3 space-y-4">
                <div className="glass-dark rounded-xl p-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-3">Filter by category</label>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={"/shop" + (q ? `?q=${encodeURIComponent(q)}` : "")}
                      className="px-4 py-2 rounded-full border border-white/[0.1] text-xs font-medium text-steel-light hover:text-white hover:border-white transition-colors category-active"
                    >
                      All
                    </Link>
                    {categories.map((c) => {
                      const active = category === c;
                      return (
                        <Link
                          key={c}
                          href={`/shop?category=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                          className={`px-4 py-2 rounded-full border text-xs font-medium transition-colors ${active ? "bg-cyan-400 text-charcoal border-cyan-400" : "border-white/[0.1] text-steel-light hover:text-white hover:border-white"}`}
                        >
                          {c}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="glass-dark rounded-xl p-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-3">Sort by</label>
                  <div className="flex gap-3">
                    <Link
                      href={`/shop?${category ? `category=${encodeURIComponent(category)}&` : ""}${q ? `q=${encodeURIComponent(q)}&` : ""}sort=price-asc`}
                      className="px-4 py-2 rounded-full border border-white/[0.1] text-xs font-medium text-steel-light hover:text-white transition-colors"
                    >
                      Price low → high
                    </Link>
                    <Link
                      href={`/shop?${category ? `category=${encodeURIComponent(category)}&` : ""}${q ? `q=${encodeURIComponent(q)}&` : ""}sort=price-desc`}
                      className="px-4 py-2 rounded-full border border-white/[0.1] text-xs font-medium text-steel-light hover:text-white transition-colors"
                    >
                      Price high → low
                    </Link>
                  </div>
                </div>
              </div>
              <aside className="hidden md:block self-start w-full md:w-auto">
                <form action="/shop" method="get" className="glass-dark rounded-xl p-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-steel-light mb-3">Search</label>
                  <div className="relative">
                    <input
                      name="q"
                      defaultValue={q ?? ""}
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors placeholder-steel-light/50"
                      placeholder="Search products…"
                    />
                    <button type="submit" className="absolute right-2 top-2 text-steel-light hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                  </div>
                  {category && (
                    <input type="hidden" name="category" value={category} />
                  )}
                </form>
              </aside>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {products.length > 0 ? (
                products.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-steel-light text-lg">No products found.</p>
                  <Link href="/shop" className="mt-4 inline-block text-cyan-400 text-sm font-medium hover:underline">Reset filters</Link>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </main>
      </AgeGate>
    </div>
  );
}

