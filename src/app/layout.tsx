import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const TITLE = "Brew & Go — Craft in Every Cup";
const DESCRIPTION =
  "Artisan coffee, handcrafted with care. Experience the perfect brew.";

/**
 * Link previews need absolute URLs. Vercel exports the production host; the
 * localhost fallback keeps `next dev` from warning about a missing base, and
 * NEXT_PUBLIC_SITE_URL overrides both when the site lives somewhere else.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// The card image itself is src/app/opengraph-image.png (and twitter-image.png);
// Next picks those up by filename and writes the tags with the right dimensions.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Brew & Go",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Brew & Go",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  // Cream is the page; espresso is the footer a dark-mode browser chrome sits against.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E8" },
    { media: "(prefers-color-scheme: dark)", color: "#2C1810" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body grain-overlay">{children}</body>
    </html>
  );
}
