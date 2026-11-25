import Link from "next/link";
import Image from "next/image";
import { getProducts, getFeaturedProducts, getCategories } from "@/lib/db";
import ProductCard from "@/components/product-card";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AgeGate from "@/components/age-gate";

export default async function Home() {
  const products = await getProducts();
  const featured = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <div className="flex flex-col flex-1">
      <AgeGate>
        <Nav />
        <main className="flex-1 relative overflow-hidden bg-black/[0.5]">
          {/* HERO */}
          <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-black/[0.8]">
            <div className="absolute inset-0 z-0">
              <Image
                src="/grinder1.jpeg"
                alt="Hero"
                fill
                sizes="100vw"
                className="object-cover object-center opacity-60 [mask-image:radial-gradient(circle_60%_at_50%_40%,black_70%,transparent)]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 slow-bg pointer-events-none" />
              <Image
                src="/LOGO.webp"
                alt="NOVA CORE"
                fill
                sizes="100vw"
                className="object-contain opacity-[0.04] mix-blend-screen pointer-events-none animate-[slow-pulse_6s_ease-in-out-infinite]"
                priority
              />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-400/40 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 animate-[fadeIn_0.8s_ease-out]">
                NEW COLLECTION · 2027
              </span>
              <h1 className="hero-text text-[3rem] sm:text-[5rem] md:text-[7rem] font-extrabold leading-[1] text-white text-balance mb-6 animate-[slide-up_1s_ease-out] both">
                PRECISION <br />
                <span className="gradient-text">REDEFINED.</span>
              </h1>
              <p className="hero-text text-lg md:text-xl text-steel-light max-w-2xl mx-auto mb-10 font-light tracking-wide animate-[fadeIn_1.2s_ease-out] both">
                Engineering meets edge. A limited series of premium grinders and lawful accessories,
                art-directed for the modern ritual.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeIn_1.4s_ease-out] both">
                <Link href="/shop" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                  EXPLORE COLLECTION
                </Link>
                <Link href="#brand" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/[0.15] bg-white/[0.05] text-white font-bold text-sm tracking-widest uppercase hover:bg-white/[0.12] transition-colors">
                  BRAND STORY
                </Link>
              </div>
            </div>
          </section>

          {/* NEW COLLECTION */}
          <section className="py-24 border-y border-white/[0.04] bg-white/[0.03]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white text-balance mb-3">THE NEW COLLECTION</h2>
                  <p className="text-steel-light">Twenty-four precision grinders. Each an individual product.</p>
                </div>
                <div className="flex gap-2 text-sm">
                  {categories.map((c) => (
                    <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`} className="px-4 py-2 rounded-full border border-white/[0.1] text-steel-light text-xs font-medium hover:bg-white/[0.05] hover:text-white transition-colors">
                      {c}
                    </Link>
                  ))}
                  <Link href="/shop" className="px-4 py-2 rounded-full border border-white/[0.1] text-white bg-white text-charcoal text-xs font-medium">VIEW ALL</Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>

          {/* BRAND */}
          <section id="brand" className="py-28 relative overflow-hidden bg-black/[0.5]">
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] bg-gradient-to-b from-[#0a0f1a]/90 to-[#0a0f1a]" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="relative h-[500px] md:h-[600px]">
                  <Image
                    src="/grinder5.jpeg"
                    alt="Brand editorial"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-full object-cover object-center rounded-[24px] border border-white/[0.08] shadow-2xl"
                  />
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full border-4 border-cyan-400/30 blur-[40px]" />
                </div>
                <div>
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] text-balance mb-8">
                    Built for the<br />
                    <span className="text-cyan-400">modern ritual.</span>
                  </h2>
                  <p className="text-steel-light text-lg leading-relaxed mb-8 max-w-lg font-light tracking-wide">
                    NOVA CORE is an art-directed accessories brand. We produce precision grinders and
                    lawful smoking accessories with a futuristic, minimalist aesthetic. No controlled
                    substances. No noise. Just form and function.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/about" className="px-8 py-3 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors">
                      LEARN MORE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BEST SELLERS */}
          <section className="py-20 bg-white/[0.02] border-y border-white/[0.02]">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Best Sellers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </AgeGate>
    </div>
  );
}


