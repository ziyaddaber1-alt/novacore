import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AgeGate from "@/components/age-gate";

export default function ContactPage() {
  return (
    <div className="flex flex-col flex-1">
      <AgeGate>
        <Nav />
        <main className="flex-1 bg-black/[0.5] py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white text-balance mb-8">Contact</h2>
            <p className="text-steel-light text-lg mb-12 max-w-xl">Reach the studio. We respond within 48 hours.</p>
            <div className="glass-dark rounded-xl p-10 border border-white/[0.08]">
              <p className="text-xs font-bold uppercase tracking-widest text-steel-light mb-6">Studio</p>
              <p className="text-white mb-4">hello@novacore.store</p>
              <p className="text-xs font-bold uppercase tracking-widest text-steel-light mb-6 mt-8">Legal age required</p>
              <p className="text-white">21+ where required. Lawful accessories only.</p>
            </div>
          </div>
          <Footer />
        </main>
      </AgeGate>
    </div>
  );
}


