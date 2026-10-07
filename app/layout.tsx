import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { siteName, siteUrl } from "./site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const title = "Article preview | Royer Adames";
const description = "Michelle Appleton's furniture article preview with a share menu, built for the Frontend Mentor article preview component challenge.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName, title, description, images: [{ url: "/images/drawers.jpg", width: 660, height: 528, alt: "A green chest of drawers with a vase of dried grass." }] },
};

const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
