import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marcin — Fullstack Developer",
  description:
    "Fullstack developer and ex-chef building real SaaS products from Madrid. Next.js, Supabase, TypeScript.",
  openGraph: {
    title: "Marcin — Fullstack Developer & ex-Chef",
    description:
      "Building real products with modern tools. From Madrid's professional kitchens to production stacks.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={spaceGrotesk.variable}>
      <body className="noise-overlay">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
