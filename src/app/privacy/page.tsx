import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AgeGate from "@/components/age-gate";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1">
      <AgeGate>
        <Nav />
        <main className="flex-1 bg-black/[0.5] py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Privacy Policy</h2>
            <p className="text-steel-light leading-relaxed mb-6">
              NOVA CORE collects personal information (name, email, address) only to process and ship
              orders. We do not sell your data to third parties. Checkout data is handled by the store
              backend; no payment details are stored because no payment gateway is yet connected.
            </p>
            <p className="text-steel-light leading-relaxed mb-6">
              You may request deletion of your data by contacting hello@novacore.store.
            </p>
          </div>
          <Footer />
        </main>
      </AgeGate>
    </div>
  );
}


