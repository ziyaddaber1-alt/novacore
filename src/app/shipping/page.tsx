import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AgeGate from "@/components/age-gate";

export default function ShippingPage() {
  return (
    <div className="flex flex-col flex-1">
      <AgeGate>
        <Nav />
        <main className="flex-1 bg-black/[0.5] py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Shipping</h2>
            <p className="text-steel-light leading-relaxed mb-6">
              Orders are processed within 1-2 business days. Shipping is free on all domestic orders.
            </p>
            <p className="text-steel-light leading-relaxed mb-6">
              Delivery times vary by destination. International shipments are subject to local customs
              regulations; the buyer is responsible for compliance with local laws regarding accessories.
            </p>
          </div>
          <Footer />
        </main>
      </AgeGate>
    </div>
  );
}


