import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gura | East Africa's Marketplace",
  description: "Buy and sell locally on Gura. Discover fashion, electronics, vehicles, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${dmSans.variable} ${spaceMono.variable} antialiased`}
      >
        <header className="bg-white border-b border-slate-tint sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-2xl font-heading font-bold text-gura-orange tracking-tight">GURA</h1>
            <nav className="hidden md:flex gap-6">
              <a href="#" className="font-heading text-midnight-ink hover:text-gura-orange transition-colors">Categories</a>
              <a href="#" className="font-heading text-midnight-ink hover:text-gura-orange transition-colors">Sell</a>
              <a href="#" className="font-heading text-midnight-ink hover:text-gura-orange transition-colors">Sign In</a>
            </nav>
            <button className="md:hidden p-2">
              <span className="text-midnight-ink font-heading">Menu</span>
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto min-h-screen">
          {children}
        </main>
        <footer className="bg-midnight-ink text-warm-linen py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-gura-orange mb-4">GURA</h2>
              <p className="font-body text-sm opacity-80">Empowering peer-to-peer commerce across East Africa.</p>
            </div>
            <div>
              <h3 className="font-heading text-lg mb-4">Marketplace</h3>
              <ul className="font-body text-sm space-y-2 opacity-80">
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Fashion</a></li>
                <li><a href="#">Vehicles</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-lg mb-4">Support</h3>
              <ul className="font-body text-sm space-y-2 opacity-80">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Safety Center</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
