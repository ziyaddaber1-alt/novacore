import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function ThankYouPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = searchParams.orderId || "—";

  return (
    <div className="flex flex-col flex-1">
      <Nav />
      <main className="flex-1 bg-black/[0.35]">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 text-balance">Order Confirmed</h2>
          <p className="text-steel-light text-lg mb-8 max-w-md mx-auto font-light tracking-wide">
            Thank you for your order. Your order #{orderId} has been placed and is being prepared.
          </p>
          <Link href="/shop" className="px-12 py-5 rounded-full bg-white text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.25)]">
            Continue shopping
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
