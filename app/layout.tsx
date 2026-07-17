import type { Metadata } from "next";
import "./globals.css";
import { site } from "../content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: site.seo.title, template: `%s | ${site.name}` },
  description: site.seo.description,
  openGraph: { type: "website", locale: "en_AU", siteName: site.name, title: site.seo.title, description: site.seo.description },
  twitter: { card: "summary", title: site.seo.title, description: site.seo.description }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
