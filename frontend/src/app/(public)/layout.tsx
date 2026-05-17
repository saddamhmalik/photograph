import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PublicShell } from "@/components/public/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchSiteData } from "@/lib/mock-data";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchSiteData();
    const seo = data.settings?.seo;
    return {
      title: seo?.title ?? data.photographer.business_name,
      description: seo?.description ?? data.photographer.tagline,
      openGraph: {
        title: seo?.title ?? data.photographer.business_name,
        description: seo?.description,
        type: "website",
      },
    };
  } catch {
    return { title: "Photography" };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchSiteData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <PublicShell>
      <JsonLd photographer={data.photographer} url={siteUrl} />
      <Navbar businessName={data.photographer.business_name} />
      <main>{children}</main>
      <Footer photographer={data.photographer} />
    </PublicShell>
  );
}
