import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "NOVA CORE | Premium Grinders & Accessories",
  description: "Premium, futuristic grinders and smoking accessories. Art-directed for 2027.",
};

import { CartProvider, WishlistProvider } from "@/components/providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col antialiased text-white relative bg-transparent">
        {/* Full-screen brand background image */}
        <div
          className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.5] mix-blend-normal"
          style={{ backgroundImage: `url('/Background.jpeg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
