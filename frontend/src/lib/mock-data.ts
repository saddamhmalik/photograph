import type { PublicSiteData } from "@/types";
import { resolveApiBaseUrl } from "@/lib/api-base";
import { defaultHomepageSections } from "@/lib/homepage-defaults";

export const mockSiteData: PublicSiteData = {
  photographer: {
    uuid: "demo",
    business_name: "LensCraft Studios",
    tagline: "Stories woven in light & emotion",
    bio: "Award-winning wedding and lifestyle photographer based in Jammu, capturing timeless moments across India.",
    hero_image_path:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=85",
    hero_video_url:
      "https://www.youtube.com/watch?v=ufyi9-AqBb0",
    whatsapp_number: "919876543210",
    city: "Jammu",
    state: "Jammu and Kashmir",
    country: "India",
    social_links: {
      instagram: "https://instagram.com",
    },
  },
  gallery_albums: [
    {
      uuid: "1",
      title: "Arjun Weds Anjani",
      slug: "arjun-weds-anjani",
      location: "Udaipur",
      cover_path:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      is_featured: true,
      is_public: true,
    },
    {
      uuid: "2",
      title: "Pooja's Birthday",
      slug: "poojas-birthday",
      location: "Mumbai",
      cover_path:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
      is_featured: true,
      is_public: true,
    },
    {
      uuid: "3",
      title: "Kashmir Pre Wedding Shoot",
      slug: "kashmir-pre-wedding-shoot",
      location: "Srinagar",
      cover_path:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
      is_featured: true,
      is_public: true,
    },
    {
      uuid: "4",
      title: "Royal Jaipur Wedding",
      slug: "royal-jaipur-wedding",
      location: "Jaipur",
      cover_path:
        "https://images.unsplash.com/photo-1606800052052-a08af8348b69?w=1200&q=80",
      is_public: true,
    },
  ],
  featured_albums: [
    {
      uuid: "1",
      title: "Arjun Weds Anjani",
      slug: "arjun-weds-anjani",
      location: "Udaipur",
      cover_path:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      is_featured: true,
    },
    {
      uuid: "2",
      title: "Pooja's Birthday",
      slug: "poojas-birthday",
      location: "Mumbai",
      cover_path:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
      is_featured: true,
    },
    {
      uuid: "3",
      title: "Kashmir Pre Wedding Shoot",
      slug: "kashmir-pre-wedding-shoot",
      location: "Srinagar",
      cover_path:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
      is_featured: true,
    },
  ],
  testimonials: [
    {
      uuid: "t1",
      client_name: "Anjani & Arjun",
      event_type: "Wedding",
      content:
        "Rahul captured our Udaipur wedding like a Bollywood dream. Every frame tells our story.",
      rating: 5,
    },
    {
      uuid: "t2",
      client_name: "Pooja Mehta",
      event_type: "Birthday",
      content:
        "The most beautiful birthday portraits. Elegant, emotional, and absolutely stunning.",
      rating: 5,
    },
  ],
  settings: {
    branding: { primary_color: "#c9a962", accent_color: "#1a1a1a" },
    seo: {
      title: "LensCraft Studios | Premium Wedding Photography",
      description:
        "Cinematic wedding photography in Jammu, Kashmir, Delhi & across India.",
    },
    services: [
      {
        name: "Wedding Photography",
        description: "Full-day cinematic coverage",
      },
      {
        name: "Pre-Wedding Shoots",
        description: "Destination & studio sessions",
      },
      {
        name: "Portrait Sessions",
        description: "Editorial & lifestyle portraits",
      },
    ],
    contact: {
      email: "hello@lenscraft.in",
      phone: "+91 98765 43210",
      address: "Gandhi Nagar, Jammu, Jammu and Kashmir 180004",
    },
    homepage_sections: defaultHomepageSections,
  },
};

export async function fetchSiteData(): Promise<PublicSiteData> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/public`, {
      headers: { Accept: "application/json" },
      next: { tags: ["public-site"] },
    });
    if (!res.ok) throw new Error("Failed to load site");
    return (await res.json()) as PublicSiteData;
  } catch {
    return mockSiteData;
  }
}
