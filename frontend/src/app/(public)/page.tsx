import { HeroSection } from "@/components/public/HeroSection";
import { FeaturedAlbums } from "@/components/public/FeaturedAlbums";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { CTASection } from "@/components/public/CTASection";
import { HomePhotoMarquee } from "@/components/public/HomePhotoMarquee";
import { AboutSection } from "@/components/public/AboutSection";
import { OrnamentalDivider } from "@/components/public/OrnamentalDivider";
import { fetchSiteData } from "@/lib/mock-data";
import { mergeHomepageSections } from "@/lib/homepage-defaults";
import { collectAlbumGalleryImages } from "@/lib/gallery-images";

export default async function HomePage() {
  const data = await fetchSiteData();
  const sections = mergeHomepageSections(data.settings?.homepage_sections);
  const gallerySource =
    data.gallery_albums?.length ? data.gallery_albums : data.featured_albums;
  const galleryImages = collectAlbumGalleryImages(gallerySource);

  return (
    <>
      <HeroSection
        photographer={data.photographer}
        hero={sections.hero}
        galleryImages={galleryImages}
      />
      <HomePhotoMarquee images={galleryImages} />
      <OrnamentalDivider />
      <FeaturedAlbums albums={data.featured_albums} section={sections.featured} />
      {sections.about?.enabled !== false && data.photographer.bio && (
        <AboutSection
          label={sections.about?.label ?? "About"}
          bio={data.photographer.bio}
          images={galleryImages}
        />
      )}
      <OrnamentalDivider />
      <HomePhotoMarquee images={galleryImages} variant="light" />
      <ServicesSection
        services={data.settings?.services ?? []}
        section={sections.services}
      />
      <TestimonialsSection
        testimonials={data.testimonials}
        section={sections.testimonials}
      />
      <CTASection whatsapp={data.photographer.whatsapp_number} cta={sections.cta} />
    </>
  );
}
