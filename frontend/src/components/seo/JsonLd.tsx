import type { Photographer } from "@/types";

interface JsonLdProps {
  photographer: Photographer;
  url: string;
}

export function JsonLd({ photographer, url }: JsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: photographer.business_name,
    description: photographer.tagline,
    url,
    areaServed: {
      "@type": "Country",
      name: photographer.country ?? "India",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: photographer.city,
      addressRegion: photographer.state,
      addressCountry: photographer.country,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
