import type { HomepageSections } from "@/types";

export const defaultHomepageSections: HomepageSections = {
  hero: {
    primary_cta: "View Portfolio",
    secondary_cta: "Book a Session",
  },
  featured: {
    label: "Portfolio",
    title: "Featured Stories",
  },
  about: {
    label: "About",
    enabled: true,
  },
  services: {
    label: "Services",
    title: "What We Create",
  },
  testimonials: {
    label: "Kind Words",
    title: "Client Love",
  },
  cta: {
    title: "Let's Create Something Timeless",
    subtitle:
      "Your story deserves to be told with artistry, emotion, and cinematic beauty.",
    primary_button: "Start Your Journey",
    secondary_button: "WhatsApp Us",
  },
};

export function mergeHomepageSections(
  stored?: Partial<HomepageSections>
): HomepageSections {
  return {
    hero: { ...defaultHomepageSections.hero, ...stored?.hero },
    featured: { ...defaultHomepageSections.featured, ...stored?.featured },
    about: { ...defaultHomepageSections.about, ...stored?.about },
    services: { ...defaultHomepageSections.services, ...stored?.services },
    testimonials: {
      ...defaultHomepageSections.testimonials,
      ...stored?.testimonials,
    },
    cta: { ...defaultHomepageSections.cta, ...stored?.cta },
  };
}
