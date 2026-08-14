import type { Metadata } from "next";
import { Fraunces, Inter, DM_Mono } from "next/font/google";
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

// Stands in for Neue Haas Grotesk, which is a licensed Monotype family and
// cannot be fetched here. Same neo-grotesque skeleton; a taller x-height and
// more open apertures are the visible differences. Variable, so no weight list.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Not a variable family, so every weight here is another file over the wire.
// 400 is the only one rendered: the mono runs are the About Me section, the
// Projects meta labels and the 404 label, none of which set a font-weight.
// Add a weight back the moment you write `font-semibold` on something mono —
// without it the browser synthesises a fake bold.
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marcin-portfolio-mocha.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcin Chrzuszcz",
  jobTitle: "Web Developer",
  url: SITE_URL,
  sameAs: [
    "https://github.com/mch-codes",
    "https://www.linkedin.com/in/marcin-chrzuszcz/",
  ],
};

// Stated once — it was three copies of the same two strings, and they had
// already drifted apart once.
const TITLE = "Marcin Chrzuszcz — Webs para oficios y negocios de Madrid";
const DESCRIPTION =
  "Webs a medida para talleres, tiendas y autónomos de Madrid: artesanía, hostelería, servicios. De las cocinas al código — sin plantillas. Desde 700€.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Marcin Chrzuszcz",
    // 1600x840, not the usual 1200x630. Same 1.91:1 ratio, but the hero sizes
    // the vertical surname at 17vh against a ~900px budget (About.tsx), so at
    // 630px tall the last letters of "Chrzuszcz" fall off the bottom. Shoot it
    // taller and every scraper downscales from a whole layout.
    images: [{ url: "/og.jpg", width: 1600, height: 840, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "en" ? "en" : "es";

  return (
    <html lang={lang} className={`${fraunces.variable} ${inter.variable} ${dmMono.variable}`}>
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
