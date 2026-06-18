import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcin Chrzuszcz",
  jobTitle: "Junior Fullstack Developer",
  url: SITE_URL,
  sameAs: [
    "https://github.com/mch-codes",
    "https://www.linkedin.com/in/marcin-chrzuszcz/",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Marcin Chrzuszcz — Junior Fullstack Developer | Madrid",
  description:
    "Junior fullstack developer based in Madrid. Next.js, TypeScript, React, Supabase. Open to work.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Marcin Chrzuszcz — Junior Fullstack Developer | Madrid",
    description:
      "Junior fullstack developer based in Madrid. Next.js, TypeScript, React, Supabase. Open to work.",
    type: "website",
    url: SITE_URL,
    siteName: "Marcin Chrzuszcz",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Marcin Chrzuszcz — Junior Fullstack Developer | Madrid" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcin Chrzuszcz — Junior Fullstack Developer | Madrid",
    description:
      "Junior fullstack developer based in Madrid. Next.js, TypeScript, React, Supabase. Open to work.",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "en" ? "en" : "es";

  return (
    <html lang={lang} className={spaceGrotesk.variable}>
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
