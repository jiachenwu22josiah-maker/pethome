import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PawGuide – Personalized Pet Care for Cats & Dogs",
  description:
    "Get a science-backed, AI-generated care guide tailored to your pet's breed, weight, personality, and your lifestyle. Feeding plans, exercise, bonding & more.",
  openGraph: {
    title: "PawGuide – Your Pet's Personalized Care Guide",
    description: "Feeding plans, exercise routines, bonding tips & more – all tailored to your pet.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="font-bold text-xl text-gray-900">PawGuide</span>
            </a>
            <div className="flex items-center gap-2">
              <a href="/bond" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-700 px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors">
                💕 Bond Score
              </a>
              <a href="/" className="btn-primary text-sm py-2 px-5">
                Get My Guide
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t border-gray-100 mt-24 py-10 text-center text-sm text-gray-400">
          <p>© 2025 PawGuide. Made with 🐾 for pet lovers.</p>
          <p className="mt-1">Not a substitute for professional veterinary advice.</p>
        </footer>
      </body>
    </html>
  );
}
