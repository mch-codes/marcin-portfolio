import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marcin-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Marcin — Fullstack Developer & ex-Chef | Madrid",
  description:
    "Fullstack developer and ex-chef building real SaaS products from Madrid. Next.js, Supabase, TypeScript. Available for projects.",
  openGraph: {
    title: "Marcin — Fullstack Developer & ex-Chef | Madrid",
    description:
      "Building real products with modern tools. From Madrid's professional kitchens to production stacks.",
    type: "website",
    url: SITE_URL,
    siteName: "Marcin Chrzuszcz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcin — Fullstack Developer & ex-Chef | Madrid",
    description:
      "Building real products with modern tools. From Madrid's professional kitchens to production stacks.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={spaceGrotesk.variable}>
      <body>
        <LanguageProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
