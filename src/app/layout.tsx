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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marcin-portfolio-mocha.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcin Chrzuszcz",
  jobTitle: "Fullstack Developer",
  url: "https://marcin-portfolio-mocha.vercel.app",
  sameAs: [
    "https://github.com/mch-codes",
    "https://www.linkedin.com/in/marcin-chrzuszcz/",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Marcin — Fullstack Developer & ex-Chef | Madrid",
  description:
    "Fullstack developer and ex-chef building real SaaS products from Madrid. Next.js, Supabase, TypeScript. Available for projects.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Marcin — Fullstack Developer & ex-Chef | Madrid",
    description:
      "Building real products with modern tools. From Madrid's professional kitchens to production stacks.",
    type: "website",
    url: SITE_URL,
    siteName: "Marcin Chrzuszcz",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Marcin Chrzuszcz — Fullstack Developer & ex-Chef" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcin — Fullstack Developer & ex-Chef | Madrid",
    description:
      "Building real products with modern tools. From Madrid's professional kitchens to production stacks.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={spaceGrotesk.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
