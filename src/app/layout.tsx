import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/react";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marcin-portfolio.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcin Chrzuszcz",
  jobTitle: "Fullstack Developer",
  url: SITE_URL,
  sameAs: [
    "https://github.com/mch-codes",
    "https://www.linkedin.com/in/marcin-chrzuszcz/",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Marcin Chrzuszcz — Fullstack Developer | Madrid",
  description:
    "Junior fullstack developer based in Madrid. Next.js, TypeScript, React, Supabase. Open to work.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Marcin Chrzuszcz — Fullstack Developer | Madrid",
    description:
      "Junior fullstack developer based in Madrid. Next.js, TypeScript, React, Supabase. Open to work.",
    type: "website",
    url: SITE_URL,
    siteName: "Marcin Chrzuszcz",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Marcin Chrzuszcz — Fullstack Developer | Madrid" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcin Chrzuszcz — Fullstack Developer | Madrid",
    description:
      "Junior fullstack developer based in Madrid. Next.js, TypeScript, React, Supabase. Open to work.",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "en" ? "en" : "es";

  return (
    <html lang={lang} className={`${fraunces.variable} ${plusJakartaSans.variable} ${ibmPlexMono.variable}`}>
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
