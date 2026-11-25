import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AgeGate from "@/components/age-gate";

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1">
      <AgeGate>
        <Nav />
        <main className="flex-1 bg-black/[0.5]">
          <section className="py-24 border-b border-white/[0.04]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white text-balance mb-8">About NOVA CORE</h2>
              <p className="text-steel-light text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-light tracking-wide">
                NOVA CORE is an art-directed accessories brand built around precision grinders and lawful
                smoking accessories. Our visual language draws from premium streetwear, futuristic product
                photography, and cinematic minimalism.
              </p>
              <p className="text-steel-light text-lg leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
                We do not sell controlled substances. Every item in the catalog is a lawful accessory.
                Age verification is enforced where legally required.
              </p>
            </div>
          </section>
          <Footer />
        </main>
      </AgeGate>
    </div>
  );
}


