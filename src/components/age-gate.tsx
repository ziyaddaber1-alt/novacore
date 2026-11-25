"use client";

import { useEffect, useState } from "react";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [showingGate, setShowingGate] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("nova_age_verified");
    if (stored === "true") {
      setVerified(true);
      setShowingGate(false);
    } else {
      setVerified(false);
      setShowingGate(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("nova_age_verified", "true");
    setVerified(true);
    setShowingGate(false);
  };

  if (showingGate) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/[0.8] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-dark rounded-[24px] p-8 border border-white/[0.08] shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center mx-auto mb-6 border border-cyan-400/30">
            <span className="text-cyan-400 text-xl font-bold">21+</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Age Verification</h2>
          <p className="text-steel-light mb-8">
            This site sells adult-oriented accessories. You must be 21 years of age or older to enter.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleEnter}
              className="px-8 py-3 rounded-full bg-white text-charcoal font-bold hover:bg-cyan-400 transition-colors"
            >
              I am 21 or over
            </button>
            <button
              onClick={() => {
                window.location.href = "https://google.com";
              }}
              className="px-8 py-3 rounded-full border border-white/[0.15] text-white hover:bg-white/[0.05] transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
