import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AgeGate from "@/components/age-gate";

export default function TermsPage() {
  return (
    <div className="flex flex-col flex-1">
      <AgeGate>
        <Nav />
        <main className="flex-1 bg-black/[0.5] py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Terms of Service</h2>
            <p className="text-steel-light leading-relaxed mb-6">
              By using this site you agree to be 21 years of age or older where legally required, and
              to purchase only lawful accessories. No controlled substances are sold or shipped.
            </p>
            <p className="text-steel-light leading-relaxed mb-6">
              Prices are in MAD and may be updated by the administrator at any time. All sales are
              recorded and viewable in the admin dashboard at /admin.
            </p>
          </div>
          <Footer />
        </main>
      </AgeGate>
    </div>
  );
}


