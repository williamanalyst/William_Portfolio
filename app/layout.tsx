import type { Metadata } from "next";
import "./globals.css";
import { site } from "../content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: site.seo.title, template: `%s | ${site.name}` },
  description: site.seo.description,
  alternates: { canonical: "/" },
  authors: [{ name: site.name, url: site.linkedin }],
  keywords: ["data analytics leader", "AI leader", "data science", "machine learning", "pricing analytics", "automation", "Sydney"],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: site.siteUrl,
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "William Xie — Data Analytics & AI Leader" }]
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description, images: ["/og.png"] },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.siteUrl,
    sameAs: [site.linkedin],
    jobTitle: "Data Analytics & AI Leader",
    address: { "@type": "PostalAddress", addressLocality: "Sydney", addressCountry: "AU" },
    knowsAbout: ["Data analytics", "Artificial intelligence", "Machine learning", "Pricing analytics", "Data engineering", "Automation"]
  };

  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/></body></html>;
}
